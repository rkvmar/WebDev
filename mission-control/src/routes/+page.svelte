<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { csv } from 'd3-fetch';
	import WaypointMarker from '$lib/components/WaypointMarker.svelte';
	import AircraftMarker from '$lib/components/AircraftMarker.svelte';
	import Nav from '$lib/components/Nav.svelte';

	let map: any;
	let waypoints: any[] = [];
	let aircraft: any[] = [];
	let waypointsLoaded = false;
	let aircraftLoaded = false;
	let pollingInterval: any;
	// Using Map to track aircraft by their icao24 identifier
	let aircraftMap = new Map();

	// Map center and search radius
	const centerLat = 37.61916;
	const centerLon = -122.37412;
	const distNM = 100; // 100 nautical miles

	// Convert nautical miles to degrees (approximate)
	// 1 nautical mile is approximately 1/60 of a degree of latitude
	// For longitude, we need to adjust for the cosine of the latitude
	function nmToLatLonBoundary(lat: number, lon: number, distNM: number) {
		const latDegrees = distNM / 60;
		const lonDegrees = distNM / (60 * Math.cos((lat * Math.PI) / 180));

		return {
			minLat: lat - latDegrees,
			maxLat: lat + latDegrees,
			minLon: lon - lonDegrees,
			maxLon: lon + lonDegrees
		};
	}

	// Calculate boundary for our area
	const boundary = nmToLatLonBoundary(centerLat, centerLon, distNM);

	// Function to fetch aircraft data
	async function fetchAircraftData() {
		// Use our proxy endpoint
		const url = `/api/aircraft?lat=${centerLat}&lon=${centerLon}&dist=${distNM}`;

		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log('API response received, raw data:', data);

			// Check the structure of the data
			if (data.aircraft && Array.isArray(data.aircraft) && data.aircraft.length > 0) {
				console.log('Found aircraft in response:', data.aircraft.length);

				// Create a new Map for the current aircraft data
				const updatedAircraftMap = new Map();

				// Process the aircraft data
				data.aircraft
					.filter((plane: any) => plane.lat && plane.lon) // Ensure we have coordinates
					.forEach((plane: any) => {
						const aircraftData = [
							plane.hex || plane.icao, // icao24 [0]
							plane.flight?.trim() || 'N/A', // callsign [1]
							null, // origin country [2]
							plane.seen || null, // time position [3]
							plane.seen || null, // last contact [4]
							plane.lon, // longitude [5]
							plane.lat, // latitude [6]
							plane.alt_baro || plane.alt || 0, // altitude [7]
							plane.gnd === 1 || plane.ground, // on ground [8]
							plane.gs || plane.speed || null, // velocity [9]
							plane.track || plane.heading || null, // heading [10]
							plane.baro_rate || plane.vert_rate || null, // vertical rate [11]
							null, // sensors [12]
							plane.alt_geom || null, // baro altitude [13]
							plane.squawk || null, // squawk [14]
							null, // spi [15]
							null // position source [16]
						];

						// Use the icao24 as a unique key
						const icao24 = aircraftData[0];
						updatedAircraftMap.set(icao24, aircraftData);
					});

				// Update the aircraftMap with the new data
				aircraftMap = updatedAircraftMap;

				// Convert the Map values to an array for rendering
				aircraft = Array.from(aircraftMap.values());
				aircraftLoaded = true;

				console.log(
					`Processed ${aircraft.length} aircraft (updated: ${new Date().toLocaleTimeString()})`
				);
			} else {
				console.log('No aircraft found in the data or unexpected data format:', data);
				aircraftMap = new Map();
				aircraft = [];
				aircraftLoaded = true;
			}
		} catch (error) {
			console.error('Error fetching or processing aircraft data:', error);
			aircraftMap = new Map();
			aircraft = [];
			aircraftLoaded = true;
		}
	}

	onMount(async () => {
		// Initialize the map
		map = L.map('map').setView([centerLat, centerLon], 9);
		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">CartoDB</a> | Aircraft data: <a href="https://adsb.fi">adsb.fi</a>'
		}).addTo(map);

		// Visualize the boundary circle (optional)
		L.circle([centerLat, centerLon], {
			radius: distNM * 1852, // Convert NM to meters (1 NM = 1852 meters)
			color: 'rgba(255,255,255,0.2)',
			fillColor: 'rgba(0,0,0,0)',
			weight: 1
		}).addTo(map);

		// Load waypoints from CSV
		try {
			const allWaypoints = await csv('/data/FIX_BASE.csv');

			// Filter waypoints using the same boundary as aircraft
			waypoints = allWaypoints.filter((wp: any) => {
				const lat = parseFloat(wp.LAT_DECIMAL);
				const lng = parseFloat(wp.LONG_DECIMAL);

				return (
					lat >= boundary.minLat &&
					lat <= boundary.maxLat &&
					lng >= boundary.minLon &&
					lng <= boundary.maxLon
				);
			});

			waypointsLoaded = true;
			console.log(`Loaded ${waypoints.length} waypoints in the specified region`);
		} catch (error) {
			console.error('Error loading waypoints:', error);
		}

		// Initial fetch of aircraft data
		console.log('Performing initial aircraft data fetch...');
		await fetchAircraftData();

		// Set up polling every 5 seconds
		pollingInterval = setInterval(() => {
			fetchAircraftData();
		}, 1500);
	});

	onDestroy(() => {
		// Clean up the interval when component is destroyed
		if (pollingInterval) clearInterval(pollingInterval);
	});
</script>

<div id="map" style="width: 100%; height: 100vh;"></div>
{#if map && waypointsLoaded}
	{#each waypoints as waypoint}
		<WaypointMarker {waypoint} {map} />
	{/each}
{/if}

{#if map && aircraftLoaded && aircraft.length > 0}
	{#each aircraft as plane (plane[0])}
		<AircraftMarker aircraft={plane} {map} />
	{/each}
{/if}
<Nav />

<style>
	:global(.aircraft-icon) {
		font-size: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.aircraft-icon div) {
		display: inline-block;
	}

	.aircraft-count {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 5px 10px;
		font-size: 14px;
		z-index: 1000;
		border-radius: 3px;
	}
</style>

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

	// Store waypoints by their layer (now as an array of arrays to avoid reactivity issues)
	let waypointsArray: [string, any[]][] = [];

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
							null, // position source [16]
							plane.desc || null, // aircraft type [17]
							plane.t || null //short aircraft type
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

	// Define layer groups
	let layerGroups: { [key: string]: any } = {};

	onMount(async () => {
		// Initialize the map
		map = L.map('map').setView([centerLat, centerLon], 9);

		// Add the basemap layer
		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">CartoDB</a> | Aircraft data: <a href="https://adsb.fi">adsb.fi</a>'
		}).addTo(map);

		// Visualize the boundary circle
		L.circle([centerLat, centerLon], {
			radius: distNM * 1852, // Convert NM to meters (1 NM = 1852 meters)
			color: 'rgba(255,255,255,0.2)',
			fillColor: 'rgba(0,0,0,0)',
			weight: 1
		}).addTo(map);

		// Create layer groups
		layerGroups = {
			SID: L.layerGroup().addTo(map),
			STAR: L.layerGroup().addTo(map),
			AREA: L.layerGroup().addTo(map),
			OTHER: L.layerGroup().addTo(map),
			AIRCRAFT: L.layerGroup().addTo(map)
		};

		// Load waypoints from CSV
		try {
			console.log('Loading waypoints from CSV...');
			const allWaypoints = await csv('/data/FIX_BASE.csv');
			console.log(`CSV loaded with ${allWaypoints.length} total waypoints`);

			// Log the first waypoint to see its structure
			if (allWaypoints.length > 0) {
				console.log('Sample waypoint structure:', allWaypoints[0]);
			}

			// Filter waypoints using the boundary
			waypoints = allWaypoints.filter((wp: any) => {
				const lat = parseFloat(wp.LAT_DECIMAL);
				const lng = parseFloat(wp.LONG_DECIMAL);

				return (
					!isNaN(lat) &&
					!isNaN(lng) &&
					lat >= boundary.minLat &&
					lat <= boundary.maxLat &&
					lng >= boundary.minLon &&
					lng <= boundary.maxLon
				);
			});

			console.log(`Filtered down to ${waypoints.length} waypoints in the boundary`);

			// Categorize waypoints - create a temporary storage
			const waypointsByType = {
				SID: [],
				STAR: [],
				AREA: [],
				OTHER: []
			};

			// Add waypoints to the appropriate category
			let layerKey: string;
			waypoints.forEach((waypoint) => {
				if (waypoint.CHARTS && typeof waypoint.CHARTS === 'string') {
					if (waypoint.CHARTS.includes('SID')) {
						layerKey = 'SID';
					} else if (waypoint.CHARTS.includes('STAR')) {
						layerKey = 'STAR';
					} else if (waypoint.CHARTS.includes('AREA')) {
						layerKey = 'AREA';
					} else {
						layerKey = 'OTHER';
					}
				}

				// If the layer doesn't exist or the code is empty, use OTHER
				if (!layerKey || !waypointsByType[layerKey]) {
					layerKey = 'OTHER';
				}

				// Add the waypoint to the appropriate category
				waypointsByType[layerKey].push(waypoint);
			});

			// Convert to array format for svelte binding
			waypointsArray = Object.entries(waypointsByType);

			// Log counts by category to verify distribution
			waypointsArray.forEach(([type, items]) => {
				console.log(`Waypoint type ${type}: ${items.length} items`);
			});

			// Set up layer control
			const overlays = {
				'SID Waypoints': layerGroups['SID'],
				'STAR Waypoints': layerGroups['STAR'],
				'AREA Waypoints': layerGroups['AREA'],
				'Other Waypoints': layerGroups['OTHER'],
				Aircraft: layerGroups['AIRCRAFT']
			};

			// Add the layer control to the map
			L.control
				.layers(null, overlays, {
					collapsed: false,
					position: 'topright'
				})
				.addTo(map);

			waypointsLoaded = true;
			console.log('Waypoints loaded and categorized');
		} catch (error) {
			console.error('Error loading waypoints:', error);
			waypointsLoaded = true; // Set to true so the app doesn't get stuck
		}

		// Initial fetch of aircraft data
		console.log('Performing initial aircraft data fetch...');
		await fetchAircraftData();

		// Set up polling every 1.5 seconds
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

<!-- Render waypoints using the Svelte component for each layer -->
{#if map && waypointsLoaded && waypointsArray.length > 0}
	<div style="display:none">
		{#each waypointsArray as [layerType, layerWaypoints]}
			{#each layerWaypoints as waypoint}
				<WaypointMarker {waypoint} {map} layer={layerGroups[layerType]} />
			{/each}
		{/each}
	</div>
{/if}

{#if map && aircraftLoaded && aircraft.length > 0}
	{#each aircraft as plane (plane[0])}
		<AircraftMarker aircraft={plane} {map} layer={layerGroups['AIRCRAFT']} />
	{/each}
{/if}

<Nav {aircraft} />

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

	:global(.leaflet-control-layers) {
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 5px;
		padding: 6px 10px;
	}

	:global(.leaflet-control-layers-overlays) {
		color: black;
		font-size: 0.9em;
	}

	:global(.leaflet-control) {
		z-index: 1000;
	}
</style>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { csv } from 'd3-fetch';
	import WaypointMarker from '$lib/components/WaypointMarker.svelte';
	import AircraftMarker from '$lib/components/AircraftMarker.svelte';

	let map;
	let waypoints = [];
	let aircraft = [];
	let waypointsLoaded = false;
	let aircraftLoaded = false;
	let pollingInterval; // Store interval reference for cleanup

	// Function to fetch aircraft data
	async function fetchAircraftData(lamin, lomin, lamax, lomax) {
		const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();

			if (data.states && data.states.length > 0) {
				aircraft = data.states;
				aircraftLoaded = true;
				console.log(
					`Found ${aircraft.length} aircraft (updated: ${new Date().toLocaleTimeString()})`
				);
			} else {
				console.log('No aircraft found in the specified region');
				aircraft = [];
				aircraftLoaded = true;
			}
		} catch (error) {
			console.error('Error fetching data from OpenSky API:', error);
		}
	}

	onMount(async () => {
		// Initialize the map
		map = L.map('map').setView([37.61916, -122.37412], 11);
		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">CartoDB</a>'
		}).addTo(map);

		const lamin = 36.983229; // minimum latitude
		const lomin = -123.255615; // minimum longitude
		const lamax = 38.237181; // maximum latitude
		const lomax = -121.602173; // maximum longitude

		// Load waypoints from CSV
		try {
			// Change this path to where your CSV is located
			waypoints = await csv('/data/FIX_BASE.csv');

			// Filter waypoints to those in our map area
			waypoints = waypoints.filter((wp) => {
				const lat = parseFloat(wp.LAT_DECIMAL);
				const lng = parseFloat(wp.LONG_DECIMAL);
				return lat >= lamin && lat <= lamax && lng >= lomin && lng <= lomax;
			});

			waypointsLoaded = true;
			console.log(`Loaded ${waypoints.length} waypoints in the specified region`);
		} catch (error) {
			console.error('Error loading waypoints:', error);
		}

		// Initial fetch of aircraft data
		await fetchAircraftData(lamin, lomin, lamax, lomax);

		// Set up polling every second
		pollingInterval = setInterval(() => {
			fetchAircraftData(lamin, lomin, lamax, lomax);
		}, 5000);
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

{#if map && aircraftLoaded}
	{#each aircraft as plane}
		<AircraftMarker aircraft={plane} {map} />
	{/each}
{/if}

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
</style>

<script>
	export let aircraft;
	export let map;

	import { onMount, onDestroy, afterUpdate } from 'svelte';

	let marker;

	// Function to create or update the marker
	function updateMarker() {
		// Extract aircraft properties
		const icao24 = aircraft[0];
		const callsign = aircraft[1] ? aircraft[1].trim() : 'N/A';
		const longitude = parseFloat(aircraft[5]);
		const latitude = parseFloat(aircraft[6]);
		const altitude = aircraft[7];
		const heading = aircraft[10]; // Track angle in degrees

		if (latitude && longitude) {
			const rotationAngle = heading !== null ? heading - 45 : 0;

			// Create a custom icon with rotation based on heading
			const aircraftIcon = L.divIcon({
				className: 'aircraft-icon',
				html: `<div style="${heading !== null ? `transform: rotate(${rotationAngle}deg);` : ''}">✈️</div>`,
				iconSize: [20, 20],
				iconAnchor: [10, 10]
			});

			if (marker) {
				// Update existing marker position
				marker.setLatLng([latitude, longitude]);
				// Update the icon to reflect new heading
				marker.setIcon(aircraftIcon);
				// Update popup content
				marker.getPopup().setContent(`
					<strong>${callsign}</strong> (${icao24})<br>
					Altitude: ${altitude ? `${Math.round(altitude)}ft` : 'N/A'}<br>
					Heading: ${heading !== null ? `${Math.round(heading)}°` : 'N/A'}
				`);
			} else {
				// Create new marker
				marker = L.marker([latitude, longitude], { icon: aircraftIcon }).addTo(map).bindPopup(`
					<strong>${callsign}</strong> (${icao24})<br>
					Altitude: ${altitude ? `${Math.round(altitude)}ft` : 'N/A'}<br>
					Heading: ${heading !== null ? `${Math.round(heading)}°` : 'N/A'}
				`);
			}
		}
	}

	onMount(() => {
		updateMarker();
	});

	// Run updateMarker whenever the aircraft data changes
	afterUpdate(() => {
		updateMarker();
	});

	onDestroy(() => {
		if (marker && map) {
			map.removeLayer(marker);
		}
	});
</script>

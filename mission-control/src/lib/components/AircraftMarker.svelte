<script>
	export let aircraft;
	export let map;

	import { onMount, onDestroy } from 'svelte';

	let marker;

	// Extract aircraft properties
	const icao24 = aircraft[0];
	const callsign = aircraft[1] ? aircraft[1].trim() : 'N/A';
	const longitude = aircraft[5];
	const latitude = aircraft[6];
	const altitude = aircraft[7];
	const heading = aircraft[10]; // Track angle in degrees

	onMount(() => {
		if (latitude && longitude) {
			// Create a custom icon with rotation based on heading
			const aircraftIcon = L.divIcon({
				className: 'aircraft-icon',
				html: `<div style="${heading ? `transform: rotate(${heading}deg);` : ''}">✈️</div>`,
				iconSize: [20, 20],
				iconAnchor: [10, 10]
			});

			marker = L.marker([latitude, longitude], { icon: aircraftIcon }).addTo(map).bindPopup(`
          <strong>${callsign}</strong> (${icao24})<br>
          Altitude: ${altitude ? `${Math.round(altitude)}m` : 'N/A'}<br>
          Heading: ${heading ? `${Math.round(heading)}°` : 'N/A'}
        `);
		}
	});

	onDestroy(() => {
		if (marker && map) {
			map.removeLayer(marker);
		}
	});
</script>

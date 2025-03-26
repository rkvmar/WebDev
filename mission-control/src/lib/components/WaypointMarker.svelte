<script>
	export let waypoint;
	export let map;
	export let layer = null;

	import { onMount, onDestroy } from 'svelte';

	let marker;

	onMount(() => {
		console.log('Creating waypoint marker for:', waypoint.FIX_ID);

		try {
			const iapIcon = L.icon({
				iconUrl: 'IAP.png',
				iconSize: [30, 30],
				iconAnchor: [15, 15],
				popupAnchor: [0, -15]
			});
			const sidIcon = L.icon({
				iconUrl: 'SID.png',
				iconSize: [30, 30],
				iconAnchor: [15, 15],
				popupAnchor: [0, -15]
			});
			const planIcon = L.icon({
				iconUrl: 'planning.png',
				iconSize: [30, 30],
				iconAnchor: [15, 15],
				popupAnchor: [0, -15]
			});
			const starIcon = L.icon({
				iconUrl: 'star.png',
				iconSize: [30, 30],
				iconAnchor: [15, 15],
				popupAnchor: [0, -15]
			});
			const smolIcon = L.icon({
				iconUrl: 'navaid.png',
				iconSize: [10, 10],
				iconAnchor: [5, 5],
				popupAnchor: [0, -5]
			});

			let chosenIcon = smolIcon;
			if (waypoint.CHARTS && typeof waypoint.CHARTS === 'string') {
				if (waypoint.CHARTS.includes('SID')) {
					chosenIcon = sidIcon;
				} else if (waypoint.CHARTS.includes('STAR')) {
					chosenIcon = starIcon;
				} else if (waypoint.CHARTS.includes('AREA')) {
					chosenIcon = planIcon;
				} else {
					chosenIcon = iapIcon;
				}
			}

			// Check if we have valid coordinates
			const lat = parseFloat(waypoint.LAT_DECIMAL);
			const lng = parseFloat(waypoint.LONG_DECIMAL);

			if (!isNaN(lat) && !isNaN(lng)) {
				marker = L.marker([lat, lng], {
					icon: chosenIcon
				}).bindPopup(`
					<strong>${waypoint.FIX_ID}</strong><br>
					Position: ${lat}, ${lng}<br>
					Region: ${waypoint.ICAO_REGION_CODE}<br>
					Charts: ${waypoint.CHARTS || 'N/A'}<br>
					${waypoint.CHARTING_REMARK ? `Remark: ${waypoint.CHARTING_REMARK}` : ''}
				`);

				// Add to specific layer if provided, otherwise add directly to map
				if (layer) {
					marker.addTo(layer);
				} else {
					marker.addTo(map);
				}

				console.log(`Added waypoint ${waypoint.FIX_ID} to map/layer`);
			} else {
				console.warn(`Invalid coordinates for waypoint ${waypoint.FIX_ID}: ${lat}, ${lng}`);
			}
		} catch (error) {
			console.error(`Error creating waypoint marker for ${waypoint.FIX_ID}:`, error);
		}

		return () => {
			if (marker && map) {
				map.removeLayer(marker);
			}
		};
	});
</script>

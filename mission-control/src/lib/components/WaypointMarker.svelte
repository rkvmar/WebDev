<script>
	export let waypoint;
	export let map;

	import { onMount } from 'svelte';

	onMount(() => {
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
		if (waypoint.CHARTS.includes('SID')) {
			chosenIcon = sidIcon;
		} else if (waypoint.CHARTS.includes('STAR')) {
			chosenIcon = starIcon;
		} else if (waypoint.CHARTS.includes('AREA')) {
			chosenIcon = planIcon;
		} else {
			chosenIcon = iapIcon;
		}
		console.log(waypoint.CHARTS.type);
		const marker = L.marker([waypoint.LAT_DECIMAL, waypoint.LONG_DECIMAL], {
			icon: chosenIcon
		}).addTo(map).bindPopup(`
        <strong>${waypoint.FIX_ID}</strong><br>
        Position: ${waypoint.LAT_DECIMAL}, ${waypoint.LONG_DECIMAL}<br>
        Region: ${waypoint.ICAO_REGION_CODE}<br>
        Charts: ${waypoint.CHARTS}<br>
        ${waypoint.CHARTING_REMARK ? `Remark: ${waypoint.CHARTING_REMARK}` : ''}
      `);

		return () => {
			if (map) map.removeLayer(marker);
		};
	});
</script>

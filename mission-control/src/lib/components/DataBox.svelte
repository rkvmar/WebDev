<script lang="ts">
	export let aircraft;
	// Parse aircraft data
	$: icao24 = aircraft[0] || 'N/A';
	$: callsign = aircraft[1] ? aircraft[1].trim() : 'N/A';
	$: longitude = parseFloat(aircraft[5]) || 0;
	$: latitude = parseFloat(aircraft[6]) || 0;
	$: altitude = aircraft[7] || 'N/A';
	$: groundSpeed = aircraft[9] || 'N/A';
	$: heading = aircraft[10] !== null ? Math.round(aircraft[10]) : 'N/A';
	$: verticalRate = aircraft[11] || 'N/A';
	$: onGround = aircraft[8] ? 'Yes' : 'No';
	$: desc = aircraft[17] || 'N/A';
	$: formattedAltitude = altitude !== 'N/A' ? `${Math.round(altitude)} ft` : 'N/A';
	$: formattedSpeed = groundSpeed !== 'N/A' ? `${Math.round(groundSpeed)} kts` : 'N/A';
	$: formattedVerticalRate = verticalRate !== 'N/A' ? `${Math.round(verticalRate)} ft/min` : 'N/A';
	$: verticalTrend = verticalRate > 0 ? '↑' : verticalRate < 0 ? '↓' : '→';
</script>

<div class="aircraft-box">
	<div class="aircraft-header">
		<span class="callsign">{callsign}</span>
		<span class="icao">{desc}</span>
	</div>

	<div class="aircraft-details">
		<div class="detail-row">
			<div class="detail">
				<span class="label">Altitude</span>
				<span class="value">{formattedAltitude}</span>
			</div>
			<div class="detail">
				<span class="label">Speed</span>
				<span class="value">{formattedSpeed}</span>
			</div>
		</div>

		<div class="detail-row">
			<div class="detail">
				<span class="label">Heading</span>
				<span class="value">{heading !== 'N/A' ? `${heading}°` : 'N/A'}</span>
			</div>
			<div class="detail">
				<span class="label">Vertical</span>
				<span class="value">{verticalTrend} {formattedVerticalRate}</span>
			</div>
		</div>

		<div class="detail-row">
			<div class="detail">
				<span class="label">Position</span>
				<span class="value tiny">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
			</div>
			<div class="detail">
				<span class="label">On Ground</span>
				<span class="value">{onGround}</span>
			</div>
		</div>
	</div>
</div>

<style>
	.aircraft-box {
		background-color: rgba(35, 40, 66, 0.8);
		border-radius: 12px;
		padding: 15px;
		color: white;
		border: 1px solid rgba(158, 166, 237, 0.2);
		transition: all 0.2s;
		margin-top: 10px;
	}

	.aircraft-box:hover {
		background-color: rgba(45, 50, 76, 0.9);
		border-color: rgba(158, 166, 237, 0.5);
		transform: translateY(-2px);
	}

	.aircraft-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		border-bottom: 1px solid rgba(158, 166, 237, 0.2);
		padding-bottom: 8px;
	}

	.callsign {
		font-size: 18px;
		font-weight: bold;
		letter-spacing: 0.5px;
	}

	.icao {
		font-size: 12px;
		opacity: 0.7;
		font-family: monospace;
	}

	.aircraft-details {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}

	.detail {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.label {
		font-size: 12px;
		color: rgba(158, 166, 237, 0.7);
		margin-bottom: 2px;
	}

	.value {
		font-size: 14px;
		font-weight: 500;
	}

	.value.tiny {
		font-size: 11px;
		font-family: monospace;
	}
</style>

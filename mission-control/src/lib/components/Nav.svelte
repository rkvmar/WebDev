<script lang="ts">
	import { onMount } from 'svelte';
	import DataBox from '$lib/components/DataBox.svelte';

	// Accept aircraft data as a prop
	export let aircraft = [];

	let boxActive = false;
	let searchTerm = '';
	let filteredAircraft = [];

	function openBox() {
		boxActive = true;
	}

	function closeBox() {
		boxActive = false;
	}

	function handleKeydown(event: any) {
		if (event.key === '/') {
			event.preventDefault();
			openBox();
		}
		if (event.key === 'Escape') {
			event.preventDefault();
			closeBox();
		}
	}

	$: {
		if (aircraft && aircraft.length) {
			filteredAircraft = aircraft.filter((plane) => {
				const icao24 = plane[0] || '';
				const callsign = plane[1] || '';
				const searchLower = searchTerm.toLowerCase();

				return (
					icao24.toLowerCase().includes(searchLower) || callsign.toLowerCase().includes(searchLower)
				);
			});
		} else {
			filteredAircraft = [];
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<button class="nav" on:click={openBox}>
	<div class="search-container {boxActive ? 'active' : ''}">
		<div class="search-header">
			<img src="search.svg" class="search-icon {boxActive ? 'hidden' : ''}" />
			<input
				type="text"
				class="search-box {boxActive ? '' : 'hidden'}"
				on:focus={openBox}
				bind:value={searchTerm}
				placeholder="Search Aircraft"
			/>
		</div>

		{#if boxActive}
			<div class="aircraft-list">
				{#if filteredAircraft.length === 0}
					<div class="no-results">
						{aircraft.length === 0 ? 'No aircraft data available' : 'No matching aircraft found'}
					</div>
				{:else}
					{#each filteredAircraft as plane}
						<DataBox aircraft={plane} />
					{/each}
				{/if}
			</div>
		{/if}
	</div>
</button>

<style>
	.search-container {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		background-color: rgba(25, 30, 56, 0.9);
		display: flex;
		align-items: center;
		justify-content: flex-start;
		position: absolute;
		top: 10px;
		left: 50px;
		z-index: 9999;
		transition: all 0.2s ease;
		backdrop-filter: blur(10px);
		flex-direction: column;
		overflow: hidden;
	}
	.search-container:hover {
		background-color: rgba(59, 66, 102, 0.9);
	}

	.search-container.active {
		width: 80%;
		top: 5%;
		left: 10%;
		height: 90%;
		background-color: rgba(25, 30, 56, 0.9);
		padding: 20px;
		overflow-y: auto;
	}

	.search-header {
		display: flex;
		width: 100%;
		align-items: center;
		margin-bottom: 20px;
	}

	.search-icon {
		display: flex;
		color: white;
		width: 30px;
		height: 30px;
		margin: auto;
		margin-top: 10px;
		filter: invert(100%);
	}
	.search-icon.hidden {
		display: none;
	}

	.search-box {
		background-color: rgba(255, 255, 255, 0.1);
		border: none;
		border-radius: 20px;
		padding: 10px 15px;
		color: white;
		flex-grow: 1;
		outline: none;
		font-size: 16px;
	}

	.search-box::placeholder {
		color: rgba(255, 255, 255, 0.6);
	}

	.aircraft-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
		padding-right: 10px;
	}

	.no-results {
		color: white;
		text-align: center;
		padding: 20px;
		opacity: 0.7;
	}
</style>

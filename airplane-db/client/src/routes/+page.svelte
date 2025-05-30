<script lang="ts">
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Card from '$lib/components/Card.svelte';
	import Edit from '$lib/components/Edit.svelte';
	import AddPlane from '$lib/components/AddPlane.svelte';
	let showAddModal = false;
	import { mount } from 'svelte';
	let baseURL = 'http://localhost:3000';
	let planes: object[] = [];
	let searchQuery: string = '';
	let filteredPlanes: object[] = [];
	let editedPlane: any = null;

	async function fetchPlanes() {
		const response = await fetch(`${baseURL}/airplanes/`, {
			method: 'GET'
		});
		const data = await response.json();
		planes = data.sort((a: any, b: any) => a.registration.localeCompare(b.registration));
		filteredPlanes = planes;
	}
	function editPlane(data: object) {
		console.log('Editing plane:', data);
		editedPlane = data;
	}
	function closeWindow() {
		editedPlane = null;
	}
	function addPlane() {
		showAddModal = true;
	}
	function closeAddWindow() {
		showAddModal = false;
	}

	onMount(fetchPlanes);

	$: filteredPlanes = planes.filter((plane: any) =>
		[plane.registration, plane.airline, plane.model].some((field) =>
			field?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<Nav bind:value={searchQuery} on:add={addPlane} />
<div class="cardContainer">
	{#each filteredPlanes as airplane}
		<Card data={airplane} on:updated={fetchPlanes} on:edit={(event) => editPlane(event.detail)} />
	{/each}
</div>

{#if editedPlane}
	<Edit data={editedPlane} on:close={closeWindow} on:updated={fetchPlanes}></Edit>
{/if}
{#if showAddModal}
	<AddPlane on:close={closeAddWindow} on:added={fetchPlanes} />
{/if}

<style>
	.cardContainer {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>

<script>
	export let value = '';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	function add() {
		dispatch('add');
	}
</script>

<div class="navContainer">
	<div class="search">
		<input type="text" placeholder="Search" bind:value />
	</div>
	<div class="add" on:click={add}><img src="add.svg" /></div>
</div>

<style>
	.navContainer {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		font-size: 30px;
		margin: 20px;
	}
	.search {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		font-size: 30px;
		margin: 20px;
		width: 80%;
	}
	.search input {
		width: 80%;
		height: 100%;
		border-radius: 20px;
		border: none;
		background-color: rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(20px);
		padding: 10px;
		font-size: 20px;
		color: #333;
		font-family: 'Arial', sans-serif;
		text-align: center;
	}
	.add {
		width: 40px;
		height: 40px;
		padding: 10px;
		border-radius: 20px;
		background-color: rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all ease 0.2s;
	}
	.add:hover {
		background-color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
	}
	.add img {
		width: 100%;
		height: 100%;
	}
</style>

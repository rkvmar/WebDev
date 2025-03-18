<script>
	import { onMount } from 'svelte';

	let boxActive = false;
	let box;

	function toggleBox() {
		boxActive = !boxActive;
	}

	function handleKeydown(event) {
		if (event.key === '/') {
			event.preventDefault();
			toggleBox();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<button class="box" bind:this={box} on:click={toggleBox} class:boxactive={boxActive}>
	<img src="search.svg" />
</button>

<style>
	.box {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		background-color: rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 10px;
		left: 50px;
		z-index: 9999;
		transition: all 0.2s ease;
		backdrop-filter: blur(10px);
	}
	.boxactive {
		width: 80%;
		left: 10%;
		background-color: rgba(255, 255, 255, 0.6);
	}
</style>

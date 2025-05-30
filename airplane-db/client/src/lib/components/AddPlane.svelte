<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	const baseURL = 'http://localhost:3000';

	let registration = '';
	let airline = '';
	let model = '';
	let image = '';

	function closeWindow() {
		dispatch('close');
	}

	async function add() {
		try {
			const response = await fetch(`${baseURL}/airplanes/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					registration: registration,
					airline: airline,
					model: model,
					image: image,
					found: false
				})
			});

			if (!response.ok) {
				console.error('Failed to add airplane:', await response.text());
			} else {
				dispatch('added');
				closeWindow();
			}
		} catch (error) {
			console.error('Error making request:', error);
		}
	}
</script>

<div class="window">
	<div class="title">Add New Airplane</div>
	<div class="close" on:click={closeWindow}><img src="close.svg" /></div>
	<input bind:value={registration} placeholder="Registration" />
	<input bind:value={airline} placeholder="Airline" />
	<input bind:value={model} placeholder="Model" />
	<input bind:value={image} placeholder="Image URL" />
	<button on:click={add}>Add</button>
</div>

<style>
	.window {
		width: 80vw;
		height: 80vh;
		background-color: rgba(255, 255, 255, 0.4);
		position: fixed;
		z-index: 9999;
		overflow: hidden;
		top: 10vh;
		left: 10vw;
		backdrop-filter: blur(10px);
		border-radius: 25px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		color: #333;
		font-family: 'Arial', sans-serif;
		flex-direction: column;
	}
	.title {
		font-size: 32px;
		font-weight: bold;
		margin-top: 20px;
		margin-bottom: 20px;
		text-align: center;
	}
	.close {
		position: absolute;
		left: 10px;
		top: 10px;
		width: 35px;
		height: 35px;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all ease 0.2s;
	}
	.close:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}
	input {
		width: 80%;
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		background-color: rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(20px);
		padding: 10px;
		font-size: 20px;
		color: #333;
		font-family: 'Arial', sans-serif;
		text-align: center;
		margin-bottom: 20px;
	}
	button {
		width: 100px;
		height: 50px;
		border-radius: 20px;
		background-color: rgba(255, 255, 255, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(20px);
		padding: 10px;
		font-size: 20px;
		font-family: 'Arial', sans-serif;
		text-align: center;
		transition: all ease 0.2s;
		cursor: pointer;
	}

	button:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}
</style>

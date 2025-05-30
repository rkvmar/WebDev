<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();
	const { data } = $props();
	const baseURL = 'http://localhost:3000';
	const regLower = data.registration.toLowerCase();
	async function toggleCard() {
		try {
			const response = await fetch(`${baseURL}/airplanes`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: data._id, update: { found: !data.found } })
			});

			if (!response.ok) {
				console.error('Failed to update airplane:', await response.text());
			} else {
				dispatch('updated');
			}
		} catch (error) {
			console.error('Error making request:', error);
		}
	}
	async function editCard() {
		dispatch('edit', { data: data });
	}
</script>

<div class="card {data.found ? 'found' : ''}">
	<div class="check" on:click={toggleCard}><img src="check.svg" /></div>
	<div class="edit" on:click={editCard}><img src="pencil.svg" /></div>
	<div class="registration">{data.registration}</div>
	<img class="image" src={data.image} alt="Airplane Image" />
	<div class="airline">{data.airline}</div>
	<div class="model">{data.model}</div>
	<div class="links">
		<a href="https://www.flightradar24.com/data/aircraft/{regLower}">FR24</a>
	</div>
</div>

<style>
	.card {
		width: 500px;
		height: 300px;
		background-color: rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(20px);
		text-align: center;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 20px;
		border: 1px solid rgba(255, 255, 255, 0.5);
		transition: all 0.2s ease;
		cursor: pointer;
		font-size: 24px;
		color: #333;
		font-family: 'Arial', sans-serif;
		flex-direction: column;
	}
	.card.found {
		background-color: rgba(100, 255, 100, 0.3);
		border: 1px solid rgba(100, 255, 100, 0.5);
	}

	.card:hover {
		transform: scale(1.05);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
	}
	.card:hover .image {
		transform: scale(1.05);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
	}
	.check {
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
	.check:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}
	.edit {
		position: absolute;
		right: 10px;
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
	.edit:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}
	.registration {
		font-size: 32px;
		font-weight: bold;
	}
	.airline {
		font-size: 24px;
		margin-bottom: 5px;
	}
	.model {
		font-size: 20px;
	}
	.links a {
		text-decoration: none;
		color: #007bff;
		font-size: 15px;
	}
	.links a:hover {
		text-decoration: underline;
	}
	.image {
		width: 300px;
		border-radius: 10px;
		margin-top: 5px;
		transition: all 0.3s ease;
	}
</style>

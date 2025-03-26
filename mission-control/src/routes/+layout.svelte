<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		height: 100vh;
		overflow: hidden;
	}
</style>

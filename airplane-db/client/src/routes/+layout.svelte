<script lang="ts">
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(body) {
		background: linear-gradient(85deg, rgba(146, 202, 224, 1) 0%, rgba(243, 156, 255, 1) 100%);
	}
</style>

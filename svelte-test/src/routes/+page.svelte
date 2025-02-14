<script>
	let numbers = $state([1]);
    let sum = $derived(numbers.reduce((sum, n) => sum + n, 0));
	function addNumber() {
		numbers.push(numbers.length + 1)
	}
</script>

<p>{numbers.join(' + ')} = {sum}</p>

<button onclick={addNumber}>
	Add a number
</button>
<!-- Basic Svelte App file. The GUI component could be used as the base instead, but this has been kept since its the default for svelte -->
<script>
	//Project imports
	import GUI from './GUI.svelte';

</script>


<main>
	<GUI />
</main>


<style>
	main {
		padding: 0;
		margin: 0;
		height: 100%;
		width: 100%;
	}

	:global(body) {
		padding: 0;
		margin: 0;
	}


</style>
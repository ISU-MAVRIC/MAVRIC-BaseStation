<script>
	/*
	Map element for a waypoint or rover location popup. 
	This code was originally adapted from:
	
	Original blog post here: https://imfeld.dev/writing/leaflet_with_svelte

	Svelte example here: https://svelte.dev/repl/62271e8fda854e828f26d75625286bc3?version=4.2.14

	heroicons.dev for all the icons used here.
	*/
	export let coords;
	
</script>


<div style="width:100%;text-align:center;font-weight:600">
	Latitude: {coords[0]} 
	<br/>
	Longitude: {coords[1]}
</div>

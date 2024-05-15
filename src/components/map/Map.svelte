<script>
	/*
	Map element for displaying waypoints, the rover, and other information. 
	This code was originally adapted from:
	
	Original blog post here: https://imfeld.dev/writing/leaflet_with_svelte

	Svelte example here: https://svelte.dev/repl/62271e8fda854e828f26d75625286bc3?version=4.2.14

	heroicons.dev for all the icons used here.
	*/
	
	import L from 'leaflet';


	import MapToolbar from './MapToolbar.svelte';
	import MarkerPopup from './MarkerPopup.svelte';

	import * as markerIcons from './markers.js';
	import * as roverIcons from './roverMarker';

	import { DEFAULTS } from '../../utils/config.js';
	let map;
	

	export let markerLocations = [];
	export let roverCoords;
	export let roverHeading;

	
	const initialView = DEFAULTS.MAP.START_COORDS;
	function createMap(container) {
	  let m = L.map(container, {preferCanvas: true }).setView(initialView, 17);
    L.tileLayer(
	    'tiles/{z}/{x}/{y}.png',
	    {
	      attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
	      maxZoom: DEFAULTS.MAP.MAX_ZOOM,
        minZoom: DEFAULTS.MAP.MIN_ZOOM,
	    }
	  ).addTo(m);

		let southWestBound = L.latLng(DEFAULTS.MAP.SOUTHWEST_BOUND[0], DEFAULTS.MAP.SOUTHWEST_BOUND[1]);
		let northEastBound = L.latLng(DEFAULTS.MAP.NORTHEAST_BOUND[0], DEFAULTS.MAP.NORTHEAST_BOUND[1]);
		let bounds = L.latLngBounds(southWestBound, northEastBound);
		m.setMaxBounds(bounds);

    return m;
  }
	
	let eye = true;
	let lines = true;
	
	let toolbar = L.control({ position: 'topright' });
	let toolbarComponent;
	toolbar.onAdd = (map) => {
		let div = L.DomUtil.create('div');
		toolbarComponent = new MapToolbar({
			target: div,
			props: {}
		});

		toolbarComponent.$on('click-eye', ({ detail }) => eye = detail);
		toolbarComponent.$on('click-lines', ({ detail }) => lines = detail);
		toolbarComponent.$on('click-reset', () => {
			map.setView(roverCoords , 17, { animate: true })
		})

		return div;
	}

	toolbar.onRemove = () => {
		if(toolbarComponent) {
			toolbarComponent.$destroy();
			toolbarComponent = null;
		}
	};
	
	// Create a popup with a Svelte component inside it and handle removal when the popup is torn down.
	// `createFn` will be called whenever the popup is being created, and should create and return the component.
	function bindPopup(marker, createFn) {
		let popupComponent;
		marker.bindPopup(() => {
			let container = L.DomUtil.create('div');
			popupComponent = createFn(container);
			return container;
		});

		marker.on('popupclose', () => {
			if(popupComponent) {
				let old = popupComponent;
				popupComponent = null;
				// Wait to destroy until after the fadeout completes.
				setTimeout(() => {
					old.$destroy();
				}, 500);

			}
		});
	}
	
	let markers = new Map();
	
	function markerIcon(count) {
		let html = `<div class="map-marker"><div>${markerIcons.library}</div><div class="marker-text">${count}</div></div>`;
		return L.divIcon({
			html,
			className: 'map-marker'
		});
	}


	function roverIcon(rotation) {
		let html = `<div class="map-marker"><div style="transform-origin: center; transform: rotate(${rotation}deg);" >${roverIcons.library}</div></div>`;

		return L.divIcon({
			html,
			className: 'map-marker'
		})
	}
	

	function createMarker(type, loc, iconText) {
		let coords = loc;
		let icon;
		if (type == "ROVER") {
			icon = roverIcon(roverHeading);
		} else if (type == "WAYPOINT") {
			icon = markerIcon(iconText);
		}
		let marker = L.marker(loc, {icon});
		bindPopup(marker, (m) => {
			let c = new MarkerPopup({
				target: m,
				props: {
					coords
				}
			});
			
			
			return c;
		});
		
		return marker;
	}
	
	function createLines() {
		return L.polyline([roverCoords].concat(markerLocations), { color: '#FF0000', opacity: 0.2 });
	}

	let waypointLayers;
	let roverLayer;
	let lineLayers;
  function mapAction(container) {
    map = createMap(container); 
		toolbar.addTo(map);
		
		waypointLayers = L.layerGroup();
		roverLayer = L.layerGroup();
		let roverMarker = createMarker("ROVER", roverCoords);
		roverLayer.addLayer(roverMarker);
		//https://stackoverflow.com/questions/37563811/leaflet-need-to-draw-range-radius-semi-circles add direction low opacity indicator?
 		for(let index = 1; index < markerLocations.length; index++) {
			let location = markerLocations[index]
 			let m = createMarker("WAYPOINT", location,index);
			 waypointLayers.addLayer(m);
 		}
		
		lineLayers = createLines();
		
		roverLayer.addTo(map);
		waypointLayers.addTo(map);
		lineLayers.addTo(map);
		
    return {
       destroy: () => {
				 toolbar.remove();
				 map.remove();
				 map = null;
			 }
    };
	}
	
	// We could do these in the toolbar's click handler but this is an example
	// of modifying the map with reactive syntax.
	$: if(waypointLayers && map) {
		if(eye) {
			waypointLayers.addTo(map);
		} else {
			waypointLayers.remove();
		}
	}
	
	$: if(lineLayers && map) {
		if(lines) {
			lineLayers.addTo(map);
		} else {
			lineLayers.remove();
		}
	}

	$: if(markerLocations && roverCoords && roverHeading && map && waypointLayers && lineLayers) {
 
		waypointLayers.clearLayers();
		roverLayer.clearLayers();
		let roverMarker = createMarker("ROVER", roverCoords);
		roverLayer.addLayer(roverMarker);
		let index = 1;
 		for(let location of markerLocations) {
 			let m = createMarker("WAYPOINT",location, index);
			 waypointLayers.addLayer(m);
			index++;
 		}
		
		lineLayers.remove();
		lineLayers = createLines();

		roverLayer.addTo(map);

		if(eye) {
			waypointLayers.addTo(map);
		} else {
			waypointLayers.remove();

		}
		if(lines) {
			lineLayers.addTo(map);
		} else {
			lineLayers.remove();
		}
	}

	function resizeMap() {
	  if(map) { map.invalidateSize(); }
  }

</script>
<svelte:window on:resize={resizeMap} />

<style>
	.map :global(.marker-text) {
		width:100%;
		text-align:center;
		font-weight:600;
		background-color:#444;
		color:#EEE;
		border-radius:0.5rem;
	}
	
	.map :global(.map-marker) {
		width:30px;
		transform:translateX(-25%) translateY(-50%);
	}
</style>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<div class="map" style="height:100%;width:100%" use:mapAction />
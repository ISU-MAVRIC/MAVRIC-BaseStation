<script>
  export let waypointsList;
  export let setWaypoints;
  let waypointModalOpen = false;
  let modalLatitude = 0;
  let modalLongitude = 0;

  let dropIndex = null;
  let dragStartIndex = null;

  let addWaypointToStart = false;



  //Might need to do $: waypoints && with a function listening for changes on the lat and long input data binds
  let updateWaypoints = (waypoints) => {
    waypointsList = waypointsList;
    setWaypoints(waypointsList);
  }

  let addWaypoint = (newWaypoint) => {

    waypointsList.push(newWaypoint);

    updateWaypoints(waypointsList);

  }

  let addWaypointAtIndex = (newWaypoint, index) => {
    waypointsList.splice(index, 0, newWaypoint);
    updateWaypoints(waypointsList);
  }

  let deleteWaypoint = (index) => {
    waypointsList.splice(index, 1)
    updateWaypoints(waypointsList);
  }


  let openWaypointModal = () => {
    waypointModalOpen = true;
  }

  let closeWaypointModal = () => {
    waypointModalOpen = false;
  }

  let addWaypointButton = () => {
    if (addWaypointToStart) {
      addWaypointAtIndex([modalLongitude, modalLatitude], 0)
    } else {
      addWaypoint([modalLongitude, modalLatitude]);
    }
    updateWaypoints(waypointsList);
    closeWaypointModal();
  }

  let dragOver = (index) => {
    dropIndex = index;
  }

  let dragStart = (index) => {
    dragStartIndex = index;
  }

  let dragEnd = () => {
    let waypoint = waypointsList[dragStartIndex];
    deleteWaypoint(dragStartIndex);
    addWaypointAtIndex(waypoint, dropIndex);
    dragStartIndex = null;
    dropIndex = null;
  }


</script>

<div class="waypoint-container">
  <h1 class="title"> Waypoints </h1>
  {#if waypointsList != null} 
    {#each waypointsList as waypoint, index}
      <div 
        class="waypoint-card" 
        on:dragover={dragOver.bind(this, index)}
        on:dragstart={dragStart.bind(this, index)} 
        on:dragend={dragEnd}
        draggable="true">
        <div>
          <span class="waypoint-delete" on:click={deleteWaypoint.bind(this, index)}>&times;</span>
          <div>
            <span>Lon:</span>
            <input class="waypoint-input" type="number" min="-90" max="90" bind:value={waypoint[0]} />
          </div>
          
          <div>
            <span>Lat:</span>
            <input class="waypoint-input" type="number" min="-90" max="90" bind:value={waypoint[1]} />
          </div>
        </div>
      </div>
    {/each}
    <div class="waypoint-card waypoint-add-card" on:click={openWaypointModal}>
      <span>+ Add Waypoint</span>
    </div>

    <div id="waypoint-modal" class="modal" style={ waypointModalOpen ? "display: block;" : "display: none;"}>

      <!-- Modal content -->
      <div class="modal-content">
        <span class="close" on:click={closeWaypointModal}>&times;</span>
        <h3>Enter Waypoint</h3>
        <span>Longitude</span>
        <input class="modal-input" type="number" max="90" min="-90" bind:value={modalLongitude}/> 
        <br/>
        <span>Latitude</span>
        <input class="modal-input" type="number" max="90" min="-90"  bind:value={modalLatitude}/>
        <br />
        <div class="modal-add-behavior">
          <div class={addWaypointToStart ? "modal-add-option" : "modal-add-option modal-add-selected" } on:click={() => {addWaypointToStart = false}}>
            Add to End
          </div>
          <div class={!addWaypointToStart ? "modal-add-option" : "modal-add-option modal-add-selected" } on:click={() => {addWaypointToStart = true}}>
            Add to Start
          </div>
        </div>
        <div class="waypoint-add-card" on:click={addWaypointButton}>+ Add</div>
      </div>
    
    </div>
  {:else}
  <div class="waypoint-card">
    <p>Waiting to receive waypoints from rover...</p>    
  </div>

  {/if}
</div>


<style>

  .waypoint-container {
    width: 100%; 
    height: 100%;
    overflow: hidden scroll;
  }

  .title {
    margin:0;
    text-align: center;
  }

  .waypoint-card {
    border-radius: 15px;
    margin: 10px 5px;
    padding: 10px 5px;
    background: lightgray;
  }

  .waypoint-input {
    width: 80%;
  }

  .waypoint-add-card {
    text-align: center;
    width: 100%;
  }

  .waypoint-delete {
    float: right;
    order: 2;
    font-size: 28px;
    font-weight: bold;
  }

  .modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  .modal-add-behavior {
    display: flex;
    width: 100%;
    justify-content: space-around;
    transition: all .5s ease-out;
  }

  .modal-add-option {
    background-color: rgb(111, 111, 111);
    padding: 10px 10px;
  }

  .modal-add-option:hover {
    transition: all .3s ease-out;
    opacity: 50%;
  }

  .modal-add-selected {
    background-color: lightgrey;
  }

  .modal-input {
    width: 100%;
  }

  /* Modal Content/Box */
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    max-width: 400px;
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
  }

  /* The Close Button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }



</style>
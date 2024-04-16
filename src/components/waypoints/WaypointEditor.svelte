<!-- Custom component for editing/managing rover waypoint list -->
<script>
  //Svelte properties for component
  export let waypointsList;
  export let setWaypoints;

  //Variables for waypoint entry modal
  let waypointModalOpen = false;
  let modalLatitude = 0;
  let modalLongitude = 0;
  let addWaypointToStart = false;

  //Variables for handling drag and drop
  let dropIndex = null;
  let dragStartIndex = null;





  //Might need to do $: waypoints && with a function listening for changes on the lat and long input data binds
  //Function that will update and set waypoints
  let updateWaypoints = (waypoints) => {
    //Set waypointList = waypointList so svelte recognizes the data as being updates
    //Just modifying array might not update svelte component
    waypointsList = waypointsList;
    setWaypoints(waypointsList);
  }

  //This method adds a waypoint to list and forces an update
  let addWaypoint = (newWaypoint) => {
    waypointsList.push(newWaypoint);
    updateWaypoints(waypointsList);

  }

  //This function adds a waypoint to a specific index in the list
  let addWaypointAtIndex = (newWaypoint, index) => {
    waypointsList.splice(index, 0, newWaypoint);
    updateWaypoints(waypointsList);
  }

  //This function removes a waypoint from the list and forces an update
  let deleteWaypoint = (index) => {
    waypointsList.splice(index, 1)
    updateWaypoints(waypointsList);
  }

  //Function to open the add waypoint popup modal
  let openWaypointModal = () => {
    waypointModalOpen = true;
  }

  //Function to close the add waypoint popup modal
  let closeWaypointModal = () => {
    waypointModalOpen = false;
  }

  //Function called when add waypoint is clicked in modal
  let addWaypointButton = () => {
    //If they selected add to waypoint list start
    if (addWaypointToStart) {
      addWaypointAtIndex([modalLongitude, modalLatitude], 0)
    // if they selected to add to end
    } else {
      addWaypoint([modalLongitude, modalLatitude]);
    }
    //Force waypoint array update
    updateWaypoints(waypointsList);
    //Close modal
    closeWaypointModal();
  }

  /// DRAG AND DROP HANDLING

  //onDragOver listener for waypoint elements that sets where drag and drop will be dropped
  let dragOver = (index) => {
    dropIndex = index;
  }

  //onDragStart listener that sets the dragStartIndex to the element that is being dragged
  let dragStart = (index) => {
    dragStartIndex = index;
  }

  //listener for when the drag ends
  let dragEnd = () => {
    //Get the waypoint that was being dragged
    let waypoint = waypointsList[dragStartIndex];
    //Delete it from list
    deleteWaypoint(dragStartIndex);
    //Add it to list at new dropIndex
    addWaypointAtIndex(waypoint, dropIndex);
    //Reset drag and drop variables
    dragStartIndex = null;
    dropIndex = null;
  }

  ///


</script>
<!-- Main container element -->
<div class="waypoint-container">
  <!-- Set Waypoint header at top of element -->
  <h1 class="title"> Waypoints </h1>
  <!-- If we have loaded the waypointList -->
  {#if waypointsList != null} 
    <!-- Create waypoint card for each waypoint -->
    {#each waypointsList as waypoint, index}
      <div 
        class="waypoint-card" 
        on:dragover={dragOver.bind(this, index)}
        on:dragstart={dragStart.bind(this, index)} 
        on:dragend={dragEnd}
        draggable="true">

        <div>
          <!-- Waypoint delete button -->
          <span class="waypoint-delete" on:click={deleteWaypoint.bind(this, index)}>&times;</span>
          <!-- Display/Inputs for long and lat -->
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
    <!-- Button to add a waypoint -->
    <div class="waypoint-card waypoint-add-card" on:click={openWaypointModal}>
      <span>+ Add Waypoint</span>
    </div>

    <!-- Modal for adding a waypoint, hidden unless waypointModalOpen is true -->
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
  <!-- if waypoint list is null (hasnt been received), set page to loading instead -->
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
    z-index: 9999; /* Sit on top */
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
<!-- This component is responsible for displaying the PageNavBar section of the GUI layout. If you don't know the basic layout of the GUI, see the "Basic GUI Layout" section of the README-->

<script>
  //Component properties
  export let PAGES;
  export let selected;

  //Function for switching the page when someone clicks on an item in the nav bar
  const setPage = page => {
    selected = page;
  };
</script>

<!-- Create nav bar to be displayed -->
<ul>
  <!-- Element for displaying MAVRIC Logo in top left -->
  <li class="mavric-icon"> MAVRIC ICON</li>
  <!-- for each of the defined pages, add the corresponding icon and link to the nav bar -->
  {#each PAGES as page}
    <li class={page.label == selected ? 'selected' : ""} on:click={setPage.bind(this, page.label)}>
      <div class="nav-item">
        <div class="nav-icon">
          <svelte:component this={page.icon} />
        </div>
        <p class="nav-label">{page.label}</p>
      </div>
    </li>
  {/each}
</ul>

<style>
  ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;

  width: 20%;
  min-width: 75px;
  background-color: lightgray;
  height: 100%;
  overflow: auto;
  }

  @media only screen and (max-width: 700px) {
    .nav-label {
      display: none;
    }
    .nav-item {
      justify-content: center;
    }
    .nav-icon {
    height: 9vw;
    width: 9vw;
    }
  }

  @media only screen and (min-width: 700px) {
    .nav-label {
      display: block;
    }
    .nav-item {
      justify-content: left;
    }
    .nav-icon {
    height: 5vw;
    width: 5vw;
    }
  }
  .mavric-icon {
    height: 10%;
    padding: 0
  }

  li {
  display: block;
  color: #000;
  padding: 5px 5px 0px 5px;
  text-decoration: none;
  }

  .nav-item {
    height: 100%;
    width: 100%;
    display: flex;
  }
  
  .nav-label {
    flex-grow: 1;
    font-size: 1.5vw;
    padding-left: 5px;
  }
  
  
  
  li:hover {
    background-color: #555;
    color: white;
    transition: all .2s ease-in;
  }
  
  .selected {
    background-color: rgb(250, 36, 36);
    
  }
</style>
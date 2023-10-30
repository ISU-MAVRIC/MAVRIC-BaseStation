<script>
  export let PAGES;
  export let selected;

  const setPage = page => {
    selected = page;
  };
</script>

<ul>
  <li class="mavric-icon"> MAVRIC ICON</li>
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
  background-color: #f1f1f1;
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
  }

  .selected {
    background-color: red;
  }
</style>
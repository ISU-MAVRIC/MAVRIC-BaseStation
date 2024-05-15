<!-- This component is responsible for displaying the PageNavBar section of the GUI layout. If you don't know the basic layout of the GUI, see the "Basic GUI Layout" section of the README-->

<script>
  //Component properties
  export let PAGES;
  export let selected;
  export let controllerEnabled;
  export let navCollapsed;

  //Function for switching the page when someone clicks on an item in the nav bar
  const setPage = page => {
    selected = page;
  };

</script>

<!-- Create nav bar to be displayed -->
<ul>
  <!-- Element for displaying MAVRIC Logo in top left -->
  <li class="mavric-icon"> <img alt="Mavric Logo" src="favicon.png" height=100% width=100% /></li>
  <!-- for each of the defined pages, add the corresponding icon and link to the nav bar -->
  {#each PAGES as page}
    <li class={page.label == selected ? 'selected' : ""} on:click={setPage.bind(this, page.label)}>
      <div class="nav-item">
        <div class="nav-icon">
          {@html page.icon}
        </div>
        {#if !navCollapsed}
          <p class="nav-label">{page.label}</p>
        {/if}
      </div>
    </li>
  {/each}

  <li>
    <div class="nav-item" on:click={() => {controllerEnabled = !controllerEnabled}}>
      <div class="nav-icon">
        <!--TEMP:  Controller Enable/Disable svg -->
        <svg fill="#000000" opacity={controllerEnabled ? 1 : .1} height="100%" viewBox="0 0 35 35" data-name="Layer 2" id="a1d0d4f7-4fce-4383-abe2-cf50798f66e5" xmlns="http://www.w3.org/2000/svg"><path d="M13.2,18.456H8.475a1.25,1.25,0,1,1,0-2.5H13.2a1.25,1.25,0,0,1,0,2.5Z"/><path d="M10.839,20.82a1.25,1.25,0,0,1-1.25-1.25V14.841a1.25,1.25,0,0,1,2.5,0V19.57A1.25,1.25,0,0,1,10.839,20.82Z"/><path d="M20.954,18.515a1.251,1.251,0,0,0,0-2.5,1.251,1.251,0,0,0,0,2.5Z"/><path d="M23.8,15.67a1.251,1.251,0,0,0,0-2.5,1.251,1.251,0,0,0,0,2.5Z"/><path d="M23.68,21.241a1.251,1.251,0,0,0,0-2.5,1.251,1.251,0,0,0,0,2.5Z"/><path d="M26.525,18.4a1.251,1.251,0,0,0,0-2.5,1.251,1.251,0,0,0,0,2.5Z"/><path d="M28.886,34.75a4.9,4.9,0,0,1-4.752-3.663l-1.4-4.1a20.448,20.448,0,0,1-10.436-.068l-1.456,4.257a4.725,4.725,0,0,1-1.717,2.549,4.905,4.905,0,0,1-7.9-3.836V19.2c0-.31.038-.868.054-1.08l-.052-.945A10.494,10.494,0,0,1,11.693,6.641a10.351,10.351,0,0,1,3.728.686,3.821,3.821,0,0,0,1.373.235h1.412a3.751,3.751,0,0,0,1.353-.227A10.32,10.32,0,0,1,23.5,6.643,10.674,10.674,0,0,1,33.781,17.42V29.892A4.881,4.881,0,0,1,28.886,34.75ZM23.5,24.141a1.253,1.253,0,0,1,1.183.846l1.841,5.384a2.438,2.438,0,0,0,2.359,1.879,2.379,2.379,0,0,0,2.395-2.358V17.42a8.163,8.163,0,0,0-7.822-8.277,7.78,7.78,0,0,0-3,.524h0a6.249,6.249,0,0,1-2.255.395H16.794a6.311,6.311,0,0,1-2.269-.4,7.858,7.858,0,0,0-2.832-.52,7.978,7.978,0,0,0-7.974,7.965l.054.955a1.9,1.9,0,0,1,0,.2c-.011.141-.05.66-.05.938V29.892a2.406,2.406,0,0,0,3.871,1.86,2.35,2.35,0,0,0,.855-1.29l1.869-5.475a1.251,1.251,0,0,1,1.59-.777c.062.02,6.155,2.075,11.123.025A1.247,1.247,0,0,1,23.5,24.141ZM20.01,8.5h0Z"/><path d="M18.294,7.261a1.23,1.23,0,0,1-.105-1.184,1.891,1.891,0,0,1,.874-1.04A4.97,4.97,0,0,1,22.7,4.874a8.184,8.184,0,0,0,4.595.142A3.683,3.683,0,0,0,29.854,1.5,1.278,1.278,0,0,0,28.6.25a1.262,1.262,0,0,0-1.25,1.25c.066,1.244-1.558,1.378-2.5,1.266-1.574-.186-3.049-.792-4.663-.617a5.182,5.182,0,0,0-3.917,2.183,3.982,3.982,0,0,0-.137,4.19c.836,1.372,3,.117,2.158-1.261Z"/></svg>
      </div>
      <p class="nav-label">Controller {controllerEnabled ? "Enabled" : "Disabled"}</p>
    </div>
  </li>
  <li>
    <div class="nav-item" on:click={() => {navCollapsed = !navCollapsed}}>
      <div class="nav-icon">
        <svg fill="#000000" height="100%" viewBox="0 0 35 35" data-name="Layer 2" id="a1d0d4f7-4fce-4383-abe2-cf50798f66e5" xmlns="http://www.w3.org/2000/svg"><path d="M13.2,18.456H8.475a1.25,1.25,0,1,1,0-2.5H13.2a1.25,1.25,0,0,1,0,2.5Z"/><path d="M10.839,20.82a1.25,1.25,0,0,1-1.25-1.25V14.841a1.25,1.25,0,0,1,2.5,0V19.57A1.25,1.25,0,0,1,10.839,20.82Z"/><path d="M20.954,18.515a1.251,1.251,0,0,0,0-2.5,1.251,1.251,0,0,0,0,2.5Z"/><path d="M23.8,15.67a1.251,1.251,0,0,0,0-2.5,1.251,1.251,0,0,0,0,2.5Z"/><path d="M23.68,21.241a1.251,1.251,0,0,0,0-2.5,1.251,1.251,0,0,0,0,2.5Z"/><path d="M26.525,18.4a1.251,1.251,0,0,0,0-2.5,1.251,1.251,0,0,0,0,2.5Z"/><path d="M28.886,34.75a4.9,4.9,0,0,1-4.752-3.663l-1.4-4.1a20.448,20.448,0,0,1-10.436-.068l-1.456,4.257a4.725,4.725,0,0,1-1.717,2.549,4.905,4.905,0,0,1-7.9-3.836V19.2c0-.31.038-.868.054-1.08l-.052-.945A10.494,10.494,0,0,1,11.693,6.641a10.351,10.351,0,0,1,3.728.686,3.821,3.821,0,0,0,1.373.235h1.412a3.751,3.751,0,0,0,1.353-.227A10.32,10.32,0,0,1,23.5,6.643,10.674,10.674,0,0,1,33.781,17.42V29.892A4.881,4.881,0,0,1,28.886,34.75ZM23.5,24.141a1.253,1.253,0,0,1,1.183.846l1.841,5.384a2.438,2.438,0,0,0,2.359,1.879,2.379,2.379,0,0,0,2.395-2.358V17.42a8.163,8.163,0,0,0-7.822-8.277,7.78,7.78,0,0,0-3,.524h0a6.249,6.249,0,0,1-2.255.395H16.794a6.311,6.311,0,0,1-2.269-.4,7.858,7.858,0,0,0-2.832-.52,7.978,7.978,0,0,0-7.974,7.965l.054.955a1.9,1.9,0,0,1,0,.2c-.011.141-.05.66-.05.938V29.892a2.406,2.406,0,0,0,3.871,1.86,2.35,2.35,0,0,0,.855-1.29l1.869-5.475a1.251,1.251,0,0,1,1.59-.777c.062.02,6.155,2.075,11.123.025A1.247,1.247,0,0,1,23.5,24.141ZM20.01,8.5h0Z"/><path d="M18.294,7.261a1.23,1.23,0,0,1-.105-1.184,1.891,1.891,0,0,1,.874-1.04A4.97,4.97,0,0,1,22.7,4.874a8.184,8.184,0,0,0,4.595.142A3.683,3.683,0,0,0,29.854,1.5,1.278,1.278,0,0,0,28.6.25a1.262,1.262,0,0,0-1.25,1.25c.066,1.244-1.558,1.378-2.5,1.266-1.574-.186-3.049-.792-4.663-.617a5.182,5.182,0,0,0-3.917,2.183,3.982,3.982,0,0,0-.137,4.19c.836,1.372,3,.117,2.158-1.261Z"/></svg>
      </div>
      <p class="nav-label">{navCollapsed ? "Expand" : "Collapse"}</p>
    </div>
  </li>
</ul>

<style>

  .controller-svg {

  }

  ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;

  width: 100%;
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
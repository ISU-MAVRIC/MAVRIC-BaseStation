<!-- Component to be loaded into PageDisplay component when Overview is selected in PageNavBar -->
<script>
  //Project Imports
  import CommonDisplay from '../components/CommonDisplay.svelte';

  //Component Properties
  export let driveState;
  export let controllerBind;
</script>

<div class="container">
  <CommonDisplay driveState={driveState} controllerBind={controllerBind}/>
  <center>
    <img alt="Controler Binds" class="controller-img" src="images/controller.png" />
  </center>
  
</div>


<style>
  .container {
    width: 100%;
    height: 100%;
  }

  .controller-img {
    height: 250px;
  }
</style>
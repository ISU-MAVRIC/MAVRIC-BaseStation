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
  <a target="_blank" href="https://192.168.1.21">Base Station Rocket M5 WebUI</a>
  <br>
  <a target="_blank" href="https://192.168.1.22">Rover Rocket M5 WebUI</a>
  <br>
  <a target="_blank" href="http://192.168.1.10:8097/?action=stream">Arm Camera Feed</a>
  <br>
  <a target="_blank" href="http://192.168.1.10:8098/?action=stream">Realsense Camera Feed</a>
  <br>
  <a target="_blank" href="http://192.168.1.64">Mast Camera WebUI</a>
  <br>
  <a target="_blank" href="http://192.168.1.66">Left Hazard Camera WebUI</a>
  <br>
  <a target="_blank" href="http://192.168.1.65">Right Hazard Camera WebUI</a>
  <br>
  <a target="_blank" href="http://192.168.1.67">Swab Camera WebUI</a>
  <br>
  <a target="_blank" href="http://192.168.1.68">Luminometer Camera WebUI</a>
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
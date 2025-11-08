<!-- Component to be loaded into PageDisplay component when Camera is selected in PageNavBar -->
<script>
  import ROSLIB from "roslib/src/RosLib";

  //Project Imports
  import CommonDisplay from '../components/CommonDisplay.svelte';
  import { TOPICS } from "../utils/config";
  import connectionHandler from '../stores/connectionHandlerStore';

  //Component Properties
  export let driveState;
  export let controllerBind;

  //ros publisher for Mast topic
  const mastTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.CAMERAS.MAST,
    messageType : TOPICS.CAMERAS.MAST_MSG_TYPE
  });
  
  // function to take in an array of [x,y] and publish it
  const moveMast = (data, _) => {
    let message = new ROSLIB.Message(data);
    mastTopic.publish(message);
    console.log("Sent!");
  }
</script>

<div class="container">
  <div class="common-display">
    <CommonDisplay driveState={driveState} controllerBind={controllerBind}/>
  </div>
  <!--
    Each one of these buttons calls the moveMast function. To add a new button, just copy
    the examples provided below and change the x: and y: objects.
  -->
  <div class="camera-button" on:click={moveMast.bind(null,{x:-0.5, y:0.518222})}>
    <label>90 Left</label>
  </div>
  <div class="camera-button" on:click={moveMast.bind(null,{x:0.0, y:1})}>
    <label>Up</label>
  </div>
  <div class="camera-button" on:click={moveMast.bind(null,{x:0.5, y:0.518222})}>
    <label>90 Right</label>
  </div>
  <div class="spacer"/>
  <div class="camera-button" on:click={moveMast.bind(null,{x:-0.25, y:0.518222})}>
    <label>45 Left</label>
  </div>
  <div class="camera-button" on:click={moveMast.bind(null,{x:0.0, y:0.518222})}>
    <label>Center</label>
  </div>
  <div class="camera-button" on:click={moveMast.bind(null,{x:0.25, y:0.518222})}>
    <label>Right</label>
  </div>
  <div class="spacer"/>
  <div class="camera-button" on:click={moveMast.bind(null,{x:-1, y:0.518222})}>
    <label>Rear Left</label>
  </div>
  <div class="camera-button" on:click={moveMast.bind(null,{x:0.0, y:-0.25})}>
    <label>Down</label>
  </div>
  <div class="camera-button" on:click={moveMast.bind(null,{x:0.977, y:0.518222})}>
    <label>Rear Right</label>
  </div>
  <div class="camera-button" on:click={moveMast.bind(null,{x:0.0, y:-1})}>
    <label>All the Way Down</label>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    grid-template-rows: 25% 25% 25% 25%;
    grid-template-areas:
      'common-display common-display common-display common-display'
      'camera-button camera-button camera-button camera-button'
      'camera-button camera-button camera-button camera-button'
      'camera-button camera-button camera-button camera-button';
  }

  .camera-button {
    background-color: red;
    margin: 10px;
    border-radius: 10px;
    text-align: center;
    height: 90%;
  }

  .spacer {
    background-color: rgb(80, 80, 80);
    margin: 10px;
    border-radius: 10px;
    text-align: center;
    height: 90%;
  }

  .common-display {
  grid-area: common-display;
  }
</style>
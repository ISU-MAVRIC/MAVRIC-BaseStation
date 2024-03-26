<script>

  export let driveState;
  export let controllerBind;
  import { SCALES, TOPICS } from "../utils/config";
  import LoadingDisplay from "./LoadingDisplay.svelte";
  import CommonDisplay from "../components/CommonDisplay.svelte";
  import connectionHandler from "../stores/connectionHandlerStore";

  import ROSLIB from "roslib/src/RosLib";

  //Switch to null by default when retreiving scales from rover is working
  let driveScaleData = 0;
  //Switch to null by default when retreiving scales from rover is working
  let armScaleData = {
    SHOULDER_ROTATION: 0,
    SHOULDER_PITCH: 0,
    ELBOW_PITCH: 0,
    WRIST_ROTATION: 0,
    WRIST_PITCH: 0,
  }

  
  const scalesContainNull = () => {
    let armNull = !Object.values(armScaleData).some(el => el === null);
    return !(driveScaleData == null) && armNull;
  }

  
  let scalesInitialized = scalesContainNull();


  let publishScales = () => {
    //This function is where we will publish the scales to the rover using roslibjs
    // let message = new ROSLIB.Message({ data: driveScaleData });
    // driveScaleTopic.publish(message);
    //Figure out the armData message format...
    console.log({DRIVE: driveScaleData, ...armScaleData});
  }


  const driveScaleTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.SCALES.DRIVE,
    messageType : TOPICS.SCALES.DRIVE_MSG_TYPE
  });
  
  driveScaleTopic.subscribe(message => {
    driveScaleData = message.data;
    scalesInitialized = scalesContainNull();
  });

  const armScaleTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.SCALES.ARM,
    messageType : TOPICS.SCALES.ARM_MSG_TYPE
  });
  
  armScaleTopic.subscribe(message => {
    //UPDATE LOCAL SCALES, I dont know the armData message format right now
    scalesInitialized = scalesContainNull();
  });


</script>

{#if !scalesInitialized}
 <LoadingDisplay text="Attempting to fetch rover scales..."/>
{:else}
<!-- Component to be loaded into PageDisplay component when Scale Tuner is selected in PageNavBar -->
<div class="scale-tuner-container">
  <div class="scales-container">
    <div class="drive-tuner-container scales-column">
      <label for="lf-scale">Drive Scale: {driveScaleData}</label>
      <input bind:value={driveScaleData} id="lf-scale" type="range" min={SCALES.DRIVE.MIN} max={SCALES.DRIVE.MAX} step={SCALES.DRIVE.STEP} />

    </div>
    <div class="arm-tuner-container scales-column">
      <label for="shoulder-rotation-scale">Shoulder Rotation Scale: {armScaleData.SHOULDER_ROTATION}</label>
      <input bind:value={armScaleData.SHOULDER_ROTATION} id="shoulder-rotation-scale" type="range" min={SCALES.ARM.SHOULDER_ROTATION.MIN} max={SCALES.ARM.SHOULDER_ROTATION.MAX} step={SCALES.ARM.SHOULDER_ROTATION.STEP} />
      <label for="shoulder-pitch-scale">Shoulder Pitch Scale: {armScaleData.SHOULDER_PITCH}</label>
      <input bind:value={armScaleData.SHOULDER_PITCH} id="shoulder-pitch-scale" type="range" min={SCALES.ARM.SHOULDER_PITCH.MIN} max={SCALES.ARM.SHOULDER_PITCH.MAX} step={SCALES.ARM.SHOULDER_PITCH.STEP} />
      <label for="elbow-pitch-scale">Elbow Pitch Scale: {armScaleData.ELBOW_PITCH}</label>
      <input bind:value={armScaleData.ELBOW_PITCH} id="elbow-pitch-scale" type="range" min={SCALES.ARM.ELBOW_PITCH.MIN} max={SCALES.ARM.ELBOW_PITCH.MAX} step={SCALES.ARM.ELBOW_PITCH.STEP} />
      <label for="wrist-rotation-scale">Wrist Rotation Scale: {armScaleData.WRIST_ROTATION}</label>
      <input bind:value={armScaleData.WRIST_ROTATION} id="wrist-rotation-scale" type="range" min={SCALES.ARM.WRIST_ROTATION.MIN} max={SCALES.ARM.WRIST_ROTATION.MAX} step={SCALES.ARM.WRIST_ROTATION.STEP} />
      <label for="wrist-pitch-scale">Wrist Pitch Scale: {armScaleData.WRIST_PITCH}</label>
      <input bind:value={armScaleData.WRIST_PITCH} id="wrist-rotation-scale" type="range" min={SCALES.ARM.WRIST_PITCH.MIN} max={SCALES.ARM.WRIST_PITCH.MAX} step={SCALES.ARM.WRIST_PITCH.STEP} />
    </div>
  </div>
  <div class="send-container" on:click={publishScales}>
    <label>Publish Scales</label>
  </div>
</div>
{/if}


<style>
  .scales-column {
    width: 50%;
    padding: 10px 10px;
    margin: 10px 10px;
    border-radius: 10px;
  }

  .scales-container {
    width: 100%;
    height: 90%;
    display: flex;
  }

  .scale-tuner-container {
    display: flex;
    flex-wrap: wrap;
    background-color: grey;
    width: 100%;
    height: 100%;
  }

  .send-container {
    background-color: red;
    flex-grow: 1;
    margin: 10px;
    border-radius: 10px;
    text-align: center;
  }

  .send-container:hover {
    background-color: rgb(253, 117, 117);
  }

  .drive-tuner-container {
    background-color: lightgray;
  }

  .arm-tuner-container {
    background-color: lightgray;
  }

  label {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  /* The slider itself */
  input {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #8e8e8e; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s;
}

/* Mouse-over effects */
input:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
input::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: red; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

input::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: red; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
</style>
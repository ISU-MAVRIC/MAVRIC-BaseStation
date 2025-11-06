<script>

  export let driveState;
  export let controllerBind;
  import { SCALES, TOPICS } from "../utils/config";
  import LoadingDisplay from "./LoadingDisplay.svelte";
  import CommonDisplay from "../components/CommonDisplay.svelte";
  import connectionHandler from "../stores/connectionHandlerStore";

  import ROSLIB from "roslib/src/RosLib";
  let ros = $connectionHandler.getROSInstance();
  //Switch to null by default when retreiving scales from rover is working
  let driveScaleData = null;
  //Switch to null by default when retreiving scales from rover is working
  let armScaleData = {
    shoulder_rot: null,
    shoulder_pitch: null,
    elbow_pitch: null,
    wrist_rot: null,
    wrist_pitch: null,
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
    let driveMessage = {
      data: driveScaleData
    }
    let armMessage = {
      shoulder_rot: armScaleData.shoulder_rot,
      shoulder_pitch: armScaleData.shoulder_pitch,
      elbow_pitch: armScaleData.elbow_pitch,
      wrist_rot: armScaleData.wrist_rot,
      wrist_pitch: armScaleData.wrist_pitch
    }

    driveScaleTopic.publish(new ROSLIB.Message(driveMessage));
    armScaleTopic.publish(new ROSLIB.Message(armMessage));

   

    console.log({drive: driveScaleData, ...armScaleData});
  }


  const driveScaleTopic = new ROSLIB.Topic({
  ros,
  name: "/drive_scale",
  messageType: "std_msgs/msg/Float64"
});

  const armScaleTopic = new ROSLIB.Topic({
  ros,
  name: "/arm_scales",
  messageType: "mavric_msg/msg/ArmScales"
});

  const initialScalesTopic = new ROSLIB.Topic({
  ros,
  name: "/scale_feedback",
  messageType: "mavric_msg/msg/ScaleFeedback"
});
initialScalesTopic.subscribe(message => {
  driveScaleData = Number(message.drive.toFixed(2));
  armScaleData = {
    shoulder_rot: Number(message.shoulder_rot.toFixed(2)),
    shoulder_pitch: Number(message.shoulder_pitch.toFixed(2)),
    elbow_pitch: Number(message.elbow_pitch.toFixed(2)),
    wrist_rot: Number(message.wrist_rot.toFixed(2)),
    wrist_pitch: Number(message.wrist_pitch.toFixed(2))
  };
  scalesInitialized = scalesContainNull();
  console.log("Scale feedback received:", message);
});

</script>

{#if !scalesInitialized}
 <LoadingDisplay text="Attempting to fetch rover scales..."/>
{:else}
<!-- Component to be loaded into PageDisplay component when Scale Tuner is selected in PageNavBar -->
<div class="scale-tuner-container">
  <div class="scales-container">
    <!-- drive scale tuner -->
    <div class="drive-tuner-container scales-column">
      <label for="lf-scale">drive Scale: {driveScaleData}</label>
      <input
      bind:value={driveScaleData}
      id="lf-scale"
      type="range"
      min={SCALES.DRIVE.MIN}
      max={SCALES.DRIVE.MAX}
      step={SCALES.DRIVE.STEP}
    />

    </div>
     <!-- arm scale tuner -->
    <div class="arm-tuner-container scales-column">
      <label for="shoulder-rotation-scale">Shoulder Rotation Scale: {armScaleData.shoulder_rot}</label>
      <input bind:value={armScaleData.shoulder_rot} id="shoulder-rotation-scale" type="range" min={SCALES.ARM.shoulder_rot.MIN} max={SCALES.ARM.shoulder_rot.MAX} step={SCALES.ARM.shoulder_rot.STEP} />
      <label for="shoulder-pitch-scale">Shoulder Pitch Scale: {armScaleData.shoulder_pitch}</label>
      <input bind:value={armScaleData.shoulder_pitch} id="shoulder-pitch-scale" type="range" min={SCALES.ARM.shoulder_pitch.MIN} max={SCALES.ARM.shoulder_pitch.MAX} step={SCALES.ARM.shoulder_pitch.STEP} />
      <label for="elbow-pitch-scale">Elbow Pitch Scale: {armScaleData.elbow_pitch}</label>
      <input bind:value={armScaleData.elbow_pitch} id="elbow-pitch-scale" type="range" min={SCALES.ARM.elbow_pitch.MIN} max={SCALES.ARM.elbow_pitch.MAX} step={SCALES.ARM.elbow_pitch.STEP} />
      <label for="wrist-rotation-scale">Wrist Rotation Scale: {armScaleData.wrist_rot}</label>
      <input bind:value={armScaleData.wrist_rot} id="wrist-rotation-scale" type="range" min={SCALES.ARM.wrist_rot.MIN} max={SCALES.ARM.wrist_rot.MAX} step={SCALES.ARM.wrist_rot.STEP} />
      <label for="wrist-pitch-scale">Wrist Pitch Scale: {armScaleData.wrist_pitch}</label>
      <input bind:value={armScaleData.wrist_pitch} id="wrist-rotation-scale" type="range" min={SCALES.ARM.wrist_pitch.MIN} max={SCALES.ARM.wrist_pitch.MAX} step={SCALES.ARM.wrist_pitch.STEP} />
    </div>
  </div>
  <!-- Button that calls publishScales when clicked -->
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
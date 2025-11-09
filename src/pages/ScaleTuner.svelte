<script>
  export let driveState;
  export let controllerBind;
  import { SCALES, TOPICS } from "../utils/config";
  import LoadingDisplay from "./LoadingDisplay.svelte";
  import CommonDisplay from "../components/CommonDisplay.svelte";
  import connectionHandler from "../stores/connectionHandlerStore";

  import ROSLIB from "roslib/src/RosLib";
  let ros = $connectionHandler.getROSInstance();

  let scaleCommandMessage = {
    drive: null,
    shoulder_rot:null,
    shoulder_pitch: null,
    elbow_pitch: null,
    wrist_rot: null,
    wrist_pitch: null,
  };

  const scalesContainNull = () => {
    return !Object.values(scaleCommandMessage).some((el) => el === null);
  };

  let scalesInitialized = scalesContainNull();

  let publishScales = () => {
    scaleCommandTopic
    .publish(new ROSLIB.Message(scaleCommandMessage));
  };

  const scaleCommandTopic
   = new ROSLIB.Topic({
    ros,
    name: "/scale_command",
    messageType: "mavric_msg/msg/ScaleCommand",
  });

  const scaleFeedbackTopic
   = new ROSLIB.Topic({
    ros,
    name: "/scale_feedback",
    messageType: "mavric_msg/msg/ScaleFeedback",
  });
  scaleFeedbackTopic
  .subscribe((message) => {
    scaleCommandMessage = {
      drive: Number(message.drive.toFixed(2)),
      shoulder_rot: Number(message.shoulder_rot.toFixed(2)),
      shoulder_pitch: Number(message.shoulder_pitch.toFixed(2)),
      elbow_pitch: Number(message.elbow_pitch.toFixed(2)),
      wrist_rot: Number(message.wrist_rot.toFixed(2)),
      wrist_pitch: Number(message.wrist_pitch.toFixed(2)),
    };
    scalesInitialized = scalesContainNull();
    console.log("Scale feedback received:", message);
  });
</script>

{#if !scalesInitialized}
  <LoadingDisplay text="Attempting to fetch rover scales..." />
{:else}
  <!-- Component to be loaded into PageDisplay component when Scale Tuner is selected in PageNavBar -->
  <div class="scale-tuner-container">
    <div class="scales-container">
      <!-- drive scale tuner -->
      <div class="drive-tuner-container scales-column">
        <label for="lf-scale">drive Scale: {scaleCommandMessage.drive}</label>
        <input
          bind:value={scaleCommandMessage.drive}
          id="lf-scale"
          type="range"
          min={SCALES.DRIVE.MIN}
          max={SCALES.DRIVE.MAX}
          step={SCALES.DRIVE.STEP}
        />
      </div>

      <div class="arm-tuner-container scales-column">
        <label for="shoulder-rotation-scale"
          >Shoulder Rotation Scale: {scaleCommandMessage.shoulder_rot}</label
        >
        <input
          bind:value={scaleCommandMessage.shoulder_rot}
          id="shoulder-rotation-scale"
          type="range"
          min={SCALES.ARM.shoulder_rot.MIN}
          max={SCALES.ARM.shoulder_rot.MAX}
          step={SCALES.ARM.shoulder_rot.STEP}
        />
        <label for="shoulder-pitch-scale"
          >Shoulder Pitch Scale: {scaleCommandMessage.shoulder_pitch}</label
        >
        <input
          bind:value={scaleCommandMessage.shoulder_pitch}
          id="shoulder-pitch-scale"
          type="range"
          min={SCALES.ARM.shoulder_pitch.MIN}
          max={SCALES.ARM.shoulder_pitch.MAX}
          step={SCALES.ARM.shoulder_pitch.STEP}
        />
        <label for="elbow-pitch-scale"
          >Elbow Pitch Scale: {scaleCommandMessage.elbow_pitch}</label
        >
        <input
          bind:value={scaleCommandMessage.elbow_pitch}
          id="elbow-pitch-scale"
          type="range"
          min={SCALES.ARM.elbow_pitch.MIN}
          max={SCALES.ARM.elbow_pitch.MAX}
          step={SCALES.ARM.elbow_pitch.STEP}
        />
        <label for="wrist-rotation-scale"
          >Wrist Rotation Scale: {scaleCommandMessage.wrist_rot}</label
        >
        <input
          bind:value={scaleCommandMessage.wrist_rot}
          id="wrist-rotation-scale"
          type="range"
          min={SCALES.ARM.wrist_rot.MIN}
          max={SCALES.ARM.wrist_rot.MAX}
          step={SCALES.ARM.wrist_rot.STEP}
        />
        <label for="wrist-pitch-scale"
          >Wrist Pitch Scale: {scaleCommandMessage.wrist_pitch}</label
        >
        <input
          bind:value={scaleCommandMessage.wrist_pitch}
          id="wrist-rotation-scale"
          type="range"
          min={SCALES.ARM.wrist_pitch.MIN}
          max={SCALES.ARM.wrist_pitch.MAX}
          step={SCALES.ARM.wrist_pitch.STEP}
        />
      </div>
    </div>
    <!-- Button that calls publishScales when clicked -->
    <button type="button" class="send-container" on:click={publishScales} aria-label="Publish Scales">
      Publish Scales
    </button>
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
    -webkit-appearance: none; /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 25px; /* Specified height */
    background: #8e8e8e; /* Grey background */
    outline: none; /* Remove outline */
    opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
    transition: opacity 0.2s;
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

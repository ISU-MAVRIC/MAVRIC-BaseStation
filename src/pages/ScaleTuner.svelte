<script>
  import { SCALES } from "../utils/config";
  import LoadingDisplay from "./LoadingDisplay.svelte";

  //Switch to null by default when retreiving scales from rover is working
  let driveScaleData = {
    LF: 0,
    LM: 0,
    LB: 0,
    RF: 0,
    RM: 0,
    RB: 0,
  };

  let armScaleData = {
    SHOULDER_ROTATION: 0,
    SHOULDER_PITCH: 0,
    ELBOW_PITCH: 0,
    WRIST_ROTATION: 0,
    WRIST_PITCH: 0,
  }

  
  const scalesContainNull = () => {
    let driveNull = !Object.values(driveScaleData).some(el => el === null);
    let armNull = !Object.values(armScaleData).some(el => el === null);
    return driveNull && armNull;
  }

  
  let scalesInitialized = scalesContainNull();
</script>

{#if !scalesInitialized}
 <LoadingDisplay text="Attempting to fetch rover scales..."/>
{:else}
<!-- Component to be loaded into PageDisplay component when Scale Tuner is selected in PageNavBar -->
<div class="scale-tuner-container">
  <div class="scales-container">
    <div class="drive-tuner-container scales-column">
      <label for="lf-scale">LF Scale: {driveScaleData.LF}</label>
      <input bind:value={driveScaleData.LF} id="lf-scale" type="range" min={SCALES.DRIVE.LF.MIN} max={SCALES.DRIVE.LF.MAX} step={SCALES.DRIVE.LF.STEP} />
      <label for="lm-scale">LM Scale: {driveScaleData.LM}</label>
      <input bind:value={driveScaleData.LM} id="lm-scale" type="range" min={SCALES.DRIVE.LM.MIN} max={SCALES.DRIVE.LM.MAX} step={SCALES.DRIVE.LM.STEP} />
      <label for="lb-scale">LB Scale: {driveScaleData.LB}</label>
      <input bind:value={driveScaleData.LB} id="lb-scale" type="range" min={SCALES.DRIVE.LB.MIN} max={SCALES.DRIVE.LB.MAX} step={SCALES.DRIVE.LB.STEP} />
      <label for="rf-scale">RF Scale: {driveScaleData.RF}</label>
      <input bind:value={driveScaleData.RF} id="rf-scale" type="range" min={SCALES.DRIVE.RF.MIN} max={SCALES.DRIVE.RF.MAX} step={SCALES.DRIVE.RF.STEP} />
      <label for="rm-scale">RM Scale: {driveScaleData.RM}</label>
      <input bind:value={driveScaleData.RM} id="rm-scale" type="range" min={SCALES.DRIVE.RM.MIN} max={SCALES.DRIVE.RM.MAX} step={SCALES.DRIVE.RM.STEP} />
      <label for="rb-scale">RB Scale: {driveScaleData.RB}</label>
      <input bind:value={driveScaleData.RB} id="rb-scale" type="range" min={SCALES.DRIVE.RB.MIN} max={SCALES.DRIVE.RB.MAX} step={SCALES.DRIVE.RB.STEP} />
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
  <div class="send-container">
    <p>Test</p>
  </div>
</div>
{/if}


<style>
  p {
    margin: 0;
    padding: 0;
  }
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
    background-color: orange;
    flex-grow: 1;
    margin: 10px;
    border-radius: 10px;
    text-align: center;
  }

  .send-container:hover {
    background-color: cyan;
  }

  .drive-tuner-container {
    background-color: cornflowerblue;
  }

  .arm-tuner-container {
    background-color: crimson;
  }

  /* The slider itself */
  input {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
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
  background: #04AA6D; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

input::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #04AA6D; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
</style>
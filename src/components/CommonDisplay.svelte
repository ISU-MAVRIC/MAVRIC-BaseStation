<!--
  This component is used across most (if not all) of our pages. It displays basic essential rover data like longitude, latitude, heading, battery voltages, etc.
-->
<script>
  //Library Imports
  import ROSLIB from "roslib/src/RosLib";

  //Project Imports
  import connectionHandler from "../stores/connectionHandlerStore";
  import {TOPICS} from '../utils/config.js';

  //Component Property Declarations
  export let driveState;

  //Variables used to store and display values
  let gpsLatitude = 0;
  let gpsLongtude = 0;
  let imuHeading = 0;
  let driveBatteryVoltage = 0;
  let systemBatteryVoltage = 0;


  //ROS Topics and subscribers
  /// GPS
  // const gpsTopic = new ROSLIB.Topic({
  //   ros : $connectionHandler.getROSInstance(),
  //   name : TOPICS.SENSORS.GPS,
  //   messageType : TOPICS.SENSORS.GPS_MSG_TYPE
  // });

  // gpsTopic.subscribe(message => {
  //   //TODO: update gpsLatitude and gpsLongitude parameters
  //   console.log(message);
  // });


  // /// IMU
  // const imuTopic = new ROSLIB.Topic({
  //   ros : $connectionHandler.getROSInstance(),
  //   name : TOPICS.SENSORS.IMU,
  //   messageType : TOPICS.SENSORS.IMU_MSG_TYPE
  // });

  // imuTopic.subscribe(message => {
  //   //TODO: update imuHeading
  //   console.log(message);
  // });

  /// Battery Voltage
  //TODO: Add battery voltage display once implemented on rover

</script>

<!-- Container flex div -->
<div class="common-display">
  <!-- Telemetry Display Div -->
  <div class="flex-block telemetry-display">
    <p>Latitude: {gpsLatitude.toFixed(7)}</p>
    <p>Longitude: {gpsLongtude.toFixed(7)}</p>
    <p>Drive State: {driveState}</p>
  </div>
  <!-- Battery Voltage Display Div -->
  <div class="flex-block telemetry-display">
    <p>Drive Battery Voltage: {driveBatteryVoltage}</p>
    <p>Systems Battery Voltage: {systemBatteryVoltage}</p>
  </div>
  <!-- Extra divs for testing (until we add more data here) -->
  <div class="flex-block telemetry-display">
    <p>Latitude: {gpsLatitude.toFixed(7)}</p>
    <p>Longitude: {gpsLongtude.toFixed(7)}</p>
  </div>
  <!-- Extra divs for testing (until we add more data here) -->
  <div class="flex-block telemetry-display">
    <p>Latitude: {gpsLatitude.toFixed(7)}</p>
    <p>Longitude: {gpsLongtude.toFixed(7)}</p>
  </div>
</div>


<!-- Custom CSS for component elements -->
<style>

  .common-display {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: gray;
    width: 100%;
  }

  .flex-block {
    padding: 10px 10px;
    margin: 10px;
    border-radius: 10px;
    display: block;
    flex-grow: 1;
    background-color: lightgray;
  }

  p {
    margin: 0;
    padding: 0;
  }
</style>
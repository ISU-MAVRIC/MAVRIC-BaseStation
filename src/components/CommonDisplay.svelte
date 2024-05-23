<!--
  This component is used across most (if not all) of our pages. It displays basic essential rover data like longitude, latitude, heading, battery voltages, etc.
-->
<script>
  //Library Imports
  import ROSLIB from "roslib/src/RosLib";

  //Project Imports
  import connectionHandler from "../stores/connectionHandlerStore";
  import {TOPICS} from '../utils/config.js';
  import {uptime} from '../utils/ubiquitiData.js';

  //Component Property Declarations
  export let driveState;
  export let controllerBind;

  //Variables used to store and display values
  let gpsLatitude = 0;
  let gpsLongitude = 0;
  let imuHeading = 0;
  let driveBatteryVoltage = 0;
  let systemBatteryVoltage = 0;


  //ROS Topics and subscribers
  /// GPS
  const gpsTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.SENSORS.GPS,
    messageType : TOPICS.SENSORS.GPS_MSG_TYPE
  });

  gpsTopic.subscribe(message => {
    //TODO: update gpsLatitude and gpsLongitude parameters
    gpsLatitude = message.latitude
    gpsLongitude = message.longitude
  });


  /// IMU
  const imuTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.SENSORS.IMU,
    messageType : TOPICS.SENSORS.IMU_MSG_TYPE
  });

  imuTopic.subscribe(message => {
    //TODO: update imuHeading
    imuHeading = message.z;
  });

  /// Battery Voltage
  const battVoltTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.SENSORS.BATTERY_VOLTAGE,
    messageType : TOPICS.SENSORS.BATTERY_VOLTAGE_MSG_TYPE
  });

  battVoltTopic.subscribe(message => {
    systemBatteryVoltage = message.batt1;
    driveBatteryVoltage = message.batt2;
  })


</script>

<!-- Container flex div -->
<div class="common-display">
  <!-- Telemetry Display Div -->
  <div class="flex-block telemetry-display">
    <p>Controller Mode: {controllerBind}</p>
    {#if controllerBind == "DRIVE"}
    <p>Drive State: {driveState}</p>
    {/if}
  </div>
  <!-- Battery Voltage Display Div -->
  <div class="flex-block telemetry-display">
    <p>Systems Voltage: {systemBatteryVoltage.toFixed(2)} V ({(systemBatteryVoltage/6).toFixed(2)})</p>
    <p>Drive Voltage: {driveBatteryVoltage.toFixed(2)} V ({(driveBatteryVoltage/4).toFixed(2)})</p>
  </div>
  <!-- Imu Heading Display Div -->
  <div class="flex-block telemetry-display">
    <p>Heading: {imuHeading.toFixed(1)}</p>
  </div>
  <!-- Extra divs for testing (until we add more data here) -->
  <div class="flex-block telemetry-display">
    <p>Latitude: {gpsLatitude.toFixed(7)}</p>
    <p>Longitude: {gpsLongitude.toFixed(7)}</p>
  </div>
  <div class="flex-block telemetry-display">
    <p>Radio Quality: </p>
    <p>Radio Capacity: </p>
    <p>Radio RSSI: </p>
  </div>
</div>


<!-- Custom CSS for component elements -->
<style>

  .common-display {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: gray;
    height: 10%;
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
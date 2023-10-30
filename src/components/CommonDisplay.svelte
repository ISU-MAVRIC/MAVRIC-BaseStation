<script>
  import ROSLIB from "roslib/src/RosLib";
  import connectionHandler from "../stores/connectionHandlerStore";
  import {TOPICS} from '../../scripts/utils/config.js';
  export let driveState;

  let gpsLatitude = 0;
  let gpsLongtude = 0;
  let imuHeading = 0;
  let driveBatteryVoltage = 0;
  let systemBatteryVoltage = 0;


  //ROS TOPIC LISTENERS

  const gpsTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.SENSORS.GPS,
    messageType : TOPICS.SENSORS.GPS_MSG_TYPE
  });

  gpsTopic.subscribe(message => {
    //TODO: update gpsLatitude and gpsLongitude parameters
    console.log(message);
  });

  const imuTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.SENSORS.IMU,
    messageType : TOPICS.SENSORS.IMU_MSG_TYPE
  });

  imuTopic.subscribe(message => {
    //TODO: update imuHeading
    console.log(message);
  });

  //TODO: Add battery voltage display once implemented on rover

</script>

<div class="common-display">
  <div class="flex-block telemetry-display">
    <p>Latitude: {gpsLatitude.toFixed(7)}</p>
    <p>Longitude: {gpsLongtude.toFixed(7)}</p>
    <p>Drive State: {driveState}</p>
  </div>
  <div class="flex-block telemetry-display">
    <p>Drive Battery Voltage: {driveBatteryVoltage}</p>
    <p>Systems Battery Voltage: {systemBatteryVoltage}</p>
  </div>
  <div class="flex-block telemetry-display">
    <p>Latitude: {gpsLatitude.toFixed(7)}</p>
    <p>Longitude: {gpsLongtude.toFixed(7)}</p>
  </div>
  <div class="flex-block telemetry-display">
    <p>Latitude: {gpsLatitude.toFixed(7)}</p>
    <p>Longitude: {gpsLongtude.toFixed(7)}</p>
  </div>
</div>

<style>

  .common-display {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: blueviolet;
    width: 100%;
  }

  .flex-block {
    padding: 10px 10px;
    margin: 10px;
    border-radius: 10px;
    display: block;
    background-color: yellow;
  }

  p{
    margin: 0;
    padding: 0;
  }
</style>
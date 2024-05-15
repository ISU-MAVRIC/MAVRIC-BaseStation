<!-- Component to be loaded into PageDisplay component when Autonomous Debug is selected in PageNavBar -->
<script>
  import ROSLIB from "roslib/src/RosLib";


  
  //Project Imports
  import { TOPICS } from "../utils/config";
  import connectionHandler from "../stores/connectionHandlerStore";
  import CommonDisplay from '../components/CommonDisplay.svelte';
  import Map from '../components/map/Map.svelte';
  import WaypointEditor from '../components/waypoints/WaypointEditor.svelte';


  
  //Component Properties
  export let driveState;
  export let controllerBind;

  //Variables for auto page
  let autoEnabled = false;
  let autoTargetHeading = null;
  let autoCurrentHeading = null;
  let autoOffset = null;
  let autoState = null;
  let teleopEnabled = false;
  // let waypoints = null;
  //For testing:
  let waypoints = [[42.0267, -93.6445],[42.0247, -93.6466],[42.0266, -93.6476]]
  

  //Function to force update to waypoints and send new waypoint list to rover
  let setWaypoints = (waypointList) => {
    waypoints = waypointList;
    sendWaypoints();
  }
  



  //Ros topic for autonomous state debug topic
  const autoStateTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.AUTONOMOUS.STATE,
    messageType : TOPICS.AUTONOMOUS.STATE_MSG_TYPE
  });


  //Listener to update autoState on topic update
  autoStateTopic.subscribe(message => {
    autoState = message.data;
  });

  //Ros topic for autonomous waypoint list
  const autoWaypointTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.AUTONOMOUS.WAYPOINTS,
    messageType : TOPICS.AUTONOMOUS.WAYPOINTS_MSG_TYPE
  });
  
  //Listener to parse and set waypoint list
  autoWaypointTopic.subscribe(message => {
    waypoints = JSON.parse(message.data);
  });

  //Function to send the current waypoint list to rover
  let sendWaypoints = () => {
    let waypointString = JSON.stringify(waypoints);
    let message = new ROSLIB.Message({ data: waypointString });
    autoWaypointTopic.publish(message);
  }
  
  //Ros topic for autonomous enabled topic
  const autoEnableTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.AUTONOMOUS.ENABLE,
    messageType : TOPICS.AUTONOMOUS.ENABLE_MSG_TYPE
  });
  
  //Listener to update autoEnabled when topic message received
  autoEnableTopic.subscribe(message => {
    autoEnabled = message.data;
  });

  //function to toggle autonomous enabled
  let autoToggle = () => {
    autoEnabled = !autoEnabled;
    let message = new ROSLIB.Message({ data: autoEnabled });
    autoEnableTopic.publish(message);
  }

  //Ros topic for teleop enabled topic
  const teleopEnableTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.AUTONOMOUS.TELEOP,
    messageType : TOPICS.AUTONOMOUS.TELEOP_MSG_TYPE
  });

  //Listener to update teleopEnabled when topic message is recieved
  teleopEnableTopic.subscribe(message => {
    teleopEnabled = message.data;
  });

  //function to toggle teleop enabled
  let teleopToggle = () => {
    teleopEnabled = !teleopEnabled;
    let message = new ROSLIB.Message({ data: teleopEnabled});
    teleopEnableTopic.publish(message)
    
  }
  
</script>

<div class="container">
  <!-- Load common display (Lat, Long, Heading, Battery charge, etc) -->
  <div class="common-display">
    <CommonDisplay driveState={driveState} controllerBind={controllerBind}/>
  </div>
  <!-- autonomous enabled section -->
  <div class={autoEnabled ? "auto-toggle bg-green" : "auto-toggle bg-red"} on:click={autoToggle}>{autoEnabled ? "AUTONOMOUS ENABLED" : "AUTONOMOUS DISABLED"}</div>
  <!-- autonomous state section -->
  <div class="auto-state">{autoState}</div>
  <!-- Teleoperation state section -->
  <div class={teleopEnabled ? "teleop-toggle bg-green" : "teleop-toggle bg-red"} on:click={teleopToggle}>{teleopEnabled ? "TELEOP ENABLED" : "TELEOP DISABLED"}</div>
  <!-- autonomous debug section -->
  <div class="auto-map">
    <Map markerLocations={waypoints} roverHeading=0 roverCoords={[42.0267, -93.6464]}/>
  </div>
  <!-- Autonomous waypoint section -->
  <div class="auto-waypoint">
    <WaypointEditor waypointsList={waypoints} setWaypoints={setWaypoints}></WaypointEditor>
  </div>
  
</div>


<style>
  .container {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: 20% 20% 20% 40%;
    grid-template-rows: 10% 30% 30% 30%;
    /* Container layout */
    grid-template-areas: 
      'common-display common-display common-display common-display'
      'auto-toggle auto-state teleop-toggle auto-waypoint'
      'auto-map auto-map auto-map auto-waypoint'
      'auto-map auto-map auto-map auto-waypoint';
}

.common-display {
  grid-area: common-display;

}

.auto-toggle {
  grid-area: auto-toggle;
  background: red;
  border-radius: 20px;
  margin: 10px 10px;
  user-select: none;
  text-align: center;
}

.teleop-toggle {
  grid-area: teleop-toggle;
  background: red;
  border-radius: 20px;
  margin: 10px 10px;
  user-select: none;
  text-align: center;
}

.auto-map {
  grid-area: auto-map;
}
.auto-waypoint {
  grid-area: auto-waypoint;
}

.auto-state {
  background-color: aliceblue;
  border-radius: 20px;
  margin: 10px 10px;
  text-align: center;
}


.bg-green {
  background-color: lime;
}

.bg-red {
  background-color: red;
}




</style>
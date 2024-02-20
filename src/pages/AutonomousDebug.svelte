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


  let autoEnabled = false;
  let autoTargetHeading = null;
  let autoCurrentHeading = null;
  let autoOffset = null;
  let autoState = null;
  let waypoints = [[10,10]];
  

  let setWaypoints = (waypointList) => {
    waypoints = waypointList;
    sendWaypoints();
  }
  




  const autoStateTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.AUTONOMOUS.STATE,
    messageType : TOPICS.AUTONOMOUS.STATE_MSG_TYPE
  });
  
  autoStateTopic.subscribe(message => {
    autoState = message.data;
  });

  const autoWaypointTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.AUTONOMOUS.WAYPOINTS,
    messageType : TOPICS.AUTONOMOUS.WAYPOINTS_MSG_TYPE
  });
  
  autoWaypointTopic.subscribe(message => {
    waypoints = JSON.parse(message.data);
  });

  let sendWaypoints = () => {
    let message = new ROSLIB.Message({ data: waypoints.toString() });
    autoWaypointTopic.publish(message);
  }
  
  const autoEnableTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : TOPICS.AUTONOMOUS.ENABLE,
    messageType : TOPICS.AUTONOMOUS.ENABLE_MSG_TYPE
  });
  
  autoEnableTopic.subscribe(message => {
    autoEnabled = message.data;
  });
  
  let autoToggle = () => {
    autoEnabled = !autoEnabled;
    let message = new ROSLIB.Message({ data: !autoEnabled });
    autoEnableTopic.publish(message);
  }
  
</script>

<div class="container">
  <div class="common-display">
    <CommonDisplay driveState={driveState} controllerBind={controllerBind}/>
  </div>
  <div class={autoEnabled ? "auto-toggle bg-green" : "auto-toggle bg-red"} on:click={autoToggle}>{autoEnabled ? "AUTONOMOUS ENABLED" : "AUTONOMOUS DISABLED"}</div>
  <div class="auto-state">{autoState}</div>
  <div class="auto-debug"></div>
  <div class="auto-map">
    <!-- WIP: <Map /> -->
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
    grid-template-areas: 
      'common-display common-display common-display common-display'
      'auto-toggle auto-state auto-none map'
      'auto-debug auto-debug auto-debug map'
      'auto-debug auto-debug auto-debug map';
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

.auto-debug {
  grid-area: auto-debug;
}
.auto-map {
  grid-area: map;
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
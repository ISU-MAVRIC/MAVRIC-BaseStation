
<script>
  import ROSLIB from 'roslib/src/RosLib';

  import connectionHandler from '../stores/connectionHandlerStore';
  import { calculateDriveValues, DRIVE_STATES } from '../utils/driveMath';
  import Gamepad from './gamepad/Gamepad.svelte';
  import { DEFAULTS, TOPICS, CONTROLLER_BINDS } from '../utils/config.js'
  import mapRange from '../utils/mapRange';

  // Svelte Parameters
  export let driveState;
  
  //Variables

  //ROS
  let ros = $connectionHandler.getROSInstance();
  let sensdrive = 1; // 0 to 1 
  let senssteer = 1; // 0 to 1
  
  //CONTROLLER
  let leftAxis = { x: 0, y: 0 };
  let rightAxis = { x: 0, y: 0 };

  let controllerBind = DEFAULTS.CONTROLLER.BIND;

  // ROS TOPICS SETUP


  const drivetrainTopic = new ROSLIB.Topic({
    ros,
    name : '/Drive/Drive_Command',
    messageType : 'mavric/Drivetrain'
  });


  const publishDrivetrain = data => {
    let message = new ROSLIB.Message(data);
    drivetrainTopic.publish(message);
  }

  const steertrainTopic = new ROSLIB.Topic({
    ros,
    name : '/Drive/Steer_Command',
    messageType : 'mavric/Steertrain'
  });


  const publishSteertrain = data => {
    let message = new ROSLIB.Message(data);
    steertrainTopic.publish(message);
  }

  const armtrainTopics = {
    SHOULDER_ROTATION: new ROSLIB.Topic({ ros, name : TOPICS.ARM.SHOULDER_ROTATION, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    SHOULDER_PITCH: new ROSLIB.Topic({ ros, name : TOPICS.ARM.SHOULDER_PITCH, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    ELBOW_PITCH: new ROSLIB.Topic({ ros, name : TOPICS.ARM.ELBOW_PITCH, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    WRIST_PITCH: new ROSLIB.Topic({ ros, name : TOPICS.ARM.WRIST_PITCH, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    WRIST_ROTATION: new ROSLIB.Topic({ ros, name : TOPICS.ARM.WRIST_ROTATION, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
  }

  const publishArmCommand = (joint, data) => {
    let message = new ROSLIB.Message({data});
    armtrainTopics[joint].publish(message);
  }

  const cycleDriveState = () => {
    driveState = DRIVE_STATES.getNext(driveState);
  }

  const publishDriveSteerCommand = data => {
    let driveValues = calculateDriveValues(driveState, leftAxis.y, leftAxis.x, leftAxis.y, leftAxis.x, leftAxis.x, [0,0,0,0,0,0,0,0,0,0], leftAxis.y, leftAxis.x, sensdrive, senssteer)

    let {
    lf,
    lm,
    lb,
    rf,
    rm,
    rb,
    strLf,
    strLb,
    strRf,
    strRb
    } = driveValues

    publishDrivetrain({lf, lm, lb, rf, rm, rb});
    publishSteertrain({strLf, strLb, strRf, strRb});
  }


  //CONTROLLER HANDLING

  function cycleControllerBind() {
    controllerBind = CONTROLLER_BINDS.getNext(controllerBind);
  }

  function LeftStick(event) {
    leftAxis = event.detail;
    if (controllerBind == CONTROLLER_BINDS.DRIVE) {
      publishDriveSteerCommand(event.detail);
    } else if (controllerBind == CONTROLLER_BINDS.ARM) {
      let shoulderRot = mapRange(event.detail.x, -1, 1, -100, 100);
      publishArmCommand("SHOULDER_ROTATION", shoulderRot);
      let shoulderPitch = mapRange(event.detail.y, -1, 1, -100, 100);
      publishArmCommand("SHOULDER_PITCH", shoulderPitch);
    } 
  }

  function RightStick(event) {
    rightAxis = event.detail;
    if (controllerBind == CONTROLLER_BINDS.ARM) {
      let shoulderRot = mapRange(event.detail.x, -1, 1, -100, 100);
      publishArmCommand("WRIST_ROTATION", shoulderRot);
      let shoulderPitch = mapRange(event.detail.y, -1, 1, -100, 100);
      publishArmCommand("WRIST_PITCH", shoulderPitch);
    }
  }

  function LeftTrigger(event) {
    if (event.detail == null) event.detail = 0;
    if (controllerBind == CONTROLLER_BINDS.ARM) {
      let shoulderRot = mapRange(event.detail, 0, 1, 0, 100);
      publishArmCommand("ELBOW_PITCH", shoulderRot);
    }
  }

  function RightTrigger(event) {
    if (event.detail == null) event.detail = 0;
    if (controllerBind == CONTROLLER_BINDS.ARM) {
      let shoulderRot = mapRange(event.detail, 0, 1, -100, 0);
      publishArmCommand("ELBOW_PITCH", shoulderRot);
    }
  }

  function buttonA(event) {
    if (controllerBind == CONTROLLER_BINDS.DRIVE) {
      cycleDriveState();
    }
  }


</script>




<Gamepad
  gamepadIndex={0}
  on:A={buttonA}
  on:RT={RightTrigger}
  on:LT={LeftTrigger}
  on:LeftStick={LeftStick}
  on:RightStick={RightStick}
  on:DPadRight={cycleControllerBind}
/>

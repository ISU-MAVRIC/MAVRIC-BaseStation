<!-- This component doesn't visually display anything on screen, however it handles setting up controllers and publishing drive and arm commands -->
<script>
  //Library Imports
  import ROSLIB from 'roslib/src/RosLib';

  //Project Imports
  import connectionHandler from '../stores/connectionHandlerStore';
  import { calculateDriveValues, DRIVE_STATES } from '../utils/driveMath';
  import Gamepad from './gamepad/Gamepad.svelte';
  import { DEFAULTS, TOPICS, CONTROLLER_BINDS } from '../utils/config.js'
  import mapRange from '../utils/mapRange';

  // Svelte Component Properties
  export let driveState;
  

  //Variables
  /// ROS
  let ros = $connectionHandler.getROSInstance();

  /// Drive Math
  let sensdrive = 1; // 0 to 1 
  let senssteer = 1; // 0 to 1
  
  /// Controller
  let leftAxis = { x: 0, y: 0 };
  let rightAxis = { x: 0, y: 0 };
  let lTrigger = 0;
  let rTrigger = 0;
  let rBumperPressed = false;
  let lBumperPressed = false;
  let controllerBind = DEFAULTS.CONTROLLER.BIND;

  ///Intervals
  let clawInterval;
  let clawPosition = 255;

  /// Could be moved to config
  let CLAW_POSITION_INTERVAL = 5;
  let CLAW_INTERVAL_PER_SECOND = 10;
  let CLAW_MAXIMUM = 255;
  let CLAW_MINIMUM = 0;



  // ROS Topics and Publishers
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
  
  const publishDriveSteerCommand = data => {
    //Calculate drive values to be published to drivetrain and steertrain topics
    let driveValues = calculateDriveValues(driveState, leftAxis.y, leftAxis.x, leftAxis.y, leftAxis.x, leftAxis.x, [0,0,0,0,0,0,0,0,0,0], leftAxis.y, leftAxis.x, sensdrive, senssteer)

    //Destructure elements from returned driveValues into their own variables
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

    //Publish drivetrain commands
    publishDrivetrain({lf, lm, lb, rf, rm, rb});
    //Publish steertrain commands
    publishSteertrain({strLf, strLb, strRf, strRb});
  }

  //Create a new object for all the armtrain topics
  //Each joint is its own topic, so for code cleanliness store in an object instead of separate variables
  const armtrainTopics = {
    SHOULDER_ROTATION: new ROSLIB.Topic({ ros, name : TOPICS.ARM.SHOULDER_ROTATION, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    SHOULDER_PITCH: new ROSLIB.Topic({ ros, name : TOPICS.ARM.SHOULDER_PITCH, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    ELBOW_PITCH: new ROSLIB.Topic({ ros, name : TOPICS.ARM.ELBOW_PITCH, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    WRIST_PITCH: new ROSLIB.Topic({ ros, name : TOPICS.ARM.WRIST_PITCH, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    WRIST_ROTATION: new ROSLIB.Topic({ ros, name : TOPICS.ARM.WRIST_ROTATION, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    CLAW: new ROSLIB.Topic({ ros, name : TOPICS.ARM.CLAW, messageType : TOPICS.ARM.ARM_MSG_TYPE })
  }

  //Function to publish data value to specific joint ("SHOULDER_ROTATION" | "SHOULDER_PITCH" | ...)
  const publishArmCommand = (joint, data) => {
    let message = new ROSLIB.Message({data});
    armtrainTopics[joint].publish(message);
  }

  //Function to switch drive state to next drive state
  const cycleDriveState = () => {
    driveState = DRIVE_STATES.getNext(driveState);
  }



  //CONTROLLER HANDLING

  //Function for switching what the controller is connected to (Currently ARM or DRIVE)
  function cycleControllerBind() {
    controllerBind = CONTROLLER_BINDS.getNext(controllerBind);
  }

  //Callback function for when the left joystick is moved
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

  //Callback function for when the right joystick is moved
  function RightStick(event) {
    rightAxis = event.detail;
    if (controllerBind == CONTROLLER_BINDS.ARM) {
      let shoulderRot = mapRange(event.detail.x, -1, 1, -100, 100);
      publishArmCommand("WRIST_ROTATION", shoulderRot);
      let shoulderPitch = mapRange(event.detail.y, -1, 1, -100, 100);
      publishArmCommand("WRIST_PITCH", shoulderPitch);
    }
  }

  //Callback function for when the left trigger is moved
  function LeftTrigger(event) {
    //Controller will return null when button is no longer pressed, set to zero 
    if (event.detail == null) {
      lTrigger = 0;
    } else {
      lTrigger = event.detail.value;
    }
    //If controller is bound to arm, send as arm command
    if (controllerBind == CONTROLLER_BINDS.ARM) {
      //Map the two trigger values to between -100 and 100
      let shoulderRot = mapRange(rTrigger-lTrigger, -1, 1, -100, 100);
      publishArmCommand("ELBOW_PITCH", shoulderRot);
    }
  }

  //Callback function for when the right trigger is moved
  function RightTrigger(event) {
    //Controller will return null when button is no longer pressed, set to zero 
    if (event.detail == null) {
      rTrigger = 0;
    } else {
      rTrigger = event.detail.value;
    }
    //If controller is bound to arm, send as arm command
    if (controllerBind == CONTROLLER_BINDS.ARM) {
      //Map the two trigger values to between -100 and 100
      let shoulderRot = mapRange(rTrigger-lTrigger, -1, 1, -100, 100);
      publishArmCommand("ELBOW_PITCH", shoulderRot);
    }
  }

  //Callback function for when the A button is pressed
  function buttonA(event) {
    if (controllerBind == CONTROLLER_BINDS.DRIVE) {
      cycleDriveState();
    }
  }

  //Callback function for when the DPad right button is pressed
  function DPadRight(event) {
    cycleControllerBind();
  }

  //Callback function for when the RB button is pressed
  function RB(event) {
    //If button released
    if (event.detail == null) {
      rBumperPressed = false;
      //If the other bumper isnt pressed, stop the wrist interval
      !lBumperPressed && stopClawInterval();
    // else if button is pressed
    } else {
      //If it wasnt previously pressed, update and start wrist interval
      if (!rBumperPressed) {
        rBumperPressed = true;
        //Start wrist runnable
        !lBumperPressed && startClawInterval();
      } 
    }
  }

  //Callback function for when the LB button is pressed
  function LB(event) {
    //If button released
    if (event.detail == null) {
      lBumperPressed = false;
      //If the other bumper isnt pressed, stop the wrist interval
      !rBumperPressed && stopClawInterval();
    // else if button is pressed
    } else {
      //If it wasnt previously pressed, update and start wrist interval
      if (!lBumperPressed) {
        lBumperPressed = true;
        //Start wrist runnable
        !rBumperPressed && startClawInterval();
      } 
    }
  }
  

  // Claw Handling
  /// Function to stop setInterval handling claw opening/closing
  function stopClawInterval() {
    clearInterval(clawInterval);
  }

  /// Function to start setInterval handling claw opening/closing
  function startClawInterval() {
    clawInterval = setInterval(() => {
      //If both bumpers are pressed, we dont want to increase or decrease claw position
      if (rBumperPressed && lBumperPressed) return;
      //If the left bumper is pressed, decrement clawInterval
      if (lBumperPressed) {
        clawInterval -= CLAW_POSITION_INTERVAL;
      } else if (rBumperPressed) {
      //If the right bumper is pressed, increment clawInterval
        clawInterval += CLAW_POSITION_INTERVAL;
      }
      //Adjust for over/under shooting domain of clawInterval [0-255]
      if (clawInterval < CLAW_MINIMUM) clawInterval = CLAW_MINIMUM;
      if (clawInterval > CLAW_MAXIMUM) clawInterval = CLAW_MAXIMUM;
      //Send claw update
      publishArmCommand("CLAW", clawPosition);
    }, 1000 / CLAW_INTERVAL_PER_SECOND);
  }



</script>




<Gamepad
  gamepadIndex={0}
  on:A_PRESS={buttonA}
  on:RT={RightTrigger}
  on:LT={LeftTrigger}
  on:RB={RB}
  on:LB={LB}
  on:LeftStick={LeftStick}
  on:RightStick={RightStick}
  on:DPadRight_PRESS={DPadRight}
/>

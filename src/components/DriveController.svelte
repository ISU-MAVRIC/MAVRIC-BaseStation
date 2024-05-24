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
  export let controllerBind;
  export let controllerEnabled;
  

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

  ///Intervals
  let clawInterval;
  let clawPosition = -60;
  let luminometerPosition = 5;
  let lumiButtonPosition = 90;
  let lumiLidPosition = 0;
  let lumiLidState = 0;
  let lumiLidToggle = false;

  /// Could be moved to config
  let CLAW_POSITION_INTERVAL = 5;
  let CLAW_INTERVAL_PER_SECOND = 10;
  let CLAW_MAXIMUM = 100;
  let CLAW_MINIMUM = -100;
  let LUMI_STRAIGHT = 5;
  let LUMI_DUMP = -36;
  let LUMIBUTTON_RELEASED = 90;
  let LUMIBUTTON_PRESSED = -10;
  let LUMILID_CLOSED = -82;
  let LUMILID_OPEN = 20;

  //Ros attribute change listener to send zeros when controller is disabled
  $: !controllerEnabled && setZeros()

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
    CLAW: new ROSLIB.Topic({ ros, name : TOPICS.ARM.CLAW, messageType : TOPICS.ARM.ARM_MSG_TYPE }),
    LUMINOMETER: new ROSLIB.Topic({ ros, name : TOPICS.ARM.LUMINOMETER, messageType : TOPICS.ARM.ARM_MSG_TYPE}),
    LUMIBUTTON: new ROSLIB.Topic({ ros, name : TOPICS.ARM.LUMIBUTTON, messageType : TOPICS.ARM.ARM_MSG_TYPE}),
    LUMILID: new ROSLIB.Topic({ ros, name : TOPICS.ARM.LUMILID, messageType : TOPICS.ARM.ARM_MSG_TYPE}),
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

  // function that sets all drive, steer, and arm values to zero
  const setZeros = () => {
    publishDrivetrain({
      lf: 0,
      lm: 0,
      lb: 0,
      rf: 0,
      rm: 0,
      rb: 0
    });
    publishSteertrain({
      strLf: 0,
      strLb: 0,
      strRf: 0,
      strRb: 0
    });
    publishArmCommand("SHOULDER_ROTATION", 0);
    publishArmCommand("SHOULDER_PITCH", 0);
    publishArmCommand("ELBOW_PITCH", 0);
    publishArmCommand("WRIST_PITCH", 0);
    publishArmCommand("WRIST_ROTATION", 0);
  }

  //CONTROLLER HANDLING

  //Function for switching what the controller is connected to (Currently ARM or DRIVE)
  function cycleControllerBind() {
    controllerBind = CONTROLLER_BINDS.getNext(controllerBind);
  }

  //Callback function for when the left joystick is moved
  function LeftStick(event, TYPE=null) {
    //If controllerEnabled is false, return to not publish anything
    if(!controllerEnabled) return;

    leftAxis = event.detail;
    //Controller logic, if its a drive command or there is no type and the controller bind is drive
    if (TYPE == "DRIVE" || (TYPE == null && controllerBind == CONTROLLER_BINDS.DRIVE)) {
      publishDriveSteerCommand(event.detail);
    //Controller logic, if its a arm command or there is no type and the controller bind is arm
    } else if (TYPE == "ARM" || (TYPE == null && controllerBind == CONTROLLER_BINDS.ARM)) {
      let shoulderRot = mapRange(event.detail.x, -1, 1, -100, 100);
      publishArmCommand("SHOULDER_ROTATION", shoulderRot);
      let shoulderPitch = mapRange(event.detail.y, -1, 1, -100, 100);
      publishArmCommand("SHOULDER_PITCH", shoulderPitch);
    } 
  }

  //Callback function for when the right joystick is moved
  function RightStick(event, TYPE=null) {
    
    rightAxis = event.detail;
    //If its an arm command or there is no type and the controller bind is arm
    if (TYPE == "ARM" || (TYPE == null && controllerBind == CONTROLLER_BINDS.ARM)) {
      let shoulderRot = mapRange(event.detail.x, -1, 1, -100, 100);
      publishArmCommand("WRIST_ROTATION", shoulderRot);
      let shoulderPitch = mapRange(event.detail.y, -1, 1, -100, 100);
      publishArmCommand("WRIST_PITCH", shoulderPitch);
    }
  }

  function DriveSensitivity(event, TYPE=null) {
    if (TYPE == "DRIVE" || (TYPE == null && controllerBind == CONTROLLER_BINDS.DRIVE)) {
      sensdrive = (1 - event.detail.x)/2;
    }
  }

  //Callback function for when the left trigger is moved
  function LeftTrigger(event, TYPE=null) {
    
    //Controller will return null when button is no longer pressed, set to zero 
    if (event.detail == null) {
      lTrigger = 0;
    } else {
      lTrigger = event.detail.value;
    }
    //If controller is bound to arm, send as arm command
    if (TYPE == "ARM" || (TYPE == null && controllerBind == CONTROLLER_BINDS.ARM)) {
      //Map the two trigger values to between -100 and 100
      let shoulderRot = mapRange(rTrigger-lTrigger, -1, 1, -100, 100);
      publishArmCommand("ELBOW_PITCH", shoulderRot);
    }
  }

  //Callback function for when the right trigger is moved
  function RightTrigger(event, TYPE=null) {
    //Controller will return null when button is no longer pressed, set to zero 
    if (event.detail == null) {
      rTrigger = 0;
    } else {
      rTrigger = event.detail.value;
    }
    //If controller is bound to arm, send as arm command
    if (TYPE == "ARM" || (TYPE == null && controllerBind == CONTROLLER_BINDS.ARM)) {
      //Map the two trigger values to between -100 and 100
      let shoulderRot = mapRange(rTrigger-lTrigger, -1, 1, -100, 100);
      publishArmCommand("ELBOW_PITCH", shoulderRot);
    }
  }

  //Callback function for when the A button is pressed
  function buttonA(event, TYPE=null) {
    if (TYPE == "DRIVE" || (TYPE == null && controllerBind == CONTROLLER_BINDS.DRIVE)) {
      cycleDriveState();
    }
  }

  //Callback function for when the DPad right button is pressed
  function buttonB(event) {
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

  //Callback function to set luminometer to upright position
  function LuminometerStraight(event) {
    // set position to straight up and down position
    luminometerPosition = LUMI_STRAIGHT;
    publishArmCommand("LUMINOMETER", luminometerPosition);
  }

  //Callback function to set luminometer to dump position
  function LuminometerDump(event) {
    // set position to dump position
    luminometerPosition = LUMI_DUMP;
    publishArmCommand("LUMINOMETER", luminometerPosition);
  }

  //Callback function whenever Luminometer button is pressed
  function LumiButton(event) {
    //if button is released or not pressed, set servo is released position
    if (event.detail == null) {
      lumiButtonPosition = LUMIBUTTON_RELEASED;
    }
    // if button is pressed, set servo to pressed position
    else {
      lumiButtonPosition = LUMIBUTTON_PRESSED;
    }
    // publish the button position
    publishArmCommand("LUMIBUTTON", lumiButtonPosition);
  }

  //Callback function that toggles the lid open and closed
  function LumiLid(event) {
    // if button isn't being pressed or is released
    if (event.detail == null) {
      //toggle is turned off, meaning button can be pressed again
      lumiLidToggle = false;
    }
    else {
      // if the button isn't currently being pressed
      if (lumiLidToggle == false) {
        // if in one state, switch to next state. 0 is open, 1 is closed
        if (lumiLidState == 0) {
          lumiLidState = 1;
          lumiLidPosition = LUMILID_CLOSED;
        }
        else if (lumiLidState == 1) {
          lumiLidState = 0;
          lumiLidPosition = LUMILID_OPEN;
        }
        lumiLidToggle = true; // button is being pressed/held down
      }
      else { // lumiLidToggle is true
        // if button is still being held down, exit function
        return
      }
    }
    // publish the lid position
    publishArmCommand("LUMILID", lumiLidPosition);
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
        clawPosition -= CLAW_POSITION_INTERVAL;
      } else if (rBumperPressed) {
      //If the right bumper is pressed, increment clawInterval
        clawPosition += CLAW_POSITION_INTERVAL;
      }
      //Adjust for over/under shooting domain of clawInterval [-100 to 100]
      if (clawPosition < CLAW_MINIMUM) clawPosition = CLAW_MINIMUM;
      if (clawPosition > CLAW_MAXIMUM) clawPosition = CLAW_MAXIMUM;
      //Send claw update
      publishArmCommand("CLAW", clawPosition);
    }, 1000 / CLAW_INTERVAL_PER_SECOND);
  }

</script>




<!-- Add first controller, only for DRIVE commands -->
<Gamepad
  gamepadIndex={0}
  on:A_PRESS={buttonA}
  on:LeftStick={(event) => { LeftStick(event, "DRIVE")}}
  on:RightStick={DriveSensitivity}
/>

<!-- Add second controller, only bound to ARM commands -->
<Gamepad
  gamepadIndex={1}
  on:A_PRESS={(event) => { buttonA(event, "ARM")}}
  on:LeftStick={(event) => { LeftStick(event, "ARM")}}
  on:RightStick={(event) => { RightStick(event, "ARM")}}
  on:RT={(event) => { RightTrigger(event, "ARM")}}
  on:LT={(event) => { LeftTrigger(event, "ARM")}}
  on:RB={RB}
  on:LB={LB}
  on:DPadLeft_PRESS={LuminometerStraight}
  on:DPadRight_PRESS={LuminometerDump}
  on:Y={LumiButton}
  on:X={LumiLid}
/>
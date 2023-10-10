
<script>
  import ROSLIB from 'roslib/src/RosLib';
  import connectionHandler from './stores/connectionHandlerStore';

  import { calculateDriveValues, DRIVE_STATES } from '../scripts/utils/driveMath';
  import Gamepad from './components/gamepad/Gamepad.svelte';

  
  // ROS TOPICS SETUP

  const drivetrainTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : '/CAN_DTS/Drive_Train',
    messageType : 'mavric/Drivetrain'
  });


  const publishDrivetrain = data => {
    let message = new ROSLIB.Message(data);
    drivetrainTopic.publish(message);
  }

  const steertrainTopic = new ROSLIB.Topic({
    ros : $connectionHandler.getROSInstance(),
    name : '/CAN_DTS/Steer_Train',
    messageType : 'mavric/Steertrain'
  });


  const publishSteertrain = data => {
    let message = new ROSLIB.Message(data);
    steertrainTopic.publish(message);
  }

  //

  // DRIVE STATE UPDATE

  let driveState = DRIVE_STATES.TANK;

  const cycleDriveState = () => {
    driveState = DRIVE_STATES.getNext(driveState);
  }

  //


  //CONTROLLER HANDLING

  let leftAxis = { x: 0, y: 0 };
  let rightAxis = { x: 0, y: 0 };


  function LeftStick(event) {
    leftAxis = event.detail;
    let sensdrive = 1; // 0 to 1 
    let senssteer = 1; // 0 to 1

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

    publishDrivetrain({lf, lm, lb, rf, rm, rb})
    publishSteertrain({strLf, strLb, strRf, strRb})
    console.log(driveValues);
  }

  function RightStick(event) {
    rightAxis = event.detail;
  }

  //



</script>



<div>
  <Gamepad
    gamepadIndex={0}
    on:A={cycleDriveState}
    on:LeftStick={LeftStick}
    on:RightStick={RightStick}
  />

  <p>{JSON.stringify(leftAxis)}</p>
  <p>{driveState}</p>
</div>
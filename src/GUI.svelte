
<script>
  import ROSLIB from 'roslib/src/RosLib';
  import connectionHandler from './stores/connectionHandlerStore';

  import { calculateDriveValues, DRIVE_STATES } from '../scripts/utils/driveMath';
  import Gamepad from './components/gamepad/Gamepad.svelte';
  import { DEFAULTS } from '../scripts/utils/config.js';

  import DriveController from './components/DriveController.svelte';

  let driveState = DEFAULTS.ARM.DRIVE_STATE;


</script>



<div>
  <DriveController bind:driveState />

  <p>{driveState}</p>
</div>

<script>
  import { DEFAULTS } from '../scripts/utils/config.js';

  import DriveController from './components/DriveController.svelte';
  import PageDisplay from './pages/PageDisplay.svelte';
  import PageNavBar from './pages/PageNavBar.svelte';
  import PageHeader from './pages/PageHeader.svelte';

  let driveState = DEFAULTS.DRIVE.DRIVE_STATE;
  let selected  = DEFAULTS.HOME_PAGE.label;

</script>



<div class="container">
  <DriveController bind:driveState />
  <PageNavBar bind:selected />
  <div class="content">
    <div class="page-header">
      <PageHeader bind:selected />
    </div>
    <div class="break"/>
    <div class="page-display">
      <PageDisplay bind:selected />
    </div>
  </div>
</div>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
}

.content{
  height: 100%;
  width: 80%
}

.page-header {
  width: 100%;
  height: 10%;
}

.page-display {
  width: 100%;
  height: 90%;
  background-color: aqua;
}

.break {
  flex-basis: 100%;
  height: 0;
}
</style>
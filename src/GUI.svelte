
<script>
  import { DEFAULTS } from '../scripts/utils/config.js';

  import DriveController from './components/DriveController.svelte';
  import PageDisplay from './pages/PageDisplay.svelte';
  import PageNavBar from './pages/PageNavBar.svelte';
  import PageHeader from './pages/PageHeader.svelte';

  import homeSVG from '../public/icons/home.svelte';
  import OverviewPage from './pages/Overview.svelte';
  import AutonomousDebugPage from './pages/AutonomousDebug.svelte';
  import TopicDebugPage from './pages/TopicDebug.svelte';
  import ScaleTunerPage from './pages/ScaleTuner.svelte';

  let driveState = DEFAULTS.DRIVE.DRIVE_STATE;
  let selected  = DEFAULTS.HOME_PAGE;

  
  const PAGES = [
    {
      label: "Overview",
      icon: homeSVG,
      component: OverviewPage
    },
    {
      label: "Autonomous Debug",
      icon: homeSVG,
      component: AutonomousDebugPage
    },
    {
      label: "Topic Debug",
      icon: homeSVG,
      component: TopicDebugPage
    },
    {
      label: "Scale Tuner",
      icon: homeSVG,
      component: ScaleTunerPage
    }
  ];


</script>



<div class="container">
  <DriveController bind:driveState/>
  <PageNavBar bind:selected  PAGES={PAGES}/>
  <div class="content">
    <div class="page-header">
      <PageHeader bind:selected PAGES={PAGES}/>
    </div>
    <div class="break"/>
    <div class="page-display">
      <PageDisplay bind:selected bind:driveState PAGES={PAGES}/>
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

<script>
  //Project Imports
  import { DEFAULTS } from './utils/config.js';

  import DriveController from './components/DriveController.svelte';
  import PageDisplay from './pages/PageDisplay.svelte';
  import PageNavBar from './pages/PageNavBar.svelte';
  import PageHeader from './pages/PageHeader.svelte';

  import { scaleTunerIcon, overviewIcon, topicDebugIcon, autoDebugIcon, cameraIcon } from './utils/navIcons.js';

  import OverviewPage from './pages/Overview.svelte';
  import AutonomousDebugPage from './pages/AutonomousDebug.svelte';
  import TopicDebugPage from './pages/TopicDebug.svelte';
  import ScaleTunerPage from './pages/ScaleTuner.svelte';
  import CameraPage from './pages/Camera.svelte';

  //Variables
  let driveState = DEFAULTS.DRIVE.DRIVE_STATE;
  let controllerBind = DEFAULTS.CONTROLLER.BIND;
  let controllerEnabled = true;
  let navCollapsed = false;
  let selected  = DEFAULTS.HOME_PAGE;

  //List of all accessible pages, including the label, icon, and component
  //Used by PageHeader, PageNavBar, and PageDisplay
  //Anything added to this list will automatically be added to the nav bar
  const PAGES = [
    {
      label: "Overview",
      icon: overviewIcon,
      component: OverviewPage
    },
    {
      label: "Autonomous Debug",
      icon: autoDebugIcon,
      component: AutonomousDebugPage
    },
    {
      label: "Topic Debug",
      icon: topicDebugIcon,
      component: TopicDebugPage
    },
    {
      label: "Camera Control",
      icon: cameraIcon,
      component: CameraPage
    },
    {
      label: "Scale Tuner",
      icon: scaleTunerIcon,
      component: ScaleTunerPage
    }
  ];


</script>



<div class={`container ${navCollapsed ? "layout-collapsed" : "layout"}`}>
  <DriveController bind:driveState bind:controllerEnabled bind:controllerBind/>
  <div class="page-nav">
    <PageNavBar bind:selected  bind:controllerEnabled PAGES={PAGES} bind:navCollapsed/>
  </div>
  <div class="page-display">
    <PageDisplay bind:selected bind:driveState bind:controllerBind PAGES={PAGES}/>
  </div>
</div>

<style>
.container {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.layout {
  display: grid;
  grid-template-columns: 250px auto;
  /* Container layout */
  grid-template-areas: 
    'nav display';
}

.layout-collapsed {
  display: grid;
  grid-template-columns: 100px auto;
  /* Container layout */
  grid-template-areas: 
    'nav display';
}

.content{
  height: 100%;
  flex-grow: 1;
}


.page-display {
  grid-area: display;
  background-color: gray;
}

.page-nav {
  grid-area: nav;
}

</style>
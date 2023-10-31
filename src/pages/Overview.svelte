<!-- Component to be loaded into PageDisplay component when Overview is selected in PageNavBar -->
<script>
  //Project Imports
  import CommonDisplay from '../components/CommonDisplay.svelte';

  //Component Properties
  export let driveState;
</script>

<CommonDisplay driveState={driveState}/>
<p>Overview</p>

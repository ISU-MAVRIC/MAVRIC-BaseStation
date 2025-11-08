<!-- This component is responsible for displaying the currently selected page in the PageDisplay section of the GUI layout. If you don't know the basic layout of the GUI, see the "Basic GUI Layout" section of the README-->
<script>
  //Component properties
  export let selected;
  export let driveState;
  export let PAGES;
  export let controllerBind;
</script>

<!-- For each of the possible pages, display the component with the correct label matching the selected property -->
{#each PAGES as page}
  {#if selected == page.label}
    <svelte:component
      this={page.component}
      bind:driveState
      bind:controllerBind
    />
  {/if}
{/each}

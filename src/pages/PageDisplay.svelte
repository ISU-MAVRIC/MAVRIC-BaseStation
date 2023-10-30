<script>
  import { DEFAULTS} from '../../scripts/utils/config.js';

  export let selected;
  export let driveState;
  export let PAGES;

</script>

{#each PAGES as page}
  {#if selected == page.label}
    <svelte:component bind:driveState this={page.component} />
  {/if}
{/each}

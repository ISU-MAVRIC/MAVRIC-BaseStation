<script>
  import {PAGES, DEFAULTS} from '../../scripts/utils/config.js';

  export let selected;

</script>

{#each PAGES as page}
  {#if selected == page.label}
    <svelte:component this={page.component} />
  {/if}
{/each}

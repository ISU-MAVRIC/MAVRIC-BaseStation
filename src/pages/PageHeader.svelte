<script>
  import {PAGES} from '../../scripts/utils/config';
  export let selected;

</script>

{#each PAGES as page}
  {#if selected == page.label}
    <p>{page.label}</p>
  {/if}
{/each}

<style>
  p {
    margin: 0;
    padding: 0;
    height: 100%;
    flex-grow: 1;
    background: green;
  }

  @media only screen and (min-height: 600px) {
    p {
      font-size: 5.5vh;
    }
  }

  @media only screen and (max-height: 600px) {
    p {
      font-size: 8.5vh;
    }
  }

  p {
    padding: 0px 5px;
    margin: 0;
  }
</style>

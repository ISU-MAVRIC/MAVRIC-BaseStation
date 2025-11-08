<!-- This component is responsible for displaying the PageHeader section of the GUI layout (currently just the page label). If you don't know the basic layout of the GUI, see the "Basic GUI Layout" section of the README-->
<script>
  //Component properties
  export let selected;
  export let PAGES;

</script>


<!-- Display page label by looping through all pages until the label matches selected and displaying that label.
This could be done by just displaying the value of the selected property, but we decided to do it like this instead in case we want to add
more to the header in the future. -->
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
    background: lightgray;
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

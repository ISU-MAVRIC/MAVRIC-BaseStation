<script>
  export let topic;
  export let deleteFunction, moveUp, moveDown, moveStart;
  
  let element;

  let scroll = () => element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
</script>


<div class="topic-container">
  <div class="topic-header">
    <input class="topic-name" placeholder={topic.topic_name} value={topic.display_name}>
    <div class="topic-options">
      <div class="topic-delete" on:click={deleteFunction}>Delete</div>
      <div class="topic-delete" on:click={moveUp}>Up</div>
      <div class="topic-delete" on:click={moveDown}>Down</div>
      <div class="topic-delete" on:click={moveStart}>Top</div>
    </div>
  </div>
  <div bind:this={element} class="topic-data">
    {#each topic.data_log as data_segment}
      <p use:scroll >{JSON.stringify(data_segment)}</p>
    {/each}
  </div>
</div>


<style>
  .topic-container {
    background-color: blanchedalmond;
    width: 100%;
    border-radius: 10px;
    margin: 5px;
    display: block;
  }

  .topic-header {
    display: flex;
  }

  .topic-options {
    display: flex;
  }

  .topic-delete {
    margin-left: auto;
  }

  .topic-data {
    background-color: cadetblue;
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
    overflow-y: auto;
  }

  .topic-name {
    border: none;
    background-color: inherit;
    outline: none;
    flex-grow: 1;
    opacity: 1;
  }
</style>
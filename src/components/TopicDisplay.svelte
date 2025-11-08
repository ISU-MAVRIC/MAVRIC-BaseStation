<script>
  export let topic;
  export let deleteFunction, moveUp, moveDown, moveStart;
  
  let element;

  let scrollBottom = () => {
    topic.autoscroll && element.scroll({ top: element.scrollHeight });
  }

  let handleScroll = () => {
    if ((element.scrollTop / (element.scrollHeight - element.clientHeight)) != 1) {
      topic.autoscroll = false;
    }
  }

  let scrollToBottomButton = () => {
    topic.autoscroll = true;
    scrollBottom();
  }
</script>


<div class="topic-container">
  <div class="topic-header">
    <p class="topic-name">{topic.topic_name}</p>
    <div class="topic-options">
      <div class="topic-delete" on:click={deleteFunction}>Delete</div>
      <div class="topic-delete" on:click={moveUp}>Up</div>
      <div class="topic-delete" on:click={moveDown}>Down</div>
      <div class="topic-delete" on:click={moveStart}>Top</div>
    </div>
  </div>
  <div bind:this={element} class="topic-data" on:scroll={handleScroll}>
    {#each topic.data_log as data_segment}
      <p use:scrollBottom class="topic-data-element">{JSON.stringify(data_segment)}</p>
    {/each}
  </div>
  <div on:click={scrollToBottomButton} class={topic.autoscroll ? "hidden" : ""}>scroll</div>
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

  .hidden {
    display: none;
  }

  .topic-data {
    background-color: cadetblue;
    width: 100%;
    height: 200px;
    margin-bottom: 10px;
    overflow-y: auto;
  }


  .topic-name {
    flex-grow: 1;
  }

  .topic-data-element:nth-of-type(odd) {
    background-color: gray;
  }

  
  .topic-data-element:nth-of-type(even) {
    background-color: lightgray;
  }

  p {
    margin: 0;
    padding: 0;
  }
</style>
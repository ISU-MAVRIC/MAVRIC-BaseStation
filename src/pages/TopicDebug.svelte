<script>
  import ROSLIB from 'roslib/src/RosLib';

  import connectionHandler from '../stores/connectionHandlerStore';

  let topicList = [
    //EXAMPLE Entry
    // {
    //   topic_name: "/test/Reee",
    //   topic_msg_type: "",
    //   data_log: [{test:"x", test2:"y"},{test:"x", test2:"y"}],
    //   topic: null
    // }
  ];

  let topicSelectList = [];
  let topicSelected;
  let topicDataElement = [];

  let id = 0;


  let refreshTopics = () => {
    $connectionHandler.getROSInstance().getTopics((data) => {
      topicSelectList = [];
      data.topics.map((_, index) => {
        topicSelectList.push({topic_name: data.topics[index], topic_msg_type: data.types[index]})
      });
      topicSelectList = topicSelectList;
    });
  }


  let addTopic = () => {
    if (topicSelected) {
      let newTopic = {
          id: id += 1,
          topic_name: topicSelected.topic_name,
          topic_msg_type: topicSelected.topic_msg_type,
          data_log: [],
          topic: new ROSLIB.Topic({
            ros: $connectionHandler.getROSInstance(),
            name : topicSelected.topic_name,
            messageType : topicSelected.topic_msg_type
          })
      };

      newTopic.topic.subscribe(data => {
        newTopic.data_log.push(data)
        topicList = topicList;
      });

      topicList.push(newTopic);
    }
    topicList = topicList;
  }

  let deleteTopic = (index) => {
    console.log(index)
    topicList.splice(index, 1)
    topicList = topicList;
  }

  let scrollDataElementByIndex = (_, index) => {
    console.log(topicDataElement)
    console.log(index)
    topicDataElement[index].scroll({ top: topicDataElement[index].scrollHeight, behavior: 'smooth' });
  };


  refreshTopics();
</script>

<div class="container">
  <div class="selector-container">
    <p class="selector-refresh" on:click={refreshTopics}>refresh</p>
    <select class="selector-select" bind:value={topicSelected}>
      {#each topicSelectList as topicSelectElement}
        <option value={topicSelectElement}>
          {topicSelectElement.topic_name}
        </option>
      {/each}
    </select>
    <p class="selector-topic">{topicSelected ? topicSelected.topic_msg_type : "Select Topic to add"}</p>
    <p class="selector-add" on:click={addTopic}>add</p>
  </div>
  {#each topicList as topic, index}
    <div class="topic-container">
      <div class="topic-header">
        <input class="topic-name" placeholder={topic.topic_name}>
        <div class="topic-delete" on:click={deleteTopic.bind(this, index)}>Delete</div>
      </div>
      <div bind:this={topicDataElement[index]} class="topic-data">
        {#each topic.data_log as data_segment}
          <p use:scrollDataElementByIndex={index}>{JSON.stringify(data_segment)}</p>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>

  p {
    padding: 0;
		margin: 0;
  }

  .container {
    width: 100%;
    height: 100%;
    background-color: rebeccapurple;
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .selector-container {
    width: 100%;
    height: 50px;
    background-color: orange;
    display: flex;
  }

  .selector-refresh {
    width: 10%;
  }

  .selector-select {
    width: 70%;
  }

  .selector-topic x{
    width: 10%;
  }

  .selector-add {
    width: 10%;
  }

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
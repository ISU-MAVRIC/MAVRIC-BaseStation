<script>
  import ROSLIB from 'roslib/src/RosLib';

  import TopicDisplay from '../components/TopicDisplay.svelte';
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

  let getIndexByID = (desiredId) => {
    return topicList.findIndex(topic => desiredId == topic.id);
  }

  let deleteTopic = (id) => {
    console.log(id)
    let index = getIndexByID(id);
    topicList.splice(index, 1)
    topicList = topicList;
  }

  let moveTopicAbsolute = (id, newIndex) => {
    let index = getIndexByID(id);
    let topic = topicList[index];
    topicList.splice(index, 1);
    topicList.splice(newIndex, 0, topic);
    topicList = topicList;
  }

  let moveTopicRelative = (id, offset) => {
    let index = getIndexByID(id);
    console.log(index)
    console.log(id, index + offset)
    moveTopicAbsolute(id, index + offset);
    console.log(topicList);
  }




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
  {#each topicList as topic}
    <TopicDisplay 
      deleteFunction={deleteTopic.bind(this, topic.id)} 
      moveUp={moveTopicRelative.bind(this, topic.id, -1)} 
      moveDown={moveTopicRelative.bind(this, topic.id, 1)} 
      moveStart={moveTopicAbsolute.bind(this, topic.id, 0)} 
      topic={topic} 
    />
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
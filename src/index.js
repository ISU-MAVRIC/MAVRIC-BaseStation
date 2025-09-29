//loads roslib
import ROSLIB from "roslib";
import ROSBridgeSingleton from "./rosbridge.js";

// Get the singleton instance
const rosBridge = new ROSBridgeSingleton();
const ros = rosBridge.getConnection();

// Define a topic (example)
const drive_train_topic = new ROSLIB.Topic({
  ros: ros,
  name: "/drive_train",
  messageType: "cysar/msg/DriveTrain",
});

// Example: List all available topics
ros.getTopics((topics) => {
  console.log("Available topics:", topics);
});

// Subscribe to the topic, 
// creates a callback that is called every time a message is received
drive_train_topic.subscribe((message) => {
  console.log("Received message on /drive_train:", message);
});

//Create and publish a message every second
const intervalId = setInterval(() => {
  const drivePercent = new ROSLIB.Message({
    front_left: 0.1,
    front_right: 0.1,
    back_left: 0.1,
    back_right: 0.1,
  });

  drive_train_topic.publish(drivePercent);
}, 1000); // publish every 1 second

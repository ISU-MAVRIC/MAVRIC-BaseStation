//loads roslib
import ROSLIB from "roslib";
import ROSBridgeSingleton from "./rosbridge.js";

// Get the singleton instance
const rosBridge = new ROSBridgeSingleton();
const ros = rosBridge.getConnection();

// Define a topic (example)
const drive_train = new ROSLIB.Topic({
  ros: ros,
  name: "/drive_train",
  messageType: "Cysar/DriveTrain",
});

//Create and publish a message every second
const intervalId = setInterval(() => {
  const drivePercent = new ROSLIB.Message({
    front_left: 0.1,
    front_right: 0.1,
    back_left: 0.1,
    back_right: 0.1,
  });

  drive_train.publish(drivePercent);
  console.log("Published message:", drivePercent);
}, 1000); // publish every 1 second

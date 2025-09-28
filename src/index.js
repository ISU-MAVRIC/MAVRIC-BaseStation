//loads roslib
import ROSLIB from "roslib";
import config from "./config.js";

//'instantiate'
const ros = new ROSLIB.Ros(
  //websockets object literal, replace localhost with the remote IP for radio control
  { url: config.ROSBRIDGE_URL }
);

// 2. Log connection status
ros.on("connection", () => {
  console.log("Connected to ROSBridge");

  //Define a topic
  const DriveTrain = new ROSLIB.Topic({
    ros: ros,
    name: "/drive_train",
    messageType: "cysar/DriveTrain",
  });

  //Create and publish a message every second
  const intervalId = setInterval(() => {
    const drivePercent = new ROSLIB.Message({
      front_left: 0.1,
      front_right: 0.1,
      back_left: 0.1,
      back_right: 0.1,
    });

    DriveTrain.publish(drivePercent);
    console.log("Published message:", drivePercent);
  }, 1000); // publish every 1 second

  // Stop publishing on disconnection
  ros.on("close", () => {
    clearInterval(intervalId);
    console.log("Stopped publishing due to disconnection");
  });
});

ros.on("error", (error) => {
  console.error("Error connecting:", error);
});

ros.on("close", () => {
  console.log("Connection closed");
});

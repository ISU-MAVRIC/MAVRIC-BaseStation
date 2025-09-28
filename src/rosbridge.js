// Singleton wrapper for ROSBridge WebSocket connection
// This is used in the actual base station, as the src/utils/ConnectionHandler.js
import ROSLIB from "roslib";
import config from "./config.js";

class ROSBridgeSingleton {
  constructor() {
    if (ROSBridgeSingleton.instance) {
      return ROSBridgeSingleton.instance;
    }

    this.ros = new ROSLIB.Ros({
      url: config.ROSBRIDGE_URL,
    });

    // Optional: Add connection event listeners here if needed globally
    this.ros.on("connection", () => {
      console.log("Connected to ROSBridge");
    });

    this.ros.on("error", (error) => {
      console.error("ROSBridge connection error:", error);
    });

    this.ros.on("close", () => {
      console.log("ROSBridge connection closed");
    });

    ROSBridgeSingleton.instance = this;
  }

  getConnection() {
    return this.ros;
  }

  // Optional: Add methods for publishing/subscribing if needed
}

export default ROSBridgeSingleton;

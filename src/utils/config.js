/**
 * @file Main configuration file used for setting topic names, connection strings, defaults, etc.
 */

import { zip } from 'rxjs';
import { DRIVE_STATES } from './driveMath.js';

/**
 * Connection string for connecting to the websocket server hosted by rosbridge_server.
 */
//export const MAVRIC_WEB_INTERFACE = "ws://192.168.1.10:9090";
export const MAVRIC_WEB_INTERFACE = "ws://localhost:9090";

 /**
  * Object containing possible systems (ARM/DRIVE) for the controller to be bound to
  * and a function for returning the next bind.
  */
export const CONTROLLER_BINDS = {
  ARM: "ARM",
  DRIVE: "DRIVE",
  //Function to return next possible controller state (ie. ARM returns DRIVE...)
  getNext: (currentBind) => {
    //Get all possible values for controller binds
    let keys = Object.keys(CONTROLLER_BINDS);
    //Get index of current selected option and increment to next option
    let nextIndex = keys.indexOf(currentBind) + 1;
    //Return value at nextIndex accounting for roll over 
    return keys[nextIndex % (keys.length - 1)];
  }
}


/**
 * Object setting default options when launching GUI
 * For Example: default home page, drive state, controller bind
 */
export const DEFAULTS = {
  CONTROLLER: {
    BIND: CONTROLLER_BINDS.DRIVE,
    ENABLE: false
  },
  DRIVE: {
    DRIVE_STATE: DRIVE_STATES.CAR
  },
  HOME_PAGE: "Overview",

  MAP: {
    START_COORDS:[38.406,-110.792],
    MAX_ZOOM: 18,
    MIN_ZOOM: 10,
    SOUTHWEST_BOUND: [38.406-2, -110.792-2],
    NORTHEAST_BOUND: [38.406+2, -110.792+2]
  }
  // MAP: {
  //   START_COORDS:[38.319,-111.382],
  //   MAX_ZOOM: 18,
  //   MIN_ZOOM: 10,
  //   SOUTHWEST_BOUND: [38.319-0.02, -111.382-0.02],
  //   NORTHEAST_BOUND: [38.319+0.02, -111.382+0.02]
  // }
}



/**
 * Not exported (Private helper object)
 * This object contains the prepended base topic name for different systems
 * For example: All arm topics start with /Arm/*, so the arm topic base is "/Arm"
 */
const TOPIC_BASE = {
  ARM: "/Arm"
}

/**
 * Object containing topic name and message type for each topic used on the base station
 */
export const TOPICS = {
  DRIVE: {
    DRIVE_TRAIN: '/drive_train',
    DRIVE_TRAIN_MSG_TYPE: 'mavric_msg/DriveTrain',
    STEER_TRAIN: '/steer_train', 
    STEER_TRAIN_MSG_TYPE: 'mavric_msg/SteerTrain',
  },
  ARM: {
    ARM_CONTROL: '/arm_control',
    ARM_CONTROL_MSG_TYPE: 'mavric_msg/Arm',
    SHOULDER_ROTATION: TOPIC_BASE.ARM + "/ShoulderRot",
    SHOULDER_PITCH: TOPIC_BASE.ARM  + "/ShoulderPitch",
    ELBOW_PITCH: TOPIC_BASE.ARM  + "/ElbowPitch",
    WRIST_PITCH: TOPIC_BASE.ARM  + "/WristPitch",
    WRIST_ROTATION: TOPIC_BASE.ARM + "/WristRot",
    DRILL: "/Science/Drill",
    DRILLACTUATOR: "/Science/DrillActuator",
    CLAW: "/Servo/ClawActuation",
    LUMINOMETER: "/Servo/Luminometer",
    LUMIBUTTON: "/Servo/LumiButton",
    LUMILID: "/Servo/LumiLid",
    CACHE: "/Servo/Sample",
  },
  SENSORS: {
    GPS: '/HW/GPS_Data',
    GPS_MSG_TYPE: 'std_msgs/String', // FIXED: Use standard message type temporarily
    IMU: '/HW/IMU/FusedAngle',
    IMU_MSG_TYPE: 'geometry_msgs/Vector3',
    BATTERY_VOLTAGE: '/HW/ADC',
    BATTERY_VOLTAGE_MSG_TYPE: 'std_msgs/Float32', // FIXED: Use standard message type
  },
  AUTONOMOUS: {
    STATE: '/Auto/State',
    STATE_MSG_TYPE: 'std_msgs/String',
    ENABLE: '/Auto/Enable',
    ENABLE_MSG_TYPE: 'std_msgs/Bool',
    WAYPOINTS: '/Auto/Waypoints',
    WAYPOINTS_MSG_TYPE: 'std_msgs/String',
    DEBUG: '/Auto/Debug',
    DEBUG_MSG_TYPE: 'std_msgs/String',
    TELEOP: '/Auto/Teleop',
    TELEOP_MSG_TYPE: 'std_msgs/Bool',
  },
  SCALES: {
    DRIVE_SCALE: '/drive_scale', // FIXED: Correct topic name
    DRIVE_SCALE_MSG_TYPE: "std_msgs/Float64",
    ARM_SCALES: '/arm_scales', // FIXED: Correct topic name  
    ARM_SCALES_MSG_TYPE: "mavric_msg/ArmScales",
    SCALE_FEEDBACK: '/scale_feedback',
    SCALE_FEEDBACK_MSG_TYPE: "mavric_msg/ScaleFeedback",
  },
  CAMERAS: {
    MAST: '/Camera/Mast',
    MAST_MSG_TYPE: 'sensor_msgs/Image', // FIXED: Standard message type
  }
}

/** 
 *  Object containing the minimums, maximums, and increments for scale tuner page
 */
export const SCALES = {
  DRIVE : {
    MIN: 0,
    MAX: 1,
    STEP: .01,
  },
  ARM : {
    shoulder_rot: { // FIXED: Use consistent naming
      MIN: 0,
      MAX: 1,
      STEP: .01
    },
    shoulder_pitch: { // FIXED: Use consistent naming
      MIN: 0,
      MAX: 1,
      STEP: .01
    },
    elbow_pitch: { // FIXED: Use consistent naming
      MIN: 0,
      MAX: 1,
      STEP: .01
    },
    wrist_pitch: { // FIXED: Use consistent naming
      MIN: 0,
      MAX: 1,
      STEP: .01
    },
    wrist_rot: { // FIXED: Use consistent naming
      MIN: 0,
      MAX: 1,
      STEP: .01
    }
  }
}
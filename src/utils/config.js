/**
 * @file Main configuration file used for setting topic names, connection strings, defaults, etc.
 */

import { zip } from 'rxjs';
import { DRIVE_STATES } from './driveMath.js';

/**
 * Connection string for connecting to the websocket server hosted by rosbridge_server.
 */
//export const MAVRIC_WEB_INTERFACE = "ws://192.168.1.10:9090";
export const MAVRIC_WEB_INTERFACE = "ws://10.26.196.2:9090";

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
  ARM: {
    ARM_MSG_TYPE: "std_msgs/Float64",
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
    GPS_MSG_TYPE: '/mavric/GPS',
    IMU: '/HW/IMU/FusedAngle',
    IMU_MSG_TYPE: '/geometry_msgs/Vector3',
    BATTERY_VOLTAGE: '/HW/ADC',
    BATTERY_VOLTAGE_MSG_TYPE: '/mavric/Voltage',
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
    DRIVE: '/Drive/Drive_Sensitivity',
    DRIVE_MSG_TYPE: "std_msgs/Float64",
    ARM: '/Arm/Arm_Sensitivity',
    ARM_MSG_TYPE: "/mavric/ArmData",
  },
  CAMERAS: {
    MAST: '/Camera/Mast',
    MAST_MSG_TYPE: '/mavric/Cam',
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
    SHOULDER_ROTATION: {
      MIN: 0,
      MAX: 1,
      STEP: .01
    },
    SHOULDER_PITCH: {
      MIN: 0,
      MAX: 1,
      STEP: .01
    },
    ELBOW_PITCH: {
      MIN: 0,
      MAX: 1,
      STEP: .01
    },
    WRIST_PITCH: {
      MIN: 0,
      MAX: 1,
      STEP: .01
    },
    WRIST_ROTATION: {
      MIN: 0,
      MAX: 1,
      STEP: .01
    }
  }
}

//File used for configurable constants used in the application

import { DRIVE_STATES } from '../utils/driveMath.js';

import homeSVG from '../../public/icons/home.svelte';
import OverviewPage from '../../src/pages/Overview.svelte';
import AutonomousDebugPage from '../../src/pages/AutonomousDebug.svelte';
import TopicDebugPage from '../../src/pages/TopicDebug.svelte';
import ScaleTunerPage from '../../src/pages/ScaleTuner.svelte';

export const MAVRIC_WEB_INTERFACE = "ws://192.168.1.10:9090";


export const CONTROLLER_BINDS = {
  ARM: "ARM",
  DRIVE: "DRIVE",
  getNext: (currentBind) => {
    let keys = Object.keys(CONTROLLER_BINDS);
    let nextIndex = keys.indexOf(currentBind) + 1;
    return keys[nextIndex % (keys.length - 1)];
  }
}

export const PAGES = [
  {
    label: "Overview",
    icon: homeSVG,
    component: OverviewPage
  },
  {
    label: "Autonomous Debug",
    icon: homeSVG,
    component: AutonomousDebugPage
  },
  {
    label: "Topic Debug",
    icon: homeSVG,
    component: TopicDebugPage
  },
  {
    label: "Scale Tuner",
    icon: homeSVG,
    component: ScaleTunerPage
  }
];



export const DEFAULTS = {
  CONTROLLER: {
    BIND: CONTROLLER_BINDS.DRIVE
  },
  DRIVE: {
    DRIVE_STATE: DRIVE_STATES.CAR
  },
  HOME_PAGE: PAGES[0]
}




const TOPIC_BASE = {
  ARM: "/Arm"
}

export const TOPICS = {
  ARM: {
    ARM_MSG_TYPE: "std_msgs/Float64",
    SHOULDER_ROTATION: TOPIC_BASE.ARM + "/ShoulderRot",
    SHOULDER_PITCH: TOPIC_BASE.ARM  + "/ShoulderPitch",
    ELBOW_PITCH: TOPIC_BASE.ARM  + "/ElbowPitch",
    WRIST_PITCH: TOPIC_BASE.ARM  + "/WristPitch",
    WRIST_ROTATION: TOPIC_BASE.ARM + "/WristRot",
  }
}






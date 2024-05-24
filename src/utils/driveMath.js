//This utility helps for calculating drive and steer values to be published to their respective ros topics on the rover.
//Also exports an enum containing drive states

// Variables
const wheel_length = 37.5;
const wheel_width = 28.5;
const max_steer_angle = Math.atan(wheel_length/wheel_width) - 10*Math.PI/180;

//Function to format calcDriveValues return into consistent object
const formatReturn = (lf, lm, lb, rf, rm, rb, strLf, strLb, strRf, strRb) => {
  return {
    lf,
    lm,
    lb,
    rf,
    rm,
    rb,
    strLf,
    strLb,
    strRf,
    strRb
  }
}

//Helper method to convert degrees to radians
const radians = (degrees) => {
  return degrees * (Math.PI / 180);
}


//Helper method to convert radians to degrees
const degrees = (radians) => {
  return radians * (180/Math.PI);
}

//Helper enum of possible drive states
//getNext function used for cycleDriveState
export const DRIVE_STATES = {
  TANK: 'TANK',
  POINT : 'POINT',
  CAR: 'CAR',
  MANUAL: 'MANUAL',

  getNext: (state) => {
    return {
      'CAR': 'POINT',
      'POINT': 'CAR',
    }[state];
  }
}

let FL_v = 0 // Front left angular velocity
let FR_v = 0 // Front right angular velocity
let ML_v = 0 // Mid left angular velocity
let MR_v = 0 // Mid right angular velocity
let BL_v = 0 // Back left angular velocity
let BR_v = 0 // Back right angular velocity
  
let FL_a = 0 // Front left angle
let FR_a = 0 // Front right angle
let BL_a = 0 // Back left angle
let BR_a = 0 // Back right angle

let R = 0 // Turning radius

//Function to convert controller axis ( -1.0 to 1.0 ) and drive state to drive and steer motor values
// t parameter prefix = tank
// c parameter prefix = car
// p parameter prefx = point
// m parameter prefix = manual
// This function was not created new, it was ported from our previous python GUI
export const calculateDriveValues = (DRIVE_STATE, tdrive, tsteer, cdrive, csteer, pdrive, motors, mdrive, msteer, sensdrive, senssteer) => {

    if (DRIVE_STATE == DRIVE_STATES.TANK) {
        
        let left = -100*(tdrive*sensdrive - tsteer*senssteer/2)
        let right = -100*(tdrive*sensdrive + tsteer*senssteer/2)
        return formatReturn(left, left, left, right, right, right, 0, 0, 0, 0);

    } else if (DRIVE_STATE == DRIVE_STATES.CAR) {
      let in_v=0, in_mid_v=0, out_mid_v=0, out_v=0, in_angle=0, out_angle=0;
      if (csteer != 0) {
        let steer_angle = Math.abs(csteer)*max_steer_angle;
        let R = (wheel_length/2)/Math.tan(steer_angle);
        let in_mid_radius = R - wheel_width/2;
        let out_mid_radius = R + wheel_width/2;
        out_angle = Math.atan(wheel_length/2 / out_mid_radius);
        in_angle = Math.atan(wheel_length/2 / in_mid_radius);
        let out_radius = Math.sqrt((wheel_length/2)**2 + out_mid_radius**2);
        let in_radius = Math.sqrt((wheel_length/2)**2 + in_mid_radius**2);

        out_v = -cdrive * 100;
        out_mid_v = -cdrive * out_mid_radius / out_radius * 100;
        in_mid_v = -cdrive * in_mid_radius / out_radius * 100;
        in_v = -cdrive * in_radius / out_radius * 100;
      } 
      
      if (csteer < 0) {
          return formatReturn(in_v*sensdrive, in_mid_v*sensdrive, in_v*sensdrive, out_v*sensdrive, out_mid_v*sensdrive, out_v*sensdrive, -degrees(in_angle), degrees(in_angle), -degrees(out_angle), degrees(out_angle))
      } else if (csteer > 0) {
          return formatReturn(out_v*sensdrive, out_mid_v*sensdrive, out_v*sensdrive, in_v*sensdrive, in_mid_v*sensdrive, in_v*sensdrive, degrees(out_angle), -degrees(out_angle), degrees(in_angle), -degrees(in_angle))
      } else {
          return formatReturn(-cdrive*sensdrive*100, -cdrive*sensdrive*100, -cdrive*sensdrive*100, -cdrive*sensdrive*100, -cdrive*sensdrive*100, -cdrive*sensdrive*100, 0, 0, 0, 0)
      }
    } else if (DRIVE_STATE == DRIVE_STATES.POINT) {
      let str_angle = degrees(Math.atan(wheel_length/wheel_width))
      let str_r = Math.sqrt(Math.pow(wheel_width/2, 2)+Math.pow(wheel_length/2, 2))
      let mid_r = wheel_width/2
      let str_v = Math.abs(pdrive*sensdrive*100)
      let mid_v = str_v*mid_r/str_r
      if (pdrive < 0) {
          return formatReturn(-str_v, -mid_v, -str_v, str_v, mid_v, str_v, str_angle, -str_angle, -str_angle, str_angle)
      } else if (pdrive > 0) {
          return formatReturn(str_v, mid_v, str_v, -str_v, -mid_v, -str_v, str_angle, -str_angle, -str_angle, str_angle)
      } else {
          return formatReturn(0, 0, 0, 0, 0, 0, str_angle, -str_angle, -str_angle, str_angle)
      }
    } else if (DRIVE_STATE == DRIVE_STATES.MANUAL) {
      let m_v = mdrive*sensdrive*100
      let s_v = msteer*senssteer*100
      return formatReturn(-m_v*motors[0], -m_v*motors[1], -m_v*motors[2], -m_v*motors[3], -m_v*motors[4], -m_v*motors[5], s_v*motors[6], s_v*motors[7], s_v*motors[8], s_v*motors[9]);
    } else {
      return formatReturn(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
};
//This utility helps for calculating drive and steer values to be published to their respective ros topics on the rover.
//Also exports an enum containing drive states

// Variables
const wheelbase = 42;
const track = 26.5;
const max_steer_angle = 45;

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
export const calculateDriveValues = (DRIVE_STATE, tdrive, tsteer, cdrive, csteer, psteer, motors, mdrive, msteer, sensdrive, senssteer) => {
    cdrive = cdrive*100
    csteer = csteer*100
    if (DRIVE_STATE == DRIVE_STATES.CAR) {
      if (csteer == 0) {
        FR_a = 0
        FL_a = 0
        FL_v = cdrive
        FR_v = cdrive
        ML_v = cdrive
        MR_v = cdrive
      } else {
        let steer_angle = csteer*radians(max_steer_angle)*0.01
        R = (wheelbase/2)/Math.tan(steer_angle)

        FR_a = degrees(Math.atan((wheelbase/2)/(R-track/2))) 
        FL_a = degrees(Math.atan((wheelbase/2)/(R+track/2))) 

        FL_v = (cdrive*Math.sqrt((wheelbase/2)**2+(R+track/2)**2))/R 
        FR_v = (cdrive*Math.sqrt((wheelbase/2)**2+(R-track/2)**2))/R 
      

      if (csteer < 0) {
        FL_v = -FL_v
        FR_v = -FR_v
      }

      let v_adj = 1

      if (Math.abs(FL_v) > Math.abs(FR_v) && Math.abs(FL_v) > 100) {
        v_adj = Math.abs(FL_v*0.01)
      } else if (Math.abs(FR_v) > Math.abs(FL_v) && Math.abs(FR_v) > 100) {
        v_adj = Math.abs(FR_v*0.01)
      }

      FL_v = FL_v/v_adj
      FR_v = FR_v/v_adj
      ML_v = (cdrive*(R+track/2))/R/v_adj
      MR_v = (cdrive*(R-track/2))/R/v_adj

      }

      BL_a = -FL_a
      BR_a = -FR_a
  
      BL_v = FL_v
      BR_v = FR_v
  
      return formatReturn(FL_v, ML_v, BL_v, FR_v, MR_v, BR_v, FL_a, BL_a, FR_a, BR_a)

      } else if (DRIVE_STATE == DRIVE_STATES.POINT) {
        let outer_pd_R = Math.sqrt((track/2)**2 + (wheelbase/2)**2)
        let inner_pd_R = track/2

        let pd_angle = degrees(Math.atan(outer_pd_R/inner_pd_R))

        let v_adj = inner_pd_R/outer_pd_R

        let FL_v = psteer
        let ML_v = psteer*v_adj
        let BL_v = psteer
        let FR_v = -psteer
        let MR_v = -psteer*v_adj
        let BR_v = -psteer
    
        let FL_a = pd_angle
        let BL_a = -pd_angle
        let FR_a = -pd_angle
        let BR_a = pd_angle
    
        return formatReturn(FL_v, ML_v, BL_v, FR_v, MR_v, BR_v, FL_a, BL_a, FR_a, BR_a)
      }
};
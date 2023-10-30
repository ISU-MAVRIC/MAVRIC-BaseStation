//This utility helps for calculating drive and steer values to be published to their respective ros topics on the rover.
//Also exports an enum containing drive states

const wheel_length = 37.5;
const wheel_width = 28.5;

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
      'TANK': 'POINT',
      'POINT': 'CAR',
      'CAR': 'TANK'
    }[state];
  }
}

//Function to convert controller axis ( -1.0 to 1.0 ) and drive state to drive and steer motor values
// t parameter prefix = tank
// c parameter prefix = car
// p parameter prefx = point
// m parameter prefix = manual
export const calculateDriveValues = (DRIVE_STATE, tdrive, tsteer, cdrive, csteer, pdrive, motors, mdrive, msteer, sensdrive, senssteer) => {

    if (DRIVE_STATE == DRIVE_STATES.TANK) {
        
        let left = -100*(tdrive*sensdrive - tsteer*senssteer/2)
        let right = -100*(tdrive*sensdrive + tsteer*senssteer/2)
        return formatReturn(left, left, left, right, right, right, 0, 0, 0, 0);
    } else if (DRIVE_STATE == DRIVE_STATES.CAR) {
        let in_angle = radians(Math.abs(csteer*100*senssteer))*0.9;
        let out_angle, in_r, out_r, center_r, in_mid_r, out_mid_r, out_v, angle_v, in_v, in_mid_v, out_mid_v;
        if (in_angle != 0) {
          out_angle = Math.PI/2-Math.atan(1/Math.tan(in_angle)+2*wheel_width/wheel_length)
          in_r = wheel_length / (2 * Math.sin(in_angle))
          out_r = wheel_length / (2 * Math.sin(out_angle))
          center_r = in_r * Math.cos(in_angle) + wheel_width / 2
          in_mid_r = center_r - wheel_width / 2
          out_mid_r = center_r + wheel_width / 2
          out_v = -100*cdrive * sensdrive
          angle_v = out_v / out_r
          in_v = in_r * angle_v
          in_mid_v = in_mid_r * angle_v
          out_mid_v = out_mid_r * angle_v
        } else {
          out_angle = 0
          in_v = 0
          in_mid_v = 0
          out_v = 0
          out_mid_v = 0
        }
        if (csteer < 0) {
            return formatReturn(in_v, in_mid_v, in_v, out_v, out_mid_v, out_v, degrees(in_angle), degrees(in_angle), degrees(out_angle), degrees(out_angle))
        } else if (csteer > 0) {
            return formatReturn(out_v, out_mid_v, out_v, in_v, in_mid_v, in_v, -degrees(out_angle), -degrees(out_angle), -degrees(in_angle), -degrees(in_angle))
        } else {
            return formatReturn(-cdrive*sensdrive*100, -cdrive*sensdrive*100, -cdrive*sensdrive*100, -cdrive*sensdrive*100,  -cdrive*sensdrive*100, -cdrive*sensdrive*100, 0, 0, 0, 0)
        }
    } else if (DRIVE_STATE == DRIVE_STATES.POINT) {
        let str_angle = degrees(Math.atan(wheel_length/wheel_width))
        let str_r = Math.sqrt(Math.pow(wheel_width/2, 2)+Math.pow(wheel_length/2, 2))
        let mid_r = wheel_width/2
        let str_v = Math.abs(pdrive*sensdrive*100)
        let mid_v = str_v*mid_r/str_r
        if (pdrive < 0) {
            return formatReturn(-str_v, -mid_v, -str_v, str_v, mid_v, str_v, -str_angle, -str_angle, str_angle, str_angle)
        } else if (pdrive > 0) {
            return formatReturn(str_v, mid_v, str_v, -str_v, -mid_v, -str_v, -str_angle, -str_angle, str_angle, str_angle)
        } else {
            return formatReturn(0, 0, 0, 0, 0, 0, -str_angle, -str_angle, str_angle, str_angle)
        }
    } else if (DRIVE_STATE == DRIVE_STATES.MANUAL) {
      let m_v = mdrive*sensdrive*100
      let s_v = msteer*senssteer*100
      return formatReturn(-m_v*motors[0], -m_v*motors[1], -m_v*motors[2], -m_v*motors[3], -m_v*motors[4], -m_v*motors[5], s_v*motors[6], s_v*motors[7], s_v*motors[8], s_v*motors[9]);
    } else {
      return formatReturn(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
};

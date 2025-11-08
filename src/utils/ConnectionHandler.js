//Library Imports
import ROSLIB from 'roslib';


/**
 * This class is a wrapper for handling our connecting to the rover through rosbridge_server and roslibjs
 */
class ConnectionHandler  {


  constructor(WEB_INTERFACE_URL) {
    this.ros = new ROSLIB.Ros({encoding: 'ascii'});
    this.ros.connect(WEB_INTERFACE_URL)


    this.ros.on('error', function (error) {
      console.log(error)
    })

    this.ros.on('connection', function () {
      console.log("connected")
      
    })

    this.ros.on('close', function () {
      console.log('Connection closed')
    })

  }
  

  getROSInstance = () => {
    return this.ros;
  }




}

export default ConnectionHandler;
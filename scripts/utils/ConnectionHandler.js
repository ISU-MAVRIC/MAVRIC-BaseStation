import ROSLIB from 'roslib';


// TODO: Add comments for connection Handler wrapper

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
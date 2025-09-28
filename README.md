# Node.js ROSBridge Container

## Start up
The container will automatically run `npm install` at start up. To run the program, type `node src/index/js` or just:

```bash
node .
```

## Docker Networking setup
To avoid using a more complicated Docker compose setup, in your `.devcontainer.json` file, make sure Docker is running its network in `host` mode, by adding this to you `.devcontainer.json` file:

```Docker
  "runArgs": [
        "--network=host"
  ],
```
Ensure this is added in this container, as well as your ROS 2 container too, see [this](https://github.com/ISU-MAVRIC/MAVRIC_Systems/blob/CySar-steering-andrew/.devcontainer/ROS%20Foxy%20Dev%20Config/devcontainer.json) for an example.

## Adding ROSBridge to your ROS program
In the launch file of you ROS program, add the node:
```xml
<node name="rosbridge_websocket" pkg="rosbridge_server" exec="rosbridge_websocket">
    <param name="port" value="9090" />
</node>
```
This isn't an actual ROS node you implement, it will work as long as you have ROSBridge suite installed, which you should automatically have if your using our ROS 2 dev container. See [this](https://github.com/ISU-MAVRIC/MAVRIC_Systems/blob/CySar-steering-andrew/CyTemp/cysar/launch/teleop.launch) for an example.

## Changing the ROSBridge URL
This shouldn't be needed, as we're running ROSBridge on localhost, port 9090 by default. To modify is open `config.js` in the `src` folder.


## Running the Full Program
First, open your ROS application and run it with:
```bash
cd /workspaces/MAVRIC_Systems/Cytemp && \
colcon build && \
source install/setup.bash && \
ros2 launch cysar/launch/teleop.launch
```

Now open a new terminal to listen to the ROS messages that will be published.
```bash
cd /workspaces/MAVRIC_Systems/Cytemp && \
source install/setup.bash && \
ros2 topic echo /drive_train
```

Now here, in your node application, run
```bash
node .
```
You should see the ROS messages being published in the terminal you made just before this.


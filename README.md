# MAVRIC Base Station

## Basic setup

Install ```NodeJS v18.18.2 LTS``` and ```yarn``` with the method according to your OS

Clone this repository:
```bash:
git clone https://github.com/ISU-MAVRIC/MAVRIC-BaseStation
```

Navigate into directory

Install all yarn packages:
```bash:
yarn
```

The development environment is now ready to be used.

## Run development environment
```bash:
yarn electron-dev
```


## Raspberry Pi Setup

### Quick Setup
Run these: 

```bash:
bash raspi-scripts/nodejs_setup.bash
bash raspi-scripts/fuse_setup.bash
```

Follow [Basic Setup](#basic-setup), skipping the nodejs step

### Script Details

Two scripts are provided for raspberry pi in [raspi-scripts](https://github.com/ISU-MAVRIC/MAVRIC-BaseStation/tree/main/raspi-scripts).

[nodejs_setup.bash](https://github.com/ISU-MAVRIC/MAVRIC-BaseStation/blob/main/raspi-scripts/nodejs_setup.bash): This script will automatically setup nodejs and npm on a raspberry pi.

[fuse_setup.bash](https://github.com/ISU-MAVRIC/MAVRIC-BaseStation/blob/main/raspi-scripts/fuse_setup.bash): This script will setup fuse, which is required to launch AppImages.

[nodejs_uninstall.bash](https://github.com/ISU-MAVRIC/MAVRIC-BaseStation/blob/main/raspi-scripts/nodejs_uninstall.bash): This script will uninstall and clean up any changes made by [nodejs_setup.bash](https://github.com/ISU-MAVRIC/MAVRIC-BaseStation/blob/main/raspi-scripts/nodejs_setup.bash).


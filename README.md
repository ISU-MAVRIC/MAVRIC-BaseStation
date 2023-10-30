# MAVRIC Base Station

## Table of Contents
- [Useful Documentation](#useful-documentation)
- [Basic Setup](#basic-setup)
- [Development Environment](#run-development-environment)
- [Raspberry Pi Setup](#raspberry-pi-setup)
- [Basic Project Structure](#basic-project-structure)
- [Basic GUI Layout](#basic-gui-layout)


## Useful Documentation
- [Svelte Documentation](https://svelte.dev/docs/introduction)
- [Basic Yarn Usage](https://classic.yarnpkg.com/en/docs/usage)
- [Javascript Arrow Functions](https://www.w3schools.com/js/js_arrow_function.asp)
- [Electron Documentation](https://www.electronjs.org/docs/latest)
- [Electron Builder Documentation](https://www.electron.build/)


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


## Basic Project Structure
```.
├── README.md 
├── main.js
├── dist
├── docs
├── node_modules
├── package.json
├── preload.js
├── public
├── raspi-scripts
├── rollup.config.js
├── scripts
│   └── utils
└── src
    ├── components
    ├── main.js
    ├── pages
    └── stores

```
### main.js
This file contains the basic setup for the electron app. This code is mostly boilerplate from the electron docs on setting up a basic electron app. Some options in this file include the app icon, minimum window height, maximum window height, etc.

### dist folder
This folder is generated after you run ```yarn electron-pack``` and contains the installer built after running the yarn command. This folder is in the .gitignore so we don't commit installers to the GitHub Repository. 

### docs folder
This folder is used for storing images used in this documentation.

### node_modules
This folder is downloaded after you run ```yarn``` to install all needed dependancies and libraries. This folder is in the .gitignore so we don't push all of our libraries and dependencies to our GitHub Repository. 

### package.json
This file is where we define our yarn project. This contains things like the project name, version, description, distribution license, main electron javascript file (main.js), build configuration, yarn scripts (like yarn electron-pack), and dependencies (application and development dependencies).

### preload.js
This file is a javascript file that is run before the web page is loaded into the electron window. Currently, we do not do anything important in this file, just printing to console that it ran.

### public
This folder is used for storing static files we want to serve. Common examples include icons and images. The build subdirectory is generated when we build our web page and dont not need to be manually changed.

### raspi-scripts
This folder contains scripts needed for setup and building the electron app on a Raspberry Pi 4. See [Raspberry Pi Setup](#raspberry-pi-setup)


### rollup.config.js
This file handles the configuration for the rollup development dependancy. This handles setting up live reload, building the web page bundle with our needed dependancies, and other settings for compiling our web page.

### scripts
Currently unused

### src
This folder contains the main svelte and javascript code for our GUI implementation. The utils folder contains useful helper functions/classes that we have created. For example, mapRange exports a function that takes a value and maps it between two vector spaces. The component folder contains svelte components that we have created and can be reused. For example, the CommonDisplay component is used to display telemetry and other data on all pages. The main.js file sets up our basic svelte web page, importing the App.svelte component. The pages directory contains the main component for each page, as well as the top level header, navbar, and display area. The stores directory contains svelte stores for sharing data between components without prop drilling.


## Basic GUI Layout

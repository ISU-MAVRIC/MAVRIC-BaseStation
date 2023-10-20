#!/bin/bash

# This script will install and setup fuse, which is required to run AppPackages

echo "installing fuse for AppPackage"
suod apt-get install fuse libfuse2
sudo addgroup fuse
sudo adduser $USER fuse
sudo modprobe -v fuse

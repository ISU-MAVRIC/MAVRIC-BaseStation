#!/bin/bash

# For whatever reason if you need to uninstall nodejs and remove all the custom keyrings,
# run this script
sudo apt-get purge nodejs npm
sudo rm -r /etc/apt/sources.list.d/nodesource.list
sudo rm -r /etc/apt/keyrings/nodesource.gpg
sudo apt-get autoremove
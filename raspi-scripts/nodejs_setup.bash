#!/bin/bash

# nodejs install script
# This script covers a lot of the wierd parts of our specific nodeJS version the base station uses
# In order for nodejs to work properly, npm has to be installed, which includes nodejs.
# We then select the nodejs we want with that version's keyring and "update" it by installing it again
# This seems to give us the versions of software we want, 
# plus this script will also auto update npm and nodejs with the current lts versions

echo "Updating apt repository"
sudo apt-get update

echo "Installing dependencies and NPM"
sudo apt-get install -y ca-certificates curl gnupg npm

echo "adding nodesource 18 to keyring"
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=18
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

echo "installing nodejs"
sudo apt-get update
sudo apt-get install -y nodejs 
echo "cleaning unused nodejs packages"
sudo apt autoremove -y

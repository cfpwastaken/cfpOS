#!/bin/bash
sudo apt update -y
sudo apt install git node npm -y
sudo git clone https://github.com/cfpwastaken/cfpos /CfpOS
cd /CfpOS/cfpOS
sudo npm install
echo ""
echo ""
echo "CfpOS is now installed"
echo "Run it using 'npx electron .' in /CfpOS/cfpOS in your terminal"
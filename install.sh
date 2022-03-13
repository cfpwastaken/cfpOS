#!/bin/bash
sudo apt update -y
sudo apt install git -y
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm install node

sudo git clone https://github.com/cfpwastaken/cfpos /CfpOS
cd /CfpOS/cfpOS
sudo npm install
echo ""
echo ""
echo "CfpOS is now installed"
echo "Run it using 'npx electron .' in /CfpOS/cfpOS in your terminal"
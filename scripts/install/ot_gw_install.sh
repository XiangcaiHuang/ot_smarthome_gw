#!/bin/bash
BOOT_SYS_FILE=/etc/rc.local


echo -e "\nNodejs installing..."
#curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
#sudo apt install nodejs
cd ${HOME}
if [ ! -d "/usr/local/node/" ];then
	wget https://nodejs.org/dist/latest-v7.x/node-v7.10.1-linux-armv7l.tar.gz
	tar -xvf node-v7.10.1-linux-armv7l.tar.gz
	sudo mv node-v7.10.1-linux-armv7l /usr/local/node
	sudo rm node-v7.10.1-linux-armv7l.tar.gz
else
	echo "node installed!"
fi
echo PATH=$PATH:/usr/local/node/bin >> ~/.bashrc
source .bashrc
sudo ln -s /usr/local/node/bin/node /usr/bin/node
sudo ln -s /usr/local/node/bin/npm /usr/bin/npm
echo "Nodejs installed! The vesion is: "
node -v
npm -v

cd ${HOME}/ot_smarthome_gw/gateway/
sudo npm install


echo -e "\nOpenThread Smarthome Gateway installing..."

echo -e "\nwpantund downloading..."
cd ${HOME}
if [ ! -d "${HOME}/wpantund/" ];then
	sudo git clone --recursive https://github.com/openthread/wpantund.git
else
	echo "wpantund existed!"
fi
echo "wpantund download finished!"

echo "python-software-properties installing..."
sudo apt-get install -y python-software-properties
sudo add-apt-repository -y ppa:terry.guo/gcc-arm-embedded
sudo apt-get update -qq

echo "packages needed for wpantund build and runtime installing..."
sudo apt-get install -y build-essential git make autoconf autoconf-archive automake dbus libtool gcc g++ gperf flex bison texinfo ncurses-dev libexpat-dev python sed python-pip gawk libreadline6-dev libreadline6 libdbus-1-dev libboost-dev
sudo apt-get install -y --force-yes gcc-arm-none-eabi
sudo pip install pexpect

echo "wpantund installing..."
cd ${HOME}/wpantund
sudo git checkout full/latest-release
sudo ./configure --sysconfdir=/etc
sudo make
sudo make install
echo "wpantund installed! The version is: "
wpantund -v
wpanctl -v

echo -e "\nEnvironments setup starting..."
sudo chmod -R 777  ${HOME}/ot_smarthome_gw/scripts
sudo chmod 777 ${BOOT_SYS_FILE}
sudo sed -i "/ot_gw_startup/d" ${BOOT_SYS_FILE}
sudo sed -i "/fi/a ${HOME}/ot_smarthome_gw/scripts/startup/ot_gw_startup.sh >> ${HOME}/ot_smarthome_gw/debug"  ${BOOT_SYS_FILE}
echo "Environments setuped!"

echo -e "\nOpenThread Smarthome Gateway installed!"

echo -e "\nReboot Raspi now..."
sudo reboot
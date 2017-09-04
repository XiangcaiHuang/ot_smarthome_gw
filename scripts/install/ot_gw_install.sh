#!/bin/bash
USER_ROOT=/home/pi
BOOT_SYS_FILE=/etc/rc.local


echo -e "\nNodejs installing..."
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt install nodejs
echo "Nodejs installed! The vesion is: "
nodejs -v


echo -e "\nOpenThread Smarthome Gateway installing..."

echo -e "\nwpantund downloading..."
cd ${USER_ROOT}
sudo git clone --recursive https://github.com/openthread/wpantund.git
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
cd ${USER_ROOT}/wpantund
sudo git checkout full/latest-release
./configure --sysconfdir=/etc
make
sudo make install
echo "wpantund installed! The version is: "
wpantund -v
wpanctl -v

echo -e "\nEnvironments setup starting..."
sudo chmod -R 777  ${USER_ROOT}/ot_smarthome_gw/scripts
sudo chmod 777 ${BOOT_SYS_FILE}
sudo sed -i "/fi/a ${USER_ROOT}/ot_smarthome_gw/scripts/startup/ot_gw_startup.sh >> ${USER_ROOT}/ot_smarthome_gw/debug"  ${BOOT_SYS_FILE}
echo "Environments setuped!"

echo -e "\nOpenThread Smarthome Gateway installed!"

echo -e "\nReboot Raspi now..."
sudo reboot
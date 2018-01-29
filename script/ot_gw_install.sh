#!/bin/bash
. ./_config

nodejs_install()
{
	echo -e "\nNodejs installing..."
	cd $HOME_PATH
	if [ ! -d "/usr/local/node/" ];then
		test -d "node-v7.10.1-linux-armv7l" || {
			test -f "node-v7.10.1-linux-armv7l.tar.gz" || {
				echo -e "\nNodejs downloading..."

				# Download nodejs installing files
				wget https://nodejs.org/dist/latest-v7.x/node-v7.10.1-linux-armv7l.tar.gz
			}
			# Unzip files
			tar -xvf node-v7.10.1-linux-armv7l.tar.gz
		}
		# Move unzip-files to /usr/local
		sudo mv node-v7.10.1-linux-armv7l /usr/local/node

		# Crete soft link for nodejs
		echo PATH=$PATH:/usr/local/node/bin >> ~/.bashrc
		source .bashrc
		sudo ln -s /usr/local/node/bin/node /usr/bin/node
		sudo ln -s /usr/local/node/bin/npm /usr/bin/npm

		echo "Nodejs installed! The vesion is: "
		node -v
		npm -v
	else
		echo "node installed!"
	fi
}

gateway_packs_install()
{
	cd $HOME_PATH/ot_smarthome_gw/gateway
	test -d node_modules || {
		sudo npm install
	}
}

wpantund_install()
{
	echo "python-software-properties installing..."
	sudo apt-get install -y python-software-properties
	sudo add-apt-repository -y ppa:terry.guo/gcc-arm-embedded
	sudo apt-get update -qq

	echo "packages needed for wpantund build and runtime installing..."
	sudo apt-get install -y build-essential git make autoconf autoconf-archive automake dbus libtool gcc g++ gperf flex bison texinfo ncurses-dev libexpat-dev python sed python-pip gawk libreadline6-dev libreadline6 libdbus-1-dev libboost-dev
	sudo apt-get install -y --force-yes gcc-arm-none-eabi
	sudo pip install pexpect

	echo -e "\nwpantund downloading..."
	cd $HOME_PATH
	if [ ! -d "$HOME_PATH/wpantund/" ];then
		sudo git clone --recursive https://github.com/openthread/wpantund.git
	else
		echo "wpantund downloaded!"
	fi

	echo "wpantund installing..."
	cd $HOME_PATH/wpantund
	sudo git checkout full/latest-release
	sudo ./configure --sysconfdir=/etc
	sudo make
	sudo make install

	echo "wpantund installed! The version is: "
	wpantund -v
	wpanctl -v
}

gateway_env_setup()
{
	echo -e "\nEnvironments setup starting..."

	sudo chmod -R 777  $HOME_PATH/ot_smarthome_gw/scripts
	sudo chmod 777 ${BOOT_SYS_FILE}

	# Delete the line which includes "ot_gw_startup" from the boot file
	sudo sed -i "/ot_gw_startup/d" ${BOOT_SYS_FILE}
	# Insert one line into the boot file
	sudo sed -i "/fi/a $HOME_PATH/ot_smarthome_gw/scripts/ot_gw_startup.sh >> $HOME_PATH/ot_smarthome_gw/boot_info"  ${BOOT_SYS_FILE}

	echo "Environments setuped!"
}


main()
{
	nodejs_install
	gateway_packs_install
	wpantund_install
	gateway_env_setup

	echo -e "\nOpenThread Smarthome Gateway installed!"
	echo -e "\nReboot Raspi please"
}

main
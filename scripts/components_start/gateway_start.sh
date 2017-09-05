#!/bin/bash

echo -e "\ngateway starting..."
echo "Enter commands on the CLI, like:
	show
	send  : send f lock_sta 0/1
	reset
"

cd ${HOME}/ot_smarthome_gw/gateway
sudo nodejs ./gateway.js

echo -e "\ngateway exited!"

#!/bin/bash
ot_gw_file_path=/home/pi/ot_smarthome_gw

echo -e "\ngateway starting..."
echo "Enter commands on the CLI, like:
	show
	send  : send f lock_sta 0/1
	reset
"

cd ${ot_gw_file_path}/gateway
sudo nodejs ./gateway.js

echo -e "\ngateway exited!"

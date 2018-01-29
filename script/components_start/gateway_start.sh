#!/bin/bash

HOME_PATH="/home/pi"

print_help_info()
{
	echo -e "\ngateway starting..."
	echo "Enter commands on the CLI, like:
		list: l
		send: s  ln lamp 0/1
		reset: r
		exit: q
	"
}

gateway_start()
{
	cd ${HOME_PATH}/ot_smarthome_gw/gateway
	sudo node ./gateway.js
}

main()
{
	print_help_info
	gateway_start

	echo -e "\ngateway exit!"
}

main

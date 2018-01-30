#!/bin/bash
. ./_config
. ./_gateway
. ./_wpantund

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
#!/bin/bash
. ./_config
. ./_gateway
. ./_wpantund
. ./_wpanctl

main()
{
	echo -e "\nOpenThread Smarthome Gateway Starting..."

	# start wpantund as a deamon
	wpantund_start_background
	sleep 3s

	# start wpanctl to join the Thread network
	# wpanctl_start_emsk_join_network
	# wpanctl_start_k64_nrf52840_join_network
	wpanctl_start_create_or_join_network

	# start openthread gateway
	gateway_start_background

	echo -e "\nOpenThread Smarthome Gateway stoped!"
}

main
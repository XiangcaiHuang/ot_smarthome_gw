#!/bin/bash
. ../_wpanctl

print_help_info()
{
	echo "Enter commands on the CLI, like:
		reset
		scan
		set Network:Key --data 00112233445566778899aabbccddeeff
		join 1

		status
		leave
		quit
	"
}

main()
{
	echo -e "\nwpanctl starting..."
	# print_help_info

	# wpanctl_start_ctl
	# wpanctl_start_emsk_join_network
	# wpanctl_start_k64_nrf52840_join_network
	wpanctl_start_create_or_join_network
}

main
#!/bin/bash

print_help_info()
{
	echo -e "\nwpanctl starting..."
	echo "Enter commands on the CLI, like:
		scan
		set Network:Key --data 00112233445566778899aabbccddeeff
		join 1

		status
		leave
		quit
	"
}

wpanctl_start()
{
	sudo /usr/local/bin/wpanctl<<<"
	scan
	set Network:Key --data 00112233445566778899aabbccddeeff
	join 1
	" -I utun6
}

main()
{
	print_help_info
	#wpanctl_start
	sudo /usr/local/bin/wpanctl -I utun6

	echo -e "\nwpanctl exit!"
}

main




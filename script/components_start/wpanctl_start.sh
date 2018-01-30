#!/bin/bash
. ../_wpanctl

print_help_info()
{
	echo -e "\nwpanctl starting..."
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
	print_help_info

	# wpanctl_start_ctl
	wpanctl_start_emsk
	# wpanctl_start_k64_nrf52840
}

main

# Normal output information:
# wpanctl starting...
# Enter commands on the CLI, like:
# 		reset
# 		scan
# 		set Network:Key --data 00112233445566778899aabbccddeeff
# 		join 1

# 		status
# 		leave
# 		quit
	
#    | Joinable | NetworkName        | PAN ID | Ch | XPanID           | HWAddr           | RSSI
# ---+----------+--------------------+--------+----+------------------+------------------+------
#  1 |       NO | "OpenThread"       | 0x1234 | 11 | DEAD00BEEF00CAFE | F26544EBEF9F57C8 |  -42
# Joining "OpenThread" DEAD00BEEF00CAFE as node type "end-device"
# Successfully Joined!
# ../_wpanctl: line 4:  2331 Segmentation fault      sudo /usr/local/bin/wpanctl -I utun6 <<< "
# 	scan
# 	set Network:Key --data 00112233445566778899aabbccddeeff
# 	join 1
# 	"
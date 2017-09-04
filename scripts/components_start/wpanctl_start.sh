#!/bin/bash
echo -e "\nwpanctl starting..."
echo "Enter commands on the CLI, like:
	scan
	set Network:Key --data 00112233445566778899aabbccddeeff
	join 1

	status
	leave
	quit
"

sudo /usr/local/bin/wpanctl<<<"
scan
set Network:Key --data 00112233445566778899aabbccddeeff
join 1
" -I utun6

echo -e "\nwpanctl exited!"

#!/bin/bash
. ../_config
. ../_gateway

print_help_info()
{
	echo -e "\ngateway starting..."
	echo "Enter commands on the CLI, like:
		list:  l
		send:  s  ln lamp 0/1
		reset: r
		exit:  q
	"
}

main()
{
	print_help_info
	gateway_start_forward
}

main

# Normal output information:
# gateway starting...
# Enter commands on the CLI, like:
# 		list:  l
# 		send:  s  ln lamp 0/1
# 		reset: r
# 		exit:  q
	
# iBaby-Robot Gateway starting:

# Http : Listening at port 8080
# GW> Coap: Listening at port: 5683

# Websocket : Listening at port 3001
# GW>
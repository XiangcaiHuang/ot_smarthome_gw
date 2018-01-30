#!/bin/bash
. ./_config

wpantund_start()
{
	echo -e "\nwpantund starting..."
	sudo /usr/local/sbin/wpantund -o Config:NCP:SocketPath "${SOCKET_PATH}" -o Daemon:SyslogMask " -info" -o Config:TUN:InterfaceName utun6 &
	echo "wpantund started!"
}

wpanctl_start()
{
	echo -e "\nwpanctl starting..."
	sudo /usr/local/bin/wpanctl<<<"
	scan
	set Network:Key --data 00112233445566778899aabbccddeeff
	join 1
	" -I utun6
	echo "wpanctl exited!"
}

gateway_start()
{
	echo -e "\ngateway starting..."
	cd ${HOME_PATH}/ot_smarthome_gw/gateway
	sudo node ./gateway.js &
	echo "gateway started!"
}

main()
{
	echo -e "\nOpenThread Smarthome Gateway Starting..."

	wpantund_start
	sleep 5s
	wpanctl_start
	sleep 5s
	gateway_start
	sleep 5s

	echo -e "\nOpenThread Smarthome Gateway Started!"
}

main
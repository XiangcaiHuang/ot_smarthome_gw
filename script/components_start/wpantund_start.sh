#!/bin/bash

SOCKET_PATH="/dev/ttyACM0"

wpantund_start()
{
	sudo /usr/local/sbin/wpantund -o Config:NCP:SocketPath "${SOCKET_PATH}" -o Daemon:SyslogMask " -info" -o Config:TUN:InterfaceName utun6
	#sudo /usr/local/sbin/wpantund -o Config:NCP:SocketPath "${SOCKET_PATH}" -o Daemon:SyslogMask " -info" -o Config:TUN:InterfaceName utun6 &
}

main()
{
	echo -e "\nwpantund starting..."

	wpantund_start

	echo -e "\nwpantund exit!"
}

main
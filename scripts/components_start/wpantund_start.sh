#!/bin/bash
SOCKET_PATH=/dev/ttyUSB1
echo -e "\nwpantund starting..."

sudo /usr/local/sbin/wpantund -o Config:NCP:SocketPath "${SOCKET_PATH}" -o Daemon:SyslogMask " -info" -o Config:TUN:InterfaceName utun6 &

echo -e "\nwpantund started!"
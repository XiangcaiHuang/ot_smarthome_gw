#!/bin/bash
echo -e "\nwpantund starting..."

sudo /usr/local/sbin/wpantund -o Config:NCP:SocketPath "/dev/ttyUSB1" -o Daemon:SyslogMask " -info" -o Config:TUN:InterfaceName utun6 &

echo -e "\nwpantund started!"
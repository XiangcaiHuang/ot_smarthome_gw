#!/bin/bash
USER_ROOT=/home/pi
SOCKET_PATH=/dev/ttyUSB1

echo -e "\nOpenThread Smarthome Gateway Starting..."

echo -e "\nwpantund starting..."
sudo /usr/local/sbin/wpantund -o Config:NCP:SocketPath "${SOCKET_PATH}" -o Daemon:SyslogMask " -info" -o Config:TUN:InterfaceName utun6 &
echo "wpantund started!"
sleep 5s

echo -e "\nwpanctl starting..."
sudo /usr/local/bin/wpanctl<<<"
scan
set Network:Key --data 00112233445566778899aabbccddeeff
join 1
" -I utun6
echo "wpanctl exited!"
sleep 5s

echo -e "\ngateway starting..."
cd ${USER_ROOT}/ot_smarthome_gw/gateway
sudo nodejs ./gateway.js &
echo "gateway started!"
sleep 5s

echo -e "\nOpenThread Smarthome Gateway Started!"

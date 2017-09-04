#!/bin/bash
ot_gw_file_path=/home/pi/ot_smarthome_gw

echo -e "\nOpenThread Smarthome Gateway Starting..."

echo -e "\nwpantund starting..."
sudo /usr/local/sbin/wpantund -o Config:NCP:SocketPath "/dev/ttyUSB1" -o Daemon:SyslogMask " -info" -o Config:TUN:InterfaceName utun6 &
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
cd ${ot_gw_file_path}/gateway
sudo nodejs ./gateway.js &
echo "gateway started!"
sleep 5s

echo -e "\nOpenThread Smarthome Gateway Started!"

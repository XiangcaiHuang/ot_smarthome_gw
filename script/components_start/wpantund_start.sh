#!/bin/bash
. ../_config
. ../_wpantund

main()
{
	echo -e "\nwpantund starting..."

	wpantund_start_forward
	# wpantund_start_background
}

main

# Normal output information:
# wpantund starting...
# wpantund[2255]: Starting wpantund 0.07.01 (Jan 29 2018 09:09:02) . . .
# wpantund[2255]: 	SOURCE_VERSION = 0.07.01
# wpantund[2255]: 	BUILD_VERSION = 0.07.01-2-g6993264
# wpantund[2255]: Reading configuration from "/etc/wpantund.conf" . . .
# wpantund[2255]: Configuration file "/etc/wpantund.conf" read.
# wpantund[2255]: set-config-param: "Config:NCP:SocketPath" = "/dev/ttyUSB1"
# wpantund[2255]: set-config-param: "Config:TUN:InterfaceName" = "utun6"
# wpantund[2255]: set-config-param: "Daemon:SyslogMask" = " -info"
# wpantund[2255]: Ready. Using DBUS bus ":1.60"
# wpantund[2255]: Running as root without dropping privileges!
# wpantund[2255]: State change: "uninitialized" -> "offline"
# wpantund[2255]: NCP is running "OPENTHREAD/0.01.00; Windows; Dec  7 2017 14:34:23"
# wpantund[2255]: Driver is running "0.07.01 (0.07.01-2-g6993264; Jan 29 2018 09:09:02)"
# wpantund[2255]: Network is not joinable
# wpantund[2255]: Resetting interface(s). . .
# wpantund[2255]: Finished initializing NCP
# wpantund[2255]: AutoResume is enabled. Trying to resume.
# wpantund[2255]: NCP is NOT commissioned. Cannot resume.
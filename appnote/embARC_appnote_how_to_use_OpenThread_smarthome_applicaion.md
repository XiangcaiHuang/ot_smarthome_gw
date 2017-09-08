# How to Use OpenThread Smarthome Application

* [Overview](#overview)
* [Hardware and Software Setup](#hardware-and-software-setup)
	* [Required Hardware](#required-hardware)
	* [Required Software](#required-software)
	* [Hardware Connection](#hardware-connection)
* [User Manual](#user-manual)
	* [Make Boot File for Thread Nodes](#make-boot-file-for-thread-nodes)
	* [Install OS on the Raspi](#install-os-on-the-raspi)
	* [Setup Remote Control of the Raspi](#setup-remote-control-of-the-raspi)
	* [Install Gateway](#install-gateway)
	* [Run This Application](#run-this-application)
	* [Interaction](#interaction)

## Overview
This document is written for instructing the users to learn how to use the embARC OpenThread Smarthome Application.

## Hardware and Software Setup

### Required Hardware
- 3 x [DesignWare ARC EM Starter Kit(EMSK)][1]
- 3 x [Digilent PMOD RF2 (MRF24J40)][2]
- 1 x [Digilent PMOD TMP2][3]
- 1 x [Raspberry Pi 3][4]
- 1 x SD card Reader
- 4 x SD card (one for Raspi)
- 1 x microUSB-USB cable (connect NCP with the Raspi)
- 1 x Ethernet cable (connect Raspi with the PC host)

### Required Software
- Metaware or ARC GNU Toolset
- Serial port terminal, using Tera-Term here
- [Win32 Disk Imager][12]
- [SD Card Formatter][13]
- [OpenThread Smarthome Gateway][5]
- [embARC OpenThread NCP example][6]
- [embARC OpenThread Smarthome Multinode Application][7]

### Hardware Connection

![hardware_connection][30]

1. EMSK 1 implement **FrontDoor** node.
	- Connect **PMOD RF2 (MRF24J40)** to **J6**.

2. EMSK 2 implement **LivingRoom** node.
	- Connect **PMOD RF2 (MRF24J40)** to **J6**.
	- Connect **PMOD TMP2** to **J2**.

3. EMSK 3 implement **NCP**.
	- Connect **PMOD RF2 (MRF24J40)** to **J6**.
	- Connect with the Raspberry Pi 3 (Gateway) via microUSB-USB cable.

4. Raspi implement **Gateway**.
	- Connect with the NCP via microUSB-USB cable.
	- Connect with the PC host via Ethernet cable.

5. Insert SD Card to EMSKs, make sure Bit 4 of the onboard DIP switch is ON to enable the secondary bootloader.

6. Configure your EMSKs with proper core configuration (**EMSK2.3 - ARC EM7D**).

## User Manual
### Make Boot File for Thread Nodes
Here take **EMSK2.3 - ARC EM7D** with GNU Toolset for this application.

- Program the secondary bootloader application into onboard SPI flash of EMSK.
- Generate boot.bin of the **frontDoor** Node, **livingRoom** Node and **NCP** using "make bin".
- Insert SD Card back to the EMSKs. Press the reset button to reboot it. Wait for loading boot.bin from SD card.
- See [embARC OSP **Bootloader** example][8] for more information.

> Notice:
> 
> 　**Before making boot.bin for NCP**, it is necessary to modify the source file in [embARC OpenThread NCP example' main.c][9] as the following shows:
> 
> 		149    PlatformInit(argc, argv, NUM_NCP);
>
> 　It is for generating pseudo random number for OpenThread automatically.

### Install OS on the Raspi
1. Download the recent [Raspbian Stretch Lite][10], and get the img files, using *2017-07-05-raspbian-jessie-lite.img* here.

2. Insert the SD card (recommended for more than 8G) of Raspi to *SD card Reader*. Format it using *SD Card Formatter*.

	![format_sd_card][31]

3. Making a start card for Raspi using *Win32 Disk Imager*. Choose the img file, like  *2017-07-05-raspbian-jessie-lite.img* here. Then Click *Write* to make a start card.

	![make_start_card][32]

### Setup Remote Control of the Raspi
1. Insert the SD card of Raspi to *SD card Reader*. Create a file with name "**ssh**" in boot partition.

	![create_ssh_file][33]

2. Insert the SD card to the Raspi. Connect Raspi with the PC host via Ethernet cable, power the Raspi.

3. Connect PC host with the network via WiFi. Open the *Network and Sharing Center*:

	![network_and_sharing_center][34]

	Click the *Wi-Fi* icon, enter *Wi-Fi Status* panel:

	![wifi_status][35]

	Click *Properties* button, enter *Wi-Fi Properties* panel. Go to *Sharing* settings, modify them as the following shows:

	![wifi_properties][36]

4. Find out the IP address of the Raspi. Open the *Command Prompt* on the PC, enter `arp -a` to find it out. If there are showing you more than one IP with the prefix: *192.168.137.**, only one of them is right.

	![arp_a][37]

	Try to ping each of them to find it out. Here it is *192.168.137.81*.

	![ping_to_find_out_raspi_ip][38]

5. Open the *Tera-Term*, Click *File - New connection* to create a new connection, and fill in the IP address in the *Host* box, Click *OK*.
	
	![tera_term_new_connection][39]

	Then, it will show you a pop-up window named *SECURITY WARNING*, click *Continue* to ignore it.

	![tera_term_ignore_warning][40]

	In the *SSH Authentication* window, enter the *User name* (**pi**) and *Passphrase* (**raspberry**).

	![tera_term_info][41]

	Click *OK* to login the Raspi.

	![tera_term_login][42]

### Install Gateway
1. Install Git. Enter the following commands in the *Tera-Term* panel.

		sudo apt-get update
		sudo apt-get install git

2. Download Gateway. Enter the following commands in the *Tera-Term* panel.

		cd ~
		git clone https://github.com/XiangcaiHuang/ot_smarthome_gw.git

3. Install and Run the Gateway. Enter the following commands in the *Tera-Term* panel.

		cd ~/ot_smarthome_gw/gateway/
		sudo npm install
	
		cd ~/ot_smarthome_gw/scripts/install/
		sudo chmod +x ot_gw_install.sh
		./ot_gw_install.sh

The installation process takes about 1 ~ 2 hours for the first time. **Make sure the PC Host can access network** via Wi-Fi during installation. It will reboot after installation finished. After that, the Gateway and NCP will run automatically after the power supplied to the Raspi.

See [OpenThread Smarthome Gateway][5] and [embARC OpenThread NCP example][6] for more detailed information.

### Run This Application
> Notice:
> 
> 　The startup order is:    **Thread Nodes** (2 EMSKs), **NCP** (EMSK), **Gateway** (Raspi).
>
> 　If you want to restart one of them, please **restart all of them** in the order stated above.

#### Run Thread Nodes
Power the frontDoor Node and livingRoom Node, open two Tera-Term for them. The Thread Nodes will be ready after a few minutes later.

> Notice:
> 　Use AC adapter to ensure a steady power supply.

#### Run Gateway and NCP
Power the Raspi, then the Gateway and NCP will run automatically.

> Notice:
> 　Use AC adapter to ensure a steady power supply.

#### Run Freeboard UI
Open the *Browser* on the PC, enter IP address and port, like *192.168.137.81:8080* here. Then the UI can be accessed.

![start_ui][43]

> Notice:
>
> 　Sometimes, the Gateway may start failed after installation reboot. Don't have to install again in this situation, just try to reboot the Raspi again.

### Interaction

![running_ui][44]

- On the frontDoor Node
	- Press **Button L** to control the Lock and send its status to UI. LED0 shows the Lock status.
- On the livingRoom Node
	- Press **Button L** to control the Light and send its status to UI. LED0 shows the Light status.
	- Press **Button R** to start/stop sending the **Temperature value** to UI every 5s. LED1 blinking when it reports data.

	> Notice:
	> 　The default does not report the **Temperature value** to UI, press **Button R** to enable it.

- On the Freeboard UI
	- Control **Lock status** and **Light status** by clicking on the according components.

See [embARC OpenThread Smarthome Multinode Application][7] for more information.


[1]: https://www.synopsys.com/dw/ipdir.php?ds=arc_em_starter_kit    "DesignWare ARC EM Starter Kit(EMSK)"
[2]: http://store.digilentinc.com/pmod-rf2-ieee-802-15-rf-transceiver/    "Digilent PMOD RF2 (MRF24J40)"
[3]: http://store.digilentinc.com/pmod-tmp2-temperature-sensor/    "Digilent PMOD TMP2"
[4]: https://www.raspberrypi.org/products/raspberry-pi-3-model-b/    "Raspberry Pi 3"
[5]: https://github.com/XiangcaiHuang/ot_smarthome_gw    "OpenThread Smarthome Gateway"
[6]: https://github.com/foss-for-synopsys-dwc-arc-processors/embarc_osp/tree/master/example/baremetal/openthread/ncp "embARC OpenThread NCP example"
[7]: https://github.com/XiangcaiHuang/embarc_applications/blob/master/ot_smarthome_multinode "embARC OpenThread Smarthome Multinode Application"
[8]: http://embarc.org/embarc_osp/doc/embARC_Document/html/group___e_m_b_a_r_c___a_p_p___b_a_r_e_m_e_t_a_l___b_o_o_t_l_o_a_d_e_r.html    "embARC OSP **Bootloader** example"
[9]: https://github.com/foss-for-synopsys-dwc-arc-processors/embarc_osp/blob/master/example/baremetal/openthread/ncp/main.c "embARC OpenThread NCP example' main.c"
[10]: https://www.raspberrypi.org/downloads/raspbian/ "Raspbian Stretch Lite"
[12]: https://sourceforge.net/projects/win32diskimager/ "Win32 Disk Imager"
[13]: https://www.sdcard.org/downloads/formatter_4/eula_windows/index.html "SD Card Formatter"

[30]: ./img/hardware_connection.jpg "hardware_connection"
[31]: ./img/format_sd_card.PNG "format_sd_card"
[32]: ./img/make_start_card.png "make_start_card"
[33]: ./img/create_ssh_file.PNG "create_ssh_file"
[34]: ./img/network_and_sharing_center.PNG "network_and_sharing_center"
[35]: ./img/wifi_status.PNG "wifi_status"
[36]: ./img/wifi_properties.PNG "wifi_properties"
[37]: ./img/arp_a.PNG "arp_a"
[38]: ./img/ping_to_find_out_raspi_ip.PNG "ping_to_find_out_raspi_ip"
[39]: ./img/tera_term_new_connection.PNG "tera_term_new_connection"
[40]: ./img/tera_term_ignore_warning.PNG "tera_term_ignore_warning"
[41]: ./img/tera_term_info.PNG "tera_term_info"
[42]: ./img/tera_term_login.PNG "tera_term_login"
[43]: ./img/start_ui.PNG "start_ui"
[44]: ./img/running_ui.png "running_ui"
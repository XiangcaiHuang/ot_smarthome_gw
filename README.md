# OpenThread Smarthome Application Gateway and Web UI

- [Overview](#overview)
- [Prequisites](#prequisites)
- [Usage](#usage)
  - [Download](#download)
  - [Run gateway](#run-gateway)
  - [Run Freeboard](#run-freeboard)
  - [Run virtual Thread Nodes](#run-virtual-thread-nodes)
  - [Run simulated Thread Nodes](#run-simulated-thread-nodes)

## Overview
- `./gateway` folder: OpenThread Smarthome Application Gateway source files.
- `./freeboard` folder: Web UI. Just fork from [freeboard][30] by zxytddd. Exactly the same.

## Prequisites
- **nodejs** installed.
- **git** installed.

for running simulated nodes, the following are additional:
- PC/Raspi + Linux OS
- [OpenThread][32] built and installed
- [wpantund][33] installed

## Usage
### Download

- Run git cmd and type `git clone https://github.com/XiangcaiHuang/ot_smarthome_gw.git`

### Run gateway

- Goto `./gateway` folder.
- Run a cmd prompt.
- Type: `npm install` to install dependencies.
- Type: `node gateway.js` to start gateway service.

### Run Freeboard

- Run browser and type `127.0.0.1` to start Freeboard UI service. You can click the light on UI to control it's status to be ON or OFF.

Gateway start:

![gateway_start][1]

Freeboard UI start:

![ui_start][2]

### Run virtual Thread Nodes

- Modify in `./gateway/gateway.js`:

		// for simulated nodes
		var   frontdoorAddr  = cfgCoap.localAddr
		    , livingroomAddr = cfgCoap.localAddr
		    , nodePort = cfgCoap.nodePort

- Modify in `./gateway/coap.js`:

		// for simulated nodes
		var   gwAddr = config.localAddr
		    , gwPort = config.gwPort

- Run another cmd prompt and type: `node vr_nodes.js` to start virtual Thread Nodes.

virtual nodes start:

![vr_nodes_start][3]

- Type: `Node> rst` in Node prompt, then UI service accessed.

Freeboard UI initialized:

![ui_init][4]

Click the light on UI to control:

![ui_click][7]

- See `./gateway/gateway.js` for more commands of gateway

Command *show*:

![gw_cmd_show][10]

Command *send*:

![gw_cmd_send][9]

Command *reset*:

![gw_cmd_reset][8]

- See `./gateway/vr_nodes.js` for more commands of virtual nodes

Command *send* lock status/light status to UI:

![node_send_msg][5]

Command *send* temp to UI:

![node_send_temp][6]

### Run simulated Thread Nodes

- Modify in `./gateway/gateway.js`:

		// for simulated nodes
		var   frontdoorAddr  = cfgCoap.frontdoorAddr
		    , livingroomAddr = cfgCoap.livingroomAddr
		    , nodePort = cfgCoap.defaultPort

- Modify in `./gateway/coap.js`:

		// for simulated nodes
		var   gwAddr = config.gwAddr
		    , gwPort = config.gwPort

- Build or install OpenThread and wpantund, see [Simulation Codelab][31] for more information.
- Start Node1 as **frontdoor** node and create a Thread network, then start another Node2 as **livingroom** node to join the existing network.
	- Start coap service
	- Note their IPv6 address, and modify in `./gateway/config.js`:

			  frontdoorAddr:  'fdde:ba7a:b1e5:0:a5c9:5611:c34a:b41a' // Frontdoor's IPv6 address
			, livingroomAddr: 'fdde:ba7a:b1e5:0:a861:c2b5:5e7f:9d5'  // Livingroom's IPv6 address

		1. Start Node1(frontdoor):
		
			![node_frontdoor_start][11]
		
		2. Start Node2(livingroom):
		
			![node_livingroom_start][12]

- Start wpantund, it contains start simulated NCP. Joining the Thread network via wpanctl Command Line Interface.
	- Note virtual network interface's IPv6 address, and modify in `./gateway/config.js`:

		  	gwAddr:         'fdde:ba7a:b1e5:0:73e9:923:a21d:e66f'  // Gateway's IPv6 address

		1. Start wpantund:
		
			![wpantund_start][15]
		
		2. Run wpanctl:
		
			![wpanctl_join_new_network][16]
		
		3. Find out virtual network interface IPv6 address and config:
		
			![vr_network_interface][18]
		
			![src_config_addr][17]
		
			Try to ping nodes on host, ping successfully means the communication between UI and Nodes is OK:
		
			![host_ping_nodes][19]
		
		4. Start Gateway:
		
			![gateway_start][13]
		
		5. Start UI:
		
			![ui_start][14]

- Communication. Send PUT message from Nodes to Gateway, then update UI automatically. Operating on UI, then gateway will send PUT message to Nodes.

	1. Node1(frontdoor) send PUT - `lock_sta` to GW:
	
		![node_frontdoor_put_lock_sta][20]
	
		GW received:
	
		![gateway_rec_put_lock_sta_from_node][23]
	
		UI update:
	
		![ui_rec_put_lock_sta][24]
	
	2. Node2(livingroom) send PUT - `light_sta` to GW:
	
		![node_livingroom_put_light_sta][21]
	
	3. Node2(livingroom) send PUT - `temp` to GW:
	
		![node_livingroom_put_temp][22]
	
		UI update:
	
		![ui_rec_put_temp][25]
	
	4. Click light of `lock_sta` on UI, then GW send PUT - `lock_sta` to Node1(frontdoor):
	
		GW received:
	
		![gateway_rec_put_lock_sta_from_ui][26]
	
		Node1(frontdoor) received:
	
		![node_frontdoor_rec_put_lock_sta][27]


[1]: ./img/virtual/gateway_start.png "gateway_start"
[2]: ./img/virtual/ui_start.png "ui_start"
[3]: ./img/virtual/vr_nodes_start.png "vr_nodes_start"
[4]: ./img/virtual/ui_init.png "ui_init"
[5]: ./img/virtual/node_send_msg.png "node_send_msg"
[6]: ./img/virtual/node_send_temp.png "node_send_temp"
[7]: ./img/virtual/ui_click.png "ui_click"
[8]: ./img/virtual/gw_cmd_reset.png "gw_cmd_reset"
[9]: ./img/virtual/gw_cmd_send.png "gw_cmd_send"
[10]: ./img/virtual/gw_cmd_show.png "gw_cmd_show"

[11]: ./img/simulation/node_frontdoor_start.png "node_frontdoor_start"
[12]: ./img/simulation/node_livingroom_start.png "node_livingroom_start"
[13]: ./img/simulation/gateway_start.png "gateway_start"
[14]: ./img/simulation/ui_start.png "ui_start"
[15]: ./img/simulation/wpantund_start.png "wpantund_start"
[16]: ./img/simulation/wpanctl_join_new_network.png "wpanctl_join_new_network"
[17]: ./img/simulation/src_config_addr.png "src_config_addr"
[18]: ./img/simulation/vr_network_interface.png "vr_network_interface"
[19]: ./img/simulation/host_ping_nodes.png "host_ping_nodes"
[20]: ./img/simulation/node_frontdoor_put_lock_sta.png "node_frontdoor_put_lock_sta"
[21]: ./img/simulation/node_livingroom_put_light_sta.png "node_livingroom_put_light_sta"
[22]: ./img/simulation/node_livingroom_put_temp.png "node_livingroom_put_temp"
[23]: ./img/simulation/gateway_rec_put_lock_sta_from_node.png "gateway_rec_put_lock_sta_from_node"
[24]: ./img/simulation/ui_rec_put_lock_sta.png "ui_rec_put_lock_sta"
[25]: ./img/simulation/ui_rec_put_temp.png "ui_rec_put_temp"
[26]: ./img/simulation/gateway_rec_put_lock_sta_from_ui.png "gateway_rec_put_lock_sta_from_ui"
[27]: ./img/simulation/node_frontdoor_rec_put_lock_sta.png "node_frontdoor_rec_put_lock_sta"

[30]: https://github.com/zxytddd/freeboard "freeboard"
[31]: https://codelabs.developers.google.com/codelabs/openthread-simulation/index.html#0 "Simulation Codelab"
[32]: https://github.com/openthread/openthread "OpenThread"
[33]: https://github.com/openthread/wpantund "wpantund"
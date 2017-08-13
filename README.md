# OpenThread Smarthome Application Gateway and Web UI
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
### **Download**:

- Run git cmd and type `git clone https://github.com/XiangcaiHuang/ot_smarthome_gw.git`

### Run **gateway**:

- Goto `./gateway` folder.
- Run a cmd prompt.
- Type: `npm install` to install dependencies.
- Type: `node gateway.js` to start gateway service.

### Run **Freeboard**:

- Run browser and type `127.0.0.1` to start Freeboard UI service. You can click the light on UI to control it's status to be ON or OFF.

Gateway start:

![gateway_start][1]

Freeboard UI start:

![ui_start][2]

### Run **virtual Thread Nodes**:

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

### Run **simulated Thread Nodes**:

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
- Start Node1 as **frontdoor** node and create a Thread network, then start another Node as **livingroom** node to join the existing network.
	- Start coap service
	- Note their IPv6 address, and modify in `./gateway/config.js`:

			  frontdoorAddr:  'fdde:ba7a:b1e5:0:a5c9:5611:c34a:b41a' // Frontdoor's IPv6 address
			, livingroomAddr: 'fdde:ba7a:b1e5:0:a861:c2b5:5e7f:9d5'  // Livingroom's IPv6 address

- Start wpantund, it contains start simulated NCP. Joining the Thread network via wpanctl Command Line Interface.
	- Note virtual network interface's IPv6 address, and modify in `./gateway/config.js`:

		  	gwAddr:         'fdde:ba7a:b1e5:0:73e9:923:a21d:e66f'  // Gateway's IPv6 address


[1]: ./img/gateway_start.png "gateway_start"
[2]: ./img/ui_start.png "ui_start"
[3]: ./img/vr_nodes_start.png "vr_nodes_start"
[4]: ./img/ui_init.png "ui_init"
[5]: ./img/node_send_msg.png "node_send_msg"
[6]: ./img/node_send_temp.png "node_send_temp"
[7]: ./img/ui_click.png "ui_click"
[8]: ./img/gw_cmd_reset.png "gw_cmd_reset"
[9]: ./img/gw_cmd_send.png "gw_cmd_send"
[10]: ./img/gw_cmd_show.png "gw_cmd_show"

[30]: https://github.com/zxytddd/freeboard "freeboard"
[31]: https://codelabs.developers.google.com/codelabs/openthread-simulation/index.html#0 "Simulation Codelab"
[32]: https://github.com/openthread/openthread "OpenThread"
[33]: https://github.com/openthread/wpantund "wpantund"
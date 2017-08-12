# OpenThread Smarthome Application Gateway and Web UI
## Overview

## Prequisites
- **nodejs** installed.
- **git** installed.


## Usage
**Download**:

- Run git cmd and type `git clone https://github.com/XiangcaiHuang/ot_smarthome_gw.git`

Run **gateway**:

- Goto `./gateway` folder.
- Run a cmd prompt.
- Type: `npm install` to install dependencies.
- Type: `node gateway.js` to start gateway service.

Run **Freeboard**:

- Run browser and type `127.0.0.1` to start Freeboard UI service. You can click the light on UI to control it's status to be ON or OFF.

Gateway start:

![gateway_start][1]

Freeboard UI start:

![ui_start][2]

Run **simulated Thread Nodes**:

- Run another cmd prompt and type: `node vr_nodes.js` to start simulated Thread Nodes.

Simulated nodes start:

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

- See `./gateway/vr_nodes.js` for more commands of simulated nodes

Command *send* lock status/light status to UI:

![node_send_msg][5]

Command *send* temp to UI:

![node_send_temp][6]

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


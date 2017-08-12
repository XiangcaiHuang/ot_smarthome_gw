# OpenThread Smarthome Application Gateway and Web UI
## Overview

## Prequisites
- **nodejs** installed.
- **git** installed.


## Usage
**Download**:

- Run git cmd and type `git clone https://github.com/XiangcaiHuang/ot_smarthome_gw.git`

Run **gateway** and **simulated Thread Nodes**:

- Goto `./gateway` folder.
- Run a cmd prompt.
- Type: `npm install` to install dependencies.
- Type: `node gateway.js` to start gateway service.
- Run another cmd prompt and type: `node vr_nodes.js` to start simulated Thread Nodes.

Run **Freeboard**:

- Run browser and type `127.0.0.1` to start Freeboard UI service. You can click the light on UI to control it's status to be ON or OFF.
- Type: `Node> s1` in Node prompt, then UI service accessed. See `./gateway/gateway.js` for more commands


/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the 
 	OpenThread Application Gateway.
--------------------------------------------- */
const coap    = require('./coap')
    , config  = require('./config').coap
    , clUtils = require('command-node')
    , httpServer  = require('./httpServer')
    , wsServer = require('./webSocketServer')

function WSMessageHandle()
{
	console.log('webSocket handler.')
}

/******************** Commands **************************/
function cmdSendToNode(commands)
{
	coap.sendToNode(config.localAddr, config.nodePort, commands[0], commands[1])
}

function cmdSend1ToNode(commands)
{
	coap.sendToNode(config.localAddr, config.nodePort, config.lockSta, config.valOn)
}

function cmdSend2ToNode(commands)
{
	coap.sendToNode(config.localAddr, config.nodePort, config.lightSta, config.valOn)
}

const commands = {
	's': {
		parameters: ['url', 'value'],
		description: '\tSend PUT message to Node',
		handler: cmdSendToNode
	},
	's1': {
		parameters: [],
		description: '\tSend lockSta PUT message to Node',
		handler: cmdSend1ToNode
	},
	's2': {
		parameters: [],
		description: '\tSend lightSta PUT message to Node',
		handler: cmdSend2ToNode
	}
}
/******************** Commands **************************/

/********************   Main   **************************/
console.log('OT Gateway starting:')
coap.serverStart()
httpServer.start();
wsServer.start(WSMessageHandle);

clUtils.initialize(commands, 'GW> ')
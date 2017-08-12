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


// receive PUT message from Thread Nodes
function coapMessageHandle(req, res)
{
	var method  = req.method.toString()
	var url     = req.url.split('/')[1].toString()
	var payload = req.payload.toString()

	console.log('Request received:')
	console.log('\t method:  ' + method)
	console.log('\t url:     ' + url)
	console.log('\t payload: ' + payload)

	if (method === 'PUT') {
		console.log(url + ': ' + payload)

		switch(url){
		case config.lockSta:
			// send payload to Web UI
			console.log('GW: Send lock status to UI.\r\n')
			// sendToNode(localAddr, url, valOn)
			break
		case config.lightSta:
			// send payload to Web UI
			console.log('GW: Send light status to UI.\r\n')
			// sendToNode(localAddr, url, valOff)
			break
		default:
			console.error('Err: Bad url.\r\n')
			break
		}
	}
	res.end('GW: Received.') // send response to client
}

// receive PUT message from Web UI
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

coap.serverStart(coapMessageHandle)
httpServer.start()
wsServer.start(WSMessageHandle)

clUtils.initialize(commands, 'GW> ')
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
    , utils    = require('./utils')

var   stateNew = require('./state').stateNew
    , state    = require('./state').state


// must initialize the stateNew or it happen error
function stateInit()
{
	stateNew = {
		'frontdoor':{
			'lock_sta':  'OFF'
		},
		'livingroom':{
			'light_sta': 'OFF'
		}
	}
}

// receive PUT message from Thread Nodes
function coapMessageHandle(req, res)
{
	var method  = req.method.toString()
	var url     = req.url.split('/')[1].toString()
	var value   = req.payload.toString()

	console.log('\nRequest received:')
	console.log('\t method:  ' + method)
	console.log('\t url:     ' + url)
	console.log('\t payload: ' + value)

	if (method === 'PUT') {
		switch(url){
		case config.lockSta:
			sendToUI(config.nodeFrontdoor, config.lockSta, value)
			break
		case config.lightSta:
			sendToUI(config.nodeLivingroom, config.lightSta, value)
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

// send state changed to UI
function sendToUI(nodeName, url, val)
{
	stateNew[nodeName][url] = val

	var stateChange = utils.getDifferent(stateNew, state)
	if (stateChange !== undefined) {
		console.log("GW: Send state changed to UI.")
		console.log("\tstate changed : " + JSON.stringify(stateChange))

		wsServer.send(stateChange)       //send to UI
		state = utils.deepCopy(stateNew) //update state
	} 
}

/******************** Commands **************************/
function cmdShowState()
{
	console.log('stateNew:')
	console.log(JSON.stringify(stateNew))
	console.log('\n')
	console.log('state:')
	console.log(JSON.stringify(state))
}

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
	'show': {
		parameters: [],
		description: '\tList all the resource in state and stateNew.',
		handler: cmdShowState
	},
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

stateInit()
coap.serverStart(coapMessageHandle)
httpServer.start()
wsServer.start(WSMessageHandle)

clUtils.initialize(commands, 'GW> ')
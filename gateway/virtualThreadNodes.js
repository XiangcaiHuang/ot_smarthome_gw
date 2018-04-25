/* ------------------------------------------
LICENSE

 * \version 
 * \date    2018-4-25
 * \author  Xiangcai Huang
 * \brief	the functions about the virtual Thread Nodes(CoAP/Thread).
--------------------------------------------- */
const coap  = require('coap')
    , config  = require('./config').coap
    , clUtils = require('command-node')
    , coapServer = coap.createServer({ type: 'udp6' })

var stateNew = {}
var jsonPayload = {}

function coapServerStart()
{
	coapServer.listen(config.nodePort, config.localAddr, function() {
		console.log('Coap: Listening at port: ' + config.nodePort)
	})

	// receive PUT message from Gateway
	coapServer.on('request', function(req, res) {
		var method  = req.method.toString()
		var url     = req.url.split('/')[1].toString()
		var payload = req.payload.toString()

		console.log('\nRequest received:')
		console.log('\t method:  ' + method)
		console.log('\t url:     ' + url)
		console.log('\t payload: ' + payload)

		if (method === 'PUT') {
			console.log(url + ': ' + payload)

			switch(url){
			case config.Rlamp:
				// set lamp status
				console.log('Nodes: Set lamp status.\r\n')
				stateNew[url] = payload
				// jsonPayload[url] = payload
				break
			default:
				console.error('Err: Bad url.\r\n')
				break
			}
		}
		res.end('Nodes: Received.') // send response to client
	})
}

// send PUT message to Gateway
function sendToGW(gwAddr, gwPort, nodeName, key, val)
{
	var req = coap.request({
		  host: gwAddr
		, port: gwPort
		, method: 'PUT'
		, pathname: nodeName // url for PUT request
	})

	jsonPayload = {}
	jsonPayload[key] = val
	stateNew[key] = val

	console.log('\n' + nodeName + ' : Send ' + JSON.stringify(jsonPayload) + ' to [' + gwAddr + ': ' + gwPort + '].')

	req.on('response', function(res) {
		console.log('Nodes: Send successfully.')
		res.pipe(process.stdout)
	})

	req.end(JSON.stringify(jsonPayload)) // add payload: value to PUT message
}


/******************** Commands **************************/
function cmdShowState()
{
	console.log('stateNew:' + JSON.stringify(stateNew))
	console.log('\njsonPayload:' + JSON.stringify(jsonPayload))
}

function cmdReset()
{
	stateNew = {}
	jsonPayload = {}
}

function cmdSendToGW(commands)
{
	sendToGW(config.localAddr, config.gwPort, commands[0], commands[1], commands[2])
}

function cmdExit(commands)
{
	process.exit();
}

const commands = {
	'l': { //list
		parameters: [],
		description: '\tList all the resource in stateNew and jsonPayload.',
		handler: cmdShowState
	},
	's': { // like: s wn btemp 380
		parameters: ['nodeName', 'key', 'value'],
		description: '\tSend CoAP PUT message to Gateway',
		handler: cmdSendToGW
	},
	'r': { // reset
		parameters: [],
		description: '\tReset jsonPayload',
		handler: cmdReset
	},
	'q': {
		parameters: [],
		description: '\tExit',
		handler: cmdExit
	}
}
/******************** Commands **************************/

/********************   Main   **************************/
coapServerStart()

clUtils.initialize(commands, 'Node> ')
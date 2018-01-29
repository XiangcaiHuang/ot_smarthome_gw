/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the virtual Thread Nodes.
--------------------------------------------- */
const coap  = require('coap')
    , config  = require('./config').coap
    , clUtils = require('command-node')
    , coapServer = coap.createServer({ type: 'udp6' })


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
function sendToGW(gwAddr, gwPort, url, value)
{
	var req = coap.request({
		  host: gwAddr
		, port: gwPort
		, method: 'PUT'
		, pathname: url // url for PUT request
	})

	console.log('\nGW: Send {' + url + ': ' + value + '} to [' + gwAddr + ': ' + gwPort + '].')

	req.on('response', function(res) {
		console.log('Nodes: Send successfully.')
		res.pipe(process.stdout)
	})

	req.end(value) // add payload: value to PUT message
}


/******************** Commands **************************/
function cmdSendToGW(commands)
{
	sendToGW(config.localAddr, config.gwPort, commands[0], commands[1])
}

function cmdResetNodes(commands)
{
	sendToGW(config.localAddr, config.gwPort, config.Rbtemp,     "37")
	sendToGW(config.localAddr, config.gwPort, config.Rhrate,     "0")
	sendToGW(config.localAddr, config.gwPort, config.Rstate,     "0")
	sendToGW(config.localAddr, config.gwPort, config.Rmotion,    "2000")
	sendToGW(config.localAddr, config.gwPort, config.Rwhrate,    "false")
	sendToGW(config.localAddr, config.gwPort, config.Rwbtemp,    "false")
	sendToGW(config.localAddr, config.gwPort, config.Rwdownward, "false")
	sendToGW(config.localAddr, config.gwPort, config.Rlamp,      "0")
}

function cmdExit(commands)
{
	process.exit();
}

const commands = {
	's': { // like: s btemp 380
		parameters: ['url', 'value'],
		description: '\tSend CoAP PUT message to Gateway',
		handler: cmdSendToGW
	},
	'rst': {
		parameters: [],
		description: '\tSend CoAP PUT message to reset Nodes',
		handler: cmdResetNodes
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
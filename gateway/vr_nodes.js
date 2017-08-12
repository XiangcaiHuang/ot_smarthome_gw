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
			case config.lockSta:
				// set lock status
				console.log('Nodes: Set lock status.\r\n')
				break
			case config.lightSta:
				// set light status
				console.log('Nodes: Set light status.\r\n')
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

	console.log('Nodes: Send PUT request to [' + gwAddr + '].')

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

function cmdSend1ToGW(commands)
{
	sendToGW(config.localAddr, config.gwPort, config.lockSta, config.valOn)
}

function cmdSend2ToGW(commands)
{
	sendToGW(config.localAddr, config.gwPort, config.lightSta, config.valOn)
}

const commands = {
	's': {
		parameters: ['url', 'value'],
		description: '\tSend PUT message to Gateway',
		handler: cmdSendToGW
	},
	's1': {
		parameters: [],
		description: '\tSend lockSta PUT message to Gateway',
		handler: cmdSend1ToGW
	},
	's2': {
		parameters: [],
		description: '\tSend lightSta PUT message to Gateway',
		handler: cmdSend2ToGW
	}
}
/******************** Commands **************************/

/********************   Main   **************************/
coapServerStart()

clUtils.initialize(commands, 'Node> ')
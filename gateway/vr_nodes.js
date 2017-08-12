/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the virtual Thread Nodes.
--------------------------------------------- */
// Gateway's IPv6 address:
// 	fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3

// Node command:
// 	coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 lock_btn con 1
// 	coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 light_btn con 2

const GW_ADDR    = 'fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3' // Gateway's IPv6 address
    , LOCAL_ADDR = '::1' // Localhost's IPv6 address
    , NODE_PORT  = 5683
    , GW_PORT    = 5684

const LOCK_STA  = 'lock_sta'
    , LIGHT_STA = 'light_sta'
    , VAL_ON    = 'ON'
    , VAL_OFF   = 'OFF'

const coap  = require('coap')
    , clUtils = require('command-node')
    , coapServer = coap.createServer({ type: 'udp6' })


function coapServerStart()
{
	coapServer.listen(NODE_PORT, LOCAL_ADDR, function() {
		console.log('Virtual nodes started.\r\n')
	})

	// receive PUT message from Gateway
	coapServer.on('request', function(req, res) {
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
			case LOCK_STA:
				// set lock status
				console.log('Nodes: Set lock status.\r\n')
				break
			case LIGHT_STA:
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
	sendToGW(LOCAL_ADDR, GW_PORT, commands[0], commands[1])
}

function cmdSend1ToGW(commands)
{
	sendToGW(LOCAL_ADDR, GW_PORT, LOCK_STA, VAL_ON)
}

function cmdSend2ToGW(commands)
{
	sendToGW(LOCAL_ADDR, GW_PORT, LIGHT_STA, VAL_ON)
}

const commands = {
	's': {
		parameters: ['url', 'value'],
		description: '\tSend PUT message to Gateway',
		handler: cmdSendToGW
	},
	's1': {
		parameters: [],
		description: '\tSend LOCK_STA PUT message to Gateway',
		handler: cmdSend1ToGW
	},
	's2': {
		parameters: [],
		description: '\tSend LIGHT_STA PUT message to Gateway',
		handler: cmdSend2ToGW
	}
}
/******************** Commands **************************/

/********************   Main   **************************/
coapServerStart()

clUtils.initialize(commands, 'Node> ')
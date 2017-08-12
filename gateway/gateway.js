// Gateway's IPv6 address:
// 	fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3

// Node command:
// 	coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 lock_btn con 1
// 	coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 light_btn con 2

const FRONTDOOR_ADDR  = 'fdde:ba7a:b1e5:0:d7a3:1de2:916f:8d50' // Frontdoor's IPv6 address
const LIVINGROOM_ADDR = 'fdde:ba7a:b1e5:0:31a2:d832:9c48:59d5' // Livingroom's IPv6 address
const LOCAL_ADDR      = '::1' // Localhost's IPv6 address

const LOCK_STA  = 'lock_sta'
const LIGHT_STA = 'light_sta'
const VAL_ON    = 'ON'
const VAL_OFF   = 'OFF'

const coap    = require('coap')
    , coapServer  = coap.createServer({ type: 'udp6' })

coapServer.listen(function() {
	console.log('Gateway started.\r\n')
})

// receive PUT message from Thread Nodes
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
			// send payload to Web UI
			console.log('GW: Send LOCK_STA to UI.\r\n')
			// sendToNode(LOCAL_ADDR, url, VAL_ON)
			break
		case LIGHT_STA:
			// send payload to Web UI
			console.log('GW: Send LIGHT_STA to UI.\r\n')
			// sendToNode(LOCAL_ADDR, url, VAL_OFF)
			break
		default:
			console.error('Err: Bad url.\r\n')
			break
		}
	}
	res.end('GW: Received.') // send response to client
})

// send PUT message to Thread Nodes
function sendToNode(nodeAddr, url, value){
	var req = coap.request({
		  host: nodeAddr
		, method: 'PUT'
		, pathname: url // url for PUT request
	})

	console.log('GW: Send PUT request to [' + nodeAddr + '].')

	req.on('response', function(res) {
		console.log('GW: Send successfully.')
		res.pipe(process.stdout)
	})

	req.end(value) // add payload: value to PUT message
}
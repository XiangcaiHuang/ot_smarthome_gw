// Gateway's IPv6 address:
// 	fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3

// Node command:
// 	coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 lock_btn con 1
// 	coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 light_btn con 2

const GATEWAY_ADDR  = 'fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3' // Gateway's IPv6 address
const LOCAL_ADDR    = '::1' // Localhost's IPv6 address

const LOCK_STA  = 'lock_sta'
const LIGHT_STA = 'light_sta'
const VAL_ON    = 'ON'
const VAL_OFF   = 'OFF'

const coap    = require('coap')
    , coapServer  = coap.createServer({ type: 'udp6' })

// coapServer.listen(function() {
// 	console.log('Virtual nodes started.\r\n')
// 	// sendToGW(LOCAL_ADDR, LOCK_STA)
// })

// // receive PUT message from Gateway
// coapServer.on('request', function(req, res) {
// 	var method  = req.method.toString()
// 	var url     = req.url.split('/')[1].toString()
// 	var payload = req.payload.toString()

// 	console.log('Request received:')
// 	console.log('\t method:  ' + method)
// 	console.log('\t url:     ' + url)
// 	console.log('\t payload: ' + payload)

// 	if (method === 'PUT') {
// 		console.log(url + ': ' + payload)

// 		switch(url){
// 		case LOCK_STA:
// 			// set lock status
// 			console.log('Nodes: Set lock status.')
// 			break
// 		case LIGHT_STA:
// 			// set light status
// 			sendToGW(LOCAL_ADDR, url)
// 			break
// 		default:
// 			console.error('Err: Bad url.')
// 			break
// 		}
// 	}
// 	res.end('Nodes: Received.') // send response to client
// })

sendToGW(LOCAL_ADDR, LOCK_STA, VAL_ON)
sendToGW(LOCAL_ADDR, LIGHT_STA, VAL_ON)

// send PUT message to Gateway
function sendToGW(gwAddr, url, value){
	var req = coap.request({
		  host: gwAddr
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
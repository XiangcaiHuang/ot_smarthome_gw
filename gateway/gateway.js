// Gateway's IPv6 address:
// 	fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3

// Node command:
// 	coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 lock_btn con 1
// 	coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 light_btn con 2

const frontdoorAddr  = 'fdde:ba7a:b1e5:0:d7a3:1de2:916f:8d50' // Frontdoor's IPv6 address
const livingroomAddr = 'fdde:ba7a:b1e5:0:31a2:d832:9c48:59d5' // Livingroom's IPv6 address

const coap    = require('coap')
    , coapServer  = coap.createServer({ type: 'udp6' })
    // , req_light_btn = coap.request('coap://[' + livingroomAddr + ']/light_btn')

coapServer.listen(function() {
	console.log('Gateway started.')
})

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
		case 'lock_sta':
			// send payload to Web UI
			break
		case 'lock_btn':
			// send payload to Web UI
			sendRequest(frontdoorAddr, url)
			break
		case 'light_sta':
			// send payload to Web UI
			break
		case 'light_btn':
			// send payload to Web UI
			sendRequest(livingroomAddr, url)
			break
		default:
			console.error('err: bad url.')
			break
		}
	}
	res.end('101') // send response to client
})

function sendRequest(ipv6_addr, url){
	var req = coap.request({
		  host: ipv6_addr
		, method: 'PUT'
		, pathname: url // url for PUT request
	})

	console.log('Send PUT request to [' + ipv6_addr + '].')

	req.on('response', function(res) {
		console.log('Send successfully.')
		res.pipe(process.stdout)
	})

	req.end()
}
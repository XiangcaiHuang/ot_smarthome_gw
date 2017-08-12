/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the 
 	OpenThread-CoAP-Based Server and Client.
--------------------------------------------- */
const coap    = require('coap')
    , config  = require('./config').coap
    , coapServer  = coap.createServer({ type: 'udp6' })

function serverStart()
{
	coapServer.listen(config.gwPort, config.localAddr, function() {
		console.log('Coap: Listening at port: ' + config.gwPort)
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
	})
}

// send PUT message to Thread Nodes
function sendToNode(nodeAddr, nodePort, url, value)
{
	var req = coap.request({
		  host: nodeAddr
		, port: nodePort
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

module.exports.serverStart = serverStart
module.exports.sendToNode  = sendToNode
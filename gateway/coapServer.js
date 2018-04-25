/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the 
 	OpenThread-CoAP-Based Server and Client.
--------------------------------------------- */
const coap    = require('coap')
    , cfgCoap  = require('./config').coap
    , coapServer  = coap.createServer({ type: 'udp6' })

// for simulated nodes
 // var   gwAddr = cfgCoap.gwAddr
 //     , gwPort = cfgCoap.gwPort

// for virtual nodes (NodeJs)
// var   gwAddr = cfgCoap.localAddr
//    , gwPort = cfgCoap.gwPort

var   gwAddr = cfgCoap.gwAddr
    , gwPort = cfgCoap.gwPort

function serverStart(handleMessage)
{
	coapServer.listen(gwPort, gwAddr, function() {
		console.log('coapServer: Listening on [' + gwAddr + ' : ' + gwPort + ']')
	})

	// receive PUT message from Thread Nodes
	coapServer.on('request', handleMessage)
}

// send PUT message to Thread Nodes
function sendToNode(nodeAddr, nodePort, url, value)
{
	var req = coap.request({
		  host: nodeAddr
		, port: nodePort
		, method: 'PUT'
		, pathname: url // url for PUT request
		, confirmable: false
	})

	console.log('\nGW: Send {' + url + ': ' + value + '} to [' + nodeAddr + ': ' + nodePort + '].')

	req.on('response', function(res) {
		console.log('GW: Send successfully.')
		res.pipe(process.stdout)
	})

	req.end(value) // add payload: value to PUT message
}

module.exports.serverStart = serverStart
module.exports.sendToNode  = sendToNode
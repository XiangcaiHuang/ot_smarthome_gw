/* ------------------------------------------
LICENSE

 * \version 
 * \date    2018-4-25
 * \author  Xiangcai Huang
 * \brief	the functions about the virtual App(TCP Client).
--------------------------------------------- */
const clUtils = require('command-node')
    , net = require('net')
    , clientSocket = new net.Socket()
    , cfgTCP = require('./config').tcp
    , cfgCoap  = require('./config').coap

var jsonPayload = {}
var serverAddr, serverPort

function start(servIP, servPort, handleMessage)
{
	serverAddr = servIP
	serverPort = servPort
	clientSocket.connect(serverPort, serverAddr, function() {
		console.log('\nGW: Connect to server [' + serverAddr + ' : ' + serverPort +']');
	});

	clientSocket.on('data', handleMessage);

	clientSocket.on('close', function() {
		console.log('\nGW: Connection closed');
	});

	clientSocket.on('error', function(error){
		// console.log(error);
	});
}

// send message to server
function send(key, val)
{
	jsonPayload = {}
	jsonPayload[key] = val

	console.log('\n Send ' + JSON.stringify(jsonPayload) + ' to [' + serverAddr + ': ' + serverPort + '].')

	clientSocket.write(JSON.stringify(jsonPayload));
}

module.exports.start = start
module.exports.send = send
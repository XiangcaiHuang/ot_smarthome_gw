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
		console.log('\ntcpClient: Connect to (Voice module)server [' + serverAddr + ' : ' + serverPort +']');
	});

	clientSocket.on('data', handleMessage);

	clientSocket.on('close', function() {
		console.log('\ntcpClient: (Voice module)Connection closed');
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

	console.log('\ntcpClient: Send ' + JSON.stringify(jsonPayload) + ' to (Voice module)[' + serverAddr + ': ' + serverPort + '].')

	clientSocket.write(JSON.stringify(jsonPayload));
}

module.exports.start = start
module.exports.send = send
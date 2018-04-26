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

var   gwAddr = cfgTCP.ip
    , gwPort = cfgTCP.port

var stateApp = {}
var jsonPayload = {}

function tcpClientStart()
{
	clientSocket.connect(gwPort, gwAddr, function() {
		console.log('\nApp: Connect to Gateway [' + gwAddr + ' : ' + gwPort +']');
	});

	clientSocket.on('data', function(data) {
		console.log('\nGateway: ' + data);

		try {
			var obj= JSON.parse(data)
		} catch (err) {
			console.log('\nApp: Not JSON payload')
			return
		}
		
		for (var item in obj) {
			var key = item.toString()
			var val = obj[item].toString()
			stateApp[key] = val
			// jsonPayload[key] = val
		}
	});

	clientSocket.on('close', function() {
		console.log('\nApp: Connection closed');
	});

	clientSocket.on('error', function(error){
		// console.log(error);
	});
}

// send message to Gateway
function sendToGW(key, val)
{
	jsonPayload = {}
	jsonPayload[key] = val
	stateApp[key] = val

	console.log('\n Send ' + JSON.stringify(jsonPayload) + ' to [' + gwAddr + ': ' + gwPort + '].')

	clientSocket.write(JSON.stringify(jsonPayload));
}


/******************** Commands **************************/
function cmdShowState()
{
	console.log('stateApp:' + JSON.stringify(stateApp))
	console.log('\njsonPayload:' + JSON.stringify(jsonPayload))
}

function cmdReset()
{
	stateApp = {}
	jsonPayload = {}
}

function cmdSendToGW(commands)
{
	var key = commands[0]
	var val = commands[1]

	switch (key) {
	case cfgCoap.Rlamp:
		sendToGW(key, val)
		break
	default:
		console.log('Err: Bad key.')
		return
	}
}

function cmdExit(commands)
{
	process.exit();
}

const commands = {
	'l': { //list
		parameters: [],
		description: '\tList all the resource in stateApp and jsonPayload.',
		handler: cmdShowState
	},
	's': { // like: s btemp 380
		parameters: ['key', 'value'],
		description: '\tSend TCP Package to Gateway',
		handler: cmdSendToGW
	},
	'r': { // reset
		parameters: [],
		description: '\tReset stateApp',
		handler: cmdReset
	},
	'q': {
		parameters: [],
		description: '\tExit',
		handler: cmdExit
	}
}
/******************** Commands **************************/

/********************   Main   **************************/
tcpClientStart()

clUtils.initialize(commands, 'App> ')
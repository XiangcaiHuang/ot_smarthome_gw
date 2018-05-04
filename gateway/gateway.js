/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the 
	OpenThread Application Gateway.
--------------------------------------------- */
const coapServer = require('./coapServer')
    , cfgCoap  = require('./config').coap
    , wsServer = require('./webSocketServer')
    , utils    = require('./utils')
    , cfgObjectId = require('./config').ObjectId
    , clUtils     = require('command-node')
    , httpServer  = require('./httpServer')
    , tcpServer = require('./tcpSocketServer')
    , cfgTCP    = require('./config').tcp
    , tcpClient = require('./tcpSocketClient')

var   stateNew = require('./state').stateNew
    , state    = require('./state').state
    , stateApp = require('./state').stateApp

var   wnAddr   = cfgCoap.wnAddr
    , lnAddr   = cfgCoap.lnAddr
    , nodePort = cfgCoap.nodePort

// must initialize the stateNew or it happen error
function stateInit()
{
	stateNew = {
		"wn":{
			"3303":{"0":{"5700":0    }},// btemp
			"3346":{"0":{"5700":61   }},// hrate

			"3300":{"0":{"5700":0    }},// state
			"3323":{"0":{"5700":0    }},// motion

			"3338":{"0":{"5800":"false"}},// whrate
			"3339":{"0":{"5800":"false"}},// wbtemp
			"3341":{"0":{"5800":"false"}},// wdownward
			"3342":{"0":{"5800":"false"}},// awake
		},
		'ln':{
			"3311":{"0":{"5850":false}} // lamp
		}
	}

	stateApp = {
		  'btemp'    :"0" // Resources of wearable node
		, 'hrate'    :"61"
		, 'state'    :"0"
		, 'motion'   :"0"
		, 'whrate'   :"0"
		, 'wbtemp'   :"0"
		, 'wdownward':"0"
		, 'awake'    :"0"
		, 'lamp'     :"0" // Resources of lamp node
		, 'co2'      :"0"
		, 'tvoc'     :"0"
		, 'ch2o'     :"0"
		, 'pm2_5'    :"0"
		, 'rh'       :"0"
		, 'temp'     :"0"
		, 'pm10'     :"0"
	}
}

/**
 * \brief   Handle function when get the message from client.
 */
function TCPClientMSGHandle(data) {
	console.log("\nTCP package Received[" + data.length + "]:\n" + data)
}

function sendToTCPServer(key, val)
{
	switch (key) {
	case cfgTCP.Ralarm:
		tcpClient.send(key, val)
		break
	default:
		console.log('Err: Bad key.')
		return
	}
}

/**
 * \brief   Handle function when get the message from client.
 */
function TCPServerMSGHandle(data) {
	console.log("\nTCP package Received[" + data.length + "]:\n" + data)

	try {
		var obj= JSON.parse(data)
	} catch(err) {
		console.log('\nGW: Not JSON payload')
		return
	}
	for (var item in obj) {
		var key = item.toString()
		var val = obj[item].toString()

		switch(key) {
			case cfgCoap.Rlamp:
				sendToUI(cfgCoap.nodeLamp, key, val)
				coapServer.sendToNode(lnAddr, nodePort, key, val)
				stateApp[key] = val
			break
		default:
			console.error('Err: Bad key')
			break
		}
	}
}

// send state changed to UI
function sendStateToApp(stateApp)
{
	if (stateApp !== undefined) {
		console.log("\nGW: Send state changed to App.")
		console.log("\tstate changed : " + JSON.stringify(stateApp))

		tcpServer.send(JSON.stringify(stateApp)); //send to App
		// state = utils.deepCopy(stateNew) //update state
	}
}

function sendToApp(key, val)
{
	stateApp[key] = val
	sendStateToApp(stateApp)
}

// receive PUT message from Thread Nodes
function coapMessageHandle(req, res)
{
	var method = req.method.toString()
	var nodeName = req.url.split('/')[1].toString()
	var jsonPayload = req.payload.toString()

	console.log('\nRequest received:')
	console.log('\t method:  ' + method)
	console.log('\t url:     ' + nodeName)
	console.log('\t payload: ' + jsonPayload)

	var obj= JSON.parse(jsonPayload)
	for (var item in obj) {
		var key = item.toString()
		var val = obj[item].toString()
		stateApp[key]= val
		
		switch(key){
		case cfgCoap.Rbtemp:
			oId = cfgObjectId.oIdRbtemp
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRbtemp
			//temperature format: 370
			//transfer it to 37.0'C
			val = parseInt(val) / 10.0
			stateNew[nodeName][oId][iId][rId] = val
			break
		case cfgCoap.Rhrate:
			oId = cfgObjectId.oIdRhrate
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRbtemp
			val = parseInt(val)
			stateNew[nodeName][oId][iId][rId] = val
			break
		case cfgCoap.Rstate:
			oId = cfgObjectId.oIdRstate
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRstate
			val = parseInt(val)
			stateNew[nodeName][oId][iId][rId] = val
			break
		case cfgCoap.Rmotion:
			oId = cfgObjectId.oIdRmotion
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRmotion
			val = parseInt(val)
			stateNew[nodeName][oId][iId][rId] = val
			break
		case cfgCoap.Rwhrate:
			oId = cfgObjectId.oIdRwhrate
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRwhrate
			val = utils.transferSI2SB(val)
			stateNew[nodeName][oId][iId][rId] = val
			break
		case cfgCoap.Rwbtemp:
			oId = cfgObjectId.oIdRwbtemp
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRwbtemp
			val = utils.transferSI2SB(val)
			stateNew[nodeName][oId][iId][rId] = val
			break
		case cfgCoap.Rwdownward:
			if(val == "1") {
				sendToTCPServer(cfgTCP.Ralarm, "1")
				coapServer.sendToNode(lnAddr, nodePort, cfgCoap.Rlamp, "1")
				stateNew[cfgCoap.nodeLamp][cfgObjectId.oIdRlamp][cfgObjectId.iId][cfgObjectId.rIdRlamp] = true
			}

			oId = cfgObjectId.oIdRwdownward
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRwdownward
			val = utils.transferSI2SB(val)
			stateNew[nodeName][oId][iId][rId] = val
			break
		case cfgCoap.Rawake:
			oId = cfgObjectId.oIdRawake
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRawake
			val = utils.transferSI2SB(val)
			stateNew[nodeName][oId][iId][rId] = val
			break
		case cfgCoap.Rlamp:
			oId = cfgObjectId.oIdRlamp
			iId = cfgObjectId.iId
			rId = cfgObjectId.rIdRlamp
			val = utils.transferSI2B(val)
			stateNew[nodeName][oId][iId][rId] = val
			break
		default:
			console.log("GW: url [" + key + "] don't send it to Web UI")
			break
		}
	}
	
	sendStateToApp(stateApp)
	sendStateToUI(stateNew)
}

function deltaFromUI(thingName, stateObject)
{
	var stateDelta = stateObject.state, newValue, endpoint, oId, iId, rId

	for (endpoint in stateDelta) {
	for (oId in stateDelta[endpoint]) {
	for (iId in stateDelta[endpoint][oId]) {
	for (rId in stateDelta[endpoint][oId][iId]) {
		// get new value from delta message
		newValue = stateDelta[endpoint][oId][iId][rId]

		if (!stateNew[endpoint]) {
			console.error('GW: Can not find this Node-%s in stateNew.', endpoint)
			return
		}

		// update stateNew
		stateNew[endpoint][oId][iId][rId] = newValue

		endpoint = endpoint.toString()
		oId = oId.toString()
		iId = iId.toString()
		rId = rId.toString()
		newValue = newValue.toString()

		// must send "1"/"0" to node ,not "true" or "false"
		if (newValue == 'true') {
			newValue = '1'
		} else {
			newValue = '0'
		}

		// send state changed to Node
		console.log('\nGW: Send state changed to Node.')
		var url, UIChanged = false

		// remap LwM2M Object Id to coap url
		if (endpoint == cfgCoap.nodeLamp) {
			switch (oId) {
			case cfgObjectId.oIdRlamp:
				url = cfgCoap.Rlamp
				coapServer.sendToNode(lnAddr, nodePort, url, newValue)
				sendToApp(url, newValue)

				// update all app UI
				sendToUI(cfgCoap.nodeLamp, url, newValue)
				break
			default:
				console.error('Err: Bad Object oId')
				return
			}
		} else {
			console.error('Err: Bad Object endpoint.')
			return
		}
	}}}}
}

// receive PUT message from Web UI
function WSMessageHandle(message)
{
	if (message.type === 'utf8') {
		var msg = message.utf8Data
		console.log('\n\nGW: Received package: ' + msg)

		// get package "{}" means the UI is start running, need to get all state - stateNew
		if (msg == '{}') {
			wsServer.send(stateNew)          // send stateNew to UI
			state = utils.deepCopy(stateNew) // update state
			console.log('GW: UI is start running.')
		} else {
			var stateNew = JSON.parse(msg)
			for (var key in stateNew) {
				// get package "desired" means the UI has changed
				if (key == 'desired') {
					console.log('GW: UI status changed.')
					// deal with the delta message from UI
					deltaFromUI(null, {state: stateNew[key]})
				} else {
					console.error("GW: Can't recieved reported.")
				}
			}
		}
	} else {
		console.error('GW: Unknow message type.')
	}
}

// send state changed to UI
function sendStateToUI(stateNew)
{
	if (stateNew !== undefined) {
		console.log("\nGW: Send state changed to UI.")
		console.log("\tstate changed : " + JSON.stringify(stateNew))

		wsServer.send(stateNew)          //send to UI
		state = utils.deepCopy(stateNew) //update state
	}
}

function sendToUI(nodeName, url, val)
{
	var endpoint = nodeName
	var oId, iId, rId

	// remap coap url to LwM2M Object Id
	switch(url){
	case cfgCoap.Rbtemp:
		oId = cfgObjectId.oIdRbtemp
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRbtemp
		//temperature format: 370
		//transfer it to 37.0'C
		val = parseInt(val) / 10.0
		break
	case cfgCoap.Rhrate:
		oId = cfgObjectId.oIdRhrate
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRbtemp
		val = parseInt(val)
		break
	case cfgCoap.Rstate:
		oId = cfgObjectId.oIdRstate
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRstate
		val = parseInt(val)
		break
	case cfgCoap.Rmotion:
		oId = cfgObjectId.oIdRmotion
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRmotion
		val = parseInt(val)
		break
	case cfgCoap.Rwhrate:
		oId = cfgObjectId.oIdRwhrate
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRwhrate
		val = utils.transferSI2SB(val)
		break
	case cfgCoap.Rwbtemp:
		oId = cfgObjectId.oIdRwbtemp
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRwbtemp
		val = utils.transferSI2SB(val)
		break
	case cfgCoap.Rwdownward:
		oId = cfgObjectId.oIdRwdownward
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRwdownward
		val = utils.transferSI2SB(val)
		break
	case cfgCoap.Rawake:
		oId = cfgObjectId.oIdRawake
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRawake
		val = utils.transferSI2SB(val)
		break
	case cfgCoap.Rlamp:
		oId = cfgObjectId.oIdRlamp
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdRlamp
		val = utils.transferSI2B(val)
		break
	default:
		console.error('Err: Bad url')
		return
	}

	stateNew[endpoint][oId][iId][rId] = val
	
	if (stateNew !== undefined) {
		console.log("\nGW: Send state changed to UI.")
		console.log("\tstate changed : " + JSON.stringify(stateNew))

		wsServer.send(stateNew)          //send to UI
		state = utils.deepCopy(stateNew) //update state
	}
}

/******************** Commands **************************/
function cmdShowState()
{
	console.log('stateNew:'+ JSON.stringify(stateNew))
	console.log('\nstate:' + JSON.stringify(state))
	console.log('\nstateApp:'+ JSON.stringify(stateApp))
}

function cmdSendToNode(commands)
{
	var nodeName = commands[0]
	var nodeAddr
	var url = commands[1]
	var val = commands[2]

	switch (nodeName) {
	case cfgCoap.nodeLamp:
		nodeName = cfgCoap.nodeLamp
		nodeAddr = lnAddr

		if (url == cfgCoap.Rlamp) {
			coapServer.sendToNode(nodeAddr, nodePort, url, val)
			sendToUI(nodeName, url, val)
			sendToApp(url, val)

		}
		break
	default:
		console.log('Err: Bad nodeName or url.')
		return
	}
}

function cmdResetNodes(commands)
{
	coapServer.sendToNode(wnAddr, nodePort, cfgCoap.lockSta, cfgCoap.valOff)
	sendToUI(cfgCoap.nodeWearable, cfgCoap.lockSta, cfgCoap.valOff)

	coapServer.sendToNode(lnAddr, nodePort, cfgCoap.lightSta, cfgCoap.valOff)
	sendToUI(cfgCoap.nodeLamp, cfgCoap.lightSta, cfgCoap.valOff)
}

// Voice/TCP server
function cmdSendToVoice(commands)
{
	var key = commands[0]
	var val = commands[1]

	switch (key) {
	case cfgTCP.Ralarm:
		tcpClient.send(key, val)
		break
	default:
		console.log('Err: Bad key.')
		return
	}
}

function cmdConnectToVoice(commands)
{
	tcpClient.start(cfgTCP.voiceIP, cfgTCP.voicePort, TCPClientMSGHandle)
}

function cmdExit(commands)
{
	process.exit();
}

const commands = {
	'l': { //list
		parameters: [],
		description: '\tList all the resource in state and stateNew.',
		handler: cmdShowState
	},
	'sn': { // send to Thread Nodes
		// sn ln lamp 1
		parameters: ['nodeName', 'url', 'value'],
		description: '\tSend CoAP PUT message to Lamp Node',
		handler: cmdSendToNode
	},
	'st': { // send to Voice(TCP server)
		// st alarm 1
		parameters: ['key', 'value'],
		description: '\tSend data to Voice(TCP server)',
		handler: cmdSendToVoice
	},
	'c': {  // connect to Voice(TCP server)
		parameters: [],
		description: '\tConnect to Voice(TCP server)',
		handler: cmdConnectToVoice
	},
	'r': { // reset
		parameters: [],
		description: '\tSend CoAP PUT message to reset frontdoor and livingroom',
		handler: cmdResetNodes
	},
	'q': { // exit
		parameters: [],
		description: '\tExit',
		handler: cmdExit
	}
}
/******************** Commands **************************/

/********************   Main   **************************/
// iBaby-Robot Gateway starting:
// Http : Listening at port 8080
// coapServer: Listening on [::1 : 5683]
// Websocket : Listening at port 3001
// tcpServer : Listening on [127.0.0.1:6666]
// GW> 
console.log('iBaby-Robot Gateway starting:')

stateInit()
coapServer.serverStart(coapMessageHandle)
httpServer.start()
wsServer.start(WSMessageHandle)
tcpServer.start(cfgTCP.ip, cfgTCP.port, TCPServerMSGHandle)
tcpClient.start(cfgTCP.voiceIP, cfgTCP.voicePort, TCPClientMSGHandle)

clUtils.initialize(commands, 'GW> ')
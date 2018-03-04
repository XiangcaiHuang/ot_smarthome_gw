/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the 
	OpenThread Application Gateway.
--------------------------------------------- */
const coap     = require('./coap')
    , cfgCoap  = require('./config').coap
    , wsServer = require('./webSocketServer')
    , utils    = require('./utils')
    , cfgObjectId = require('./config').ObjectId
    , clUtils     = require('command-node')
    , httpServer  = require('./httpServer')

var   stateNew = require('./state').stateNew
    , state    = require('./state').state

// for simulated nodes
// var   wnAddr   = cfgCoap.wnAddr
//     , lnAddr   = cfgCoap.lnAddr
//     , nodePort = cfgCoap.defaultPort

// for virtual nodes (NodeJs)
var   wnAddr   = cfgCoap.localAddr
    , lnAddr   = cfgCoap.localAddr
    , nodePort = cfgCoap.nodePort


// must initialize the stateNew or it happen error
function stateInit()
{
	stateNew = {
		"wn":{
			"3303":{"0":{"5700":0    }},// btemp
			"3346":{"0":{"5700":0    }},// hrate

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
		val = obj[item].toString()
		
		switch(item.toString()){
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

		stateNew[nodeName][oId][iId][rId] = val
	}

	sendToUI(stateNew)
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
		console.log('GW: Send state changed to Node.')
		var url, UIChanged = false

		// remap LwM2M Object Id to coap url
		if (endpoint == cfgCoap.nodeLamp) {
			switch (oId) {
			case cfgObjectId.oIdRlamp:
				url = cfgCoap.Rlamp
				coap.sendToNode(lnAddr, nodePort, url, newValue)

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
function sendToUI(stateNew)
{
	if (stateNew !== undefined) {
		console.log("GW: Send state changed to UI.")
		console.log("\tstate changed : " + JSON.stringify(stateNew))

		wsServer.send(stateNew)          //send to UI
		state = utils.deepCopy(stateNew) //update state
	}
}

/******************** Commands **************************/
function cmdShowState()
{
	console.log('stateNew:')
	console.log(JSON.stringify(stateNew))
	console.log('\n')
	console.log('state:')
	console.log(JSON.stringify(state))
}

function cmdSendToNode(commands)
{
	var nodeName = commands[0]
	var nodeAddr
	var url = commands[1]
	var val = commands[2]

	switch (nodeName) {
	case 'wn':
		nodeName = cfgCoap.nodeWearable
		nodeAddr = wnAddr
		break
	case 'ln':
		nodeName = cfgCoap.nodeLamp
		nodeAddr = lnAddr
		break
	default:
		console.log('Err: Bad nodeName.')
		return
	}

	coap.sendToNode(nodeAddr, nodePort, url, val)
	sendToUI(nodeName, url, val)
}

function cmdResetNodes(commands)
{
	coap.sendToNode(wnAddr, nodePort, cfgCoap.lockSta, cfgCoap.valOff)
	sendToUI(cfgCoap.nodeWearable, cfgCoap.lockSta, cfgCoap.valOff)

	coap.sendToNode(lnAddr, nodePort, cfgCoap.lightSta, cfgCoap.valOff)
	sendToUI(cfgCoap.nodeLamp, cfgCoap.lightSta, cfgCoap.valOff)
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
	's': { // send
		// s wn btemp 380
		// s ln lamp  0/1
		parameters: ['nodeName', 'url', 'value'],
		description: '\tSend CoAP PUT message to Node',
		handler: cmdSendToNode
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
console.log('iBaby-Robot Gateway starting:')

stateInit()
coap.serverStart(coapMessageHandle)
httpServer.start()
wsServer.start(WSMessageHandle)

clUtils.initialize(commands, 'GW> ')
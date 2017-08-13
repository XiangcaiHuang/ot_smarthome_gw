/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the 
	OpenThread Application Gateway.
--------------------------------------------- */
const coap    = require('./coap')
    , cfgCoap = require('./config').coap
    , cfgObjectId = require('./config').ObjectId
    , clUtils     = require('command-node')
    , httpServer  = require('./httpServer')
    , wsServer = require('./webSocketServer')
    , utils    = require('./utils')

var   stateNew = require('./state').stateNew
    , state    = require('./state').state


// must initialize the stateNew or it happen error
function stateInit()
{
	stateNew = {
		'frontdoor':{
			"3311":{"0":{"5850": false}} // 'lock_sta'
		},
		'livingroom':{
			"3311":{"0":{"5850": false}},// 'light_sta'
			"3303":{"0":{"5700": 0}}     // 'temp'
		}
	}
}

// receive PUT message from Thread Nodes
function coapMessageHandle(req, res)
{
	var method  = req.method.toString()
	var url     = req.url.split('/')[1].toString()
	var value   = req.payload.toString()

	console.log('\nRequest received:')
	console.log('\t method:  ' + method)
	console.log('\t url:     ' + url)
	console.log('\t payload: ' + value)

	if (method === 'PUT') {
		switch(url){
		case cfgCoap.lockSta:
			sendToUI(cfgCoap.nodeFrontdoor, cfgCoap.lockSta, value)
			break
		case cfgCoap.lightSta:
			sendToUI(cfgCoap.nodeLivingroom, cfgCoap.lightSta, value)
			break
		case cfgCoap.temp:
			sendToUI(cfgCoap.nodeLivingroom, cfgCoap.temp, value)
			break
		default:
			console.error('Err: Bad url.\r\n')
			break
		}
	}
	res.end('GW: Received.') // send response to client
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

		// remap Object Id to coap url
		if (endpoint == cfgCoap.nodeFrontdoor) {
			switch (oId) {
			case cfgObjectId.oIdLight:
				url = cfgCoap.lockSta
				coap.sendToNode(cfgCoap.frontdoorAddr, cfgCoap.nodePort, url, newValue)

				//update all app UI
				sendToUI(cfgCoap.nodeFrontdoor, url, newValue)
				break
			default:
				console.error('Err: Bad Object oId')
				return
			}
		} else if (endpoint == cfgCoap.nodeLivingroom) {
			switch (oId) {
			case cfgObjectId.oIdLight:
				url = cfgCoap.lightSta
				coap.sendToNode(cfgCoap.livingroomAddr, cfgCoap.nodePort, url, newValue)

				//update all app UI
				sendToUI(cfgCoap.nodeLivingroom, url, newValue)
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

		//get package "{}" means the UI is start running, need to get all state - stateNew
		if (msg == '{}') {
			wsServer.send(stateNew)          //send stateNew to UI
			state = utils.deepCopy(stateNew) //update state
			console.log('GW: UI is start running.')
		} else {
			var stateNew = JSON.parse(msg)
			for (var key in stateNew) {
				//get package "desired" means the UI has changed
				if (key == 'desired') {
					console.log('GW: UI status changed.')
					//deal with the delta message from UI
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
function sendToUI(nodeName, url, val)
{
	var endpoint = nodeName
	var oId, iId, rId

	// remap coap url to Object Id
	switch(url){
	case cfgCoap.lockSta:
	case cfgCoap.lightSta:
		oId = cfgObjectId.oIdLight
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdLight
		break
	case cfgCoap.temp:
		oId = cfgObjectId.oIdTemp
		iId = cfgObjectId.iId
		rId = cfgObjectId.rIdTemp
		break
	default:
		console.error('Err: Bad url')
		return
	}

	if (val == cfgCoap.valOn) {
		val = true
	} else if (val == cfgCoap.valOff) {
		val = false
	} else {
		val = parseInt(val)
	}
	stateNew[endpoint][oId][iId][rId] = val

	var stateChange = utils.getDifferent(stateNew, state)
	if (stateChange !== undefined) {
		console.log("GW: Send state changed to UI.")
		console.log("\tstate changed : " + JSON.stringify(stateChange))

		wsServer.send(stateChange)       //send to UI
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
	case 'f':
		nodeName = cfgCoap.nodeFrontdoor
		nodeAddr = cfgCoap.frontdoorAddr
		break
	case 'l':
		nodeName = cfgCoap.nodeLivingroom
		nodeAddr = cfgCoap.livingroomAddr
		break
	default:
		console.log('Err: Bad nodeName.')
		return
	}

	coap.sendToNode(nodeAddr, cfgCoap.nodePort, url, val)
	sendToUI(nodeName, url, val)
}

function cmdResetNodes(commands)
{
	coap.sendToNode(cfgCoap.frontdoorAddr, cfgCoap.nodePort, cfgCoap.lockSta, cfgCoap.valOff)
	sendToUI(cfgCoap.nodeFrontdoor, cfgCoap.lockSta, cfgCoap.valOff)

	coap.sendToNode(cfgCoap.livingroomAddr, cfgCoap.nodePort, cfgCoap.lightSta, cfgCoap.valOff)
	sendToUI(cfgCoap.nodeLivingroom, cfgCoap.lightSta, cfgCoap.valOff)
}

const commands = {
	'show': {
		parameters: [],
		description: '\tList all the resource in state and stateNew.',
		handler: cmdShowState
	},
	'send': { // like: send f/l lock_sta 0/1
		parameters: ['nodeName', 'url', 'value'],
		description: '\tSend CoAP PUT message to Node',
		handler: cmdSendToNode
	},
	'reset': {
		parameters: [],
		description: '\tSend CoAP PUT message to reset frontdoor and livingroom',
		handler: cmdResetNodes
	}
}
/******************** Commands **************************/

/********************   Main   **************************/
console.log('OT Gateway starting:')

stateInit()
coap.serverStart(coapMessageHandle)
httpServer.start()
wsServer.start(WSMessageHandle)

clUtils.initialize(commands, 'GW> ')
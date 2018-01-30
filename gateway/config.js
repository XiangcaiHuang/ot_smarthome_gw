/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief   configuration of OpenThread 
		Application Gateway components.
--------------------------------------------- */
var config = {}

// Configuration of the coap
//--------------------------------------------------

// Gateway's IPv6 address:
//      fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3

// Commands in simulated Nodes:
//      coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 lock_sta con 1

//      coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 light_sta con 0
//      coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 temp con 25

config.coap = {
	  gwAddr:         'fdde:ad00:beef:0:3b33:8a2f:8e4:67d3'  // Gateway's IPv6 address
	, wnAddr:         'fdde:ad00:beef:0:4f6e:7e53:67c8:f5b0' // Wearable node's IPv6 address
	, lnAddr:         'fdde:ad00:beef:0:4f6e:7e53:67c8:f5b0' // Lamp node's IPv6 address
	, localAddr:      '::1' // Localhost's IPv6 address
	, defaultPort:    5683
	, gwPort:         5683
	, nodePort:       5684  // use different port like 5684 if you are trying virtual nodes (NodeJs: vr_nodes.js)
	, nodeWearable:   'wn'  // Name of wearable node
	, nodeLamp:       'ln'  // Name of lamp node
	, Rbtemp:         'btemp' // Resources of wearable node
	, Rhrate:         'hrate'
	, Rstate:         'state'
	, Rmotion:        'motion'
	, Rwhrate:        'whrate'
	, Rwbtemp:        'wbtemp'
	, Rwdownward:     'wdownward'
	, Rawake:         'awake'
	, Rlamp:          'lamp' // Resources of lamp node
	, valOn:          '1'
	, valOff:         '0'
	, valDefault:     '0'
}

// Configuration of the Object Id
//--------------------------------------------------
config.ObjectId = {
	  oIdRbtemp:      '3303'
	, oIdRhrate:      '3346'
	, oIdRstate:      '3300'
	, oIdRmotion:     '3323'
	, oIdRwhrate:     '3338'
	, oIdRwbtemp:     '3339'
	, oIdRwdownward:  '3341'
	, oIdRawake:      '3342'
	, oIdRlamp:       '3311'
	, iId:            '0'
	, rIdRbtemp:      '5700'
	, rIdRhrate:      '5700'
	, rIdRstate:      '5700'
	, rIdRmotion:     '5700'
	, rIdRwhrate:     '5800'
	, rIdRwbtemp:     '5800'
	, rIdRwdownward:  '5800'
	, rIdRawake:      '5800'
	, rIdRlamp:       '5850'
}

// Configuration of the http server
//--------------------------------------------------
config.httpServer = {
	  port:   8080
	, UIPath: '.././freeboard'
}

// Configuration of the web socket server
//--------------------------------------------------
config.WebSocketServer = {
	port: 3001
}

module.exports = config


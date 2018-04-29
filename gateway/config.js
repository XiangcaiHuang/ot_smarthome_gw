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
	  nodePort    : 5684
	, gwPort      : 5683
	, defaultPort : 5683
	, localAddr   : '::1'

	// for simulated nodes
	// , wnAddr   : 'fdde:ad00:beef:0:4f6e:7e53:67c8:f5b0'
	// , lnAddr   : 'fdde:ad00:beef:0:12be:a2e8:4b1c:4d19'
	// , gwAddr   : 'fdde:ad00:beef:0:3b33:8a2f:8e4:67d3'

	// for virtual nodes (NodeJs)
	, wnAddr   : '::1'
	, lnAddr   : '::1'
	, gwAddr   : '::1'

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
	, Rco2:           'co2'
	, Rtvoc:          'tvoc'
	, Rch2o:          'ch2o'
	, Rpm2_5:         'pm2_5'
	, Rrh:            'rh'
	, Rtemp:          'temp'
	, Rpm10:          'pm10'
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

// Configuration of the TCP socket server
//--------------------------------------------------
config.tcp = {
	  ip:        "192.168.2.206"
	, port:       6666
	, serverIP:  "192.168.2.206"
	, serverPort: 8888
	, localhost: "127.0.0.1"
	
	, Ralarm: "alarm"
	, Rdirection: "direction"
	, Rmusic: "music"
}

module.exports = config


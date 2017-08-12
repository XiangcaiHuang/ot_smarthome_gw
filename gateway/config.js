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

// Node command:
//      coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 lock_btn con 1
//      coap put fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3 light_btn con 2

config.coap = {
        gwAddr:         'fdde:ba7a:b1e5:0:35d1:c886:ea1e:8bb3' // Gateway's IPv6 address
      , frontdoorAddr:  'fdde:ba7a:b1e5:0:d7a3:1de2:916f:8d50' // Frontdoor's IPv6 address
      , livingroomAddr: 'fdde:ba7a:b1e5:0:31a2:d832:9c48:59d5' // Livingroom's IPv6 address
      , localAddr: '::1' // Localhost's IPv6 address
      , nodePort:  5684
      , gwPort:    5683
      , nodeFrontdoor:  'frontdoor'
      , nodeLivingroom: 'livingroom'
      , lockSta:   'lock_sta'
      , lightSta:  'light_sta'
      , valOn:     'ON'
      , valOff:    'OFF'
}

// Configuration of the http server
//--------------------------------------------------
config.httpServer = {
        port:   80
      , UIPath: '.././freeboard'
}

// Configuration of the web socket server
//--------------------------------------------------
config.WebSocketServer = {
        port: 3001
}

module.exports = config


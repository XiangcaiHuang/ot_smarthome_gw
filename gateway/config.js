/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief   configuration of OpenThread 
    Application Gateway components.
--------------------------------------------- */
var config = {}

// Configuration of the http server
//--------------------------------------------------
config.httpServer = {
        port: 80
      , UIPath: '.././freeboard'
}

// Configuration of the web socket server
//--------------------------------------------------
config.WebSocketServer = {
        port: 3001
}

module.exports = config


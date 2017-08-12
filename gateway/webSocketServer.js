/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the web 
 	socket server.
--------------------------------------------- */
const WebSocketServer = require('websocket').server
    , http = require('http')
    , config = require('./config').WebSocketServer
    , clients = []

function start(handleMessage)
{
	var server = http.createServer(function(request, response) {
		console.log('\nReceived request for ' + request.url)
		response.writeHead(404)
		response.end()
	})

	server.listen(config.port, function() {
		console.log('\nWebsocket : Listening at port ' + config.port);
	})

	var wsServer = new WebSocketServer({
		httpServer: server,
		autoAcceptConnections: false
	})

	wsServer.on('request', function(request) {
		var newClient = request.accept(null, request.origin)
		clients.push(newClient);

		newClient.on('message', handleMessage)
		newClient.on('close', function(reasonCode, description) {
			console.log('\nFreeboard UI ' + newClient.remoteAddress + ' disconnected.')
			for (var key in clients) {
				if (clients[key] == newClient) {
					clients = clients.slice(0, key).concat(clients.slice(Number(key) + 1))
					break;
				}
			}
		})
	})
}

function send(state)
{
	for (var key in clients) {
		clients[key].sendUTF(JSON.stringify({state: {reported: state, desired: state}}))
	}
}

module.exports.start = start
module.exports.send = send
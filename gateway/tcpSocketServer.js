/* ------------------------------------------
LICENSE

 * \version 
 * \date    2018-1-19
 * \author  XiangCai Huang
 * \brief   the functions about the local socket server 
 *         used to communicate with TCP Socket Client.
--------------------------------------------- */
var net = require('net');

var serverSocket = null;

function start(serverIP, serverPort, handleMessage){
    //create a new server for socket client
    var server = net.createServer(function(socket) { 
        //'connection' listener
        serverSocket = socket;
        console.log("tcpServer : (App)Client on [" + socket.remoteAddress + ":" + socket.remotePort + "] connected");

        //emitted when data is received
        socket.on('data', handleMessage);

        //emitted when the other end of the socket sends a FIN packet
        socket.on('end', function() {
            console.log("tcpServer: (App)Client on [" + socket.remoteAddress + ":" + socket.remotePort + "] disconnected");
        });

        //emitted once the socket is fully closed
        socket.on('close', function(){
            socket.destroy();
            serverSocket = null;
            console.log("tcpServer: Socket for (App)client on [" + socket.remoteAddress + ":" + socket.remotePort + "] closed");
        });

        //emitted when an error occurs
        socket.on('error', function(error){
            // console.log(error);
        });
    });

    //'listening' listener
    server.listen(serverPort, serverIP, function() { 
        console.log("tcpServer: Listening on [" + serverIP + ":" + serverPort + "]");
    });
}

function send(message){
    if (serverSocket == null) {
        console.log("tcpServer: Send failed. (App)Client disconnected");
    }else{
        serverSocket.write(message);
    }
}

module.exports.start = start;
module.exports.send = send;
/* ------------------------------------------
LICENSE

 * \version 
 * \date    2018-1-19
 * \author  XiangCai Huang
 * \brief   the functions about the local socket server 
 *         used to communicate with TCP Socket Client.
--------------------------------------------- */
var net = require('net')

// for multiple clients
/***************************************************************************/
var server = net.createServer()
var clients = []

function start(serverIP, serverPort, handleMessage) {
    //'connection' listener
    server.on('connection', function(socket) {
        var clientIP = socket.remoteAddress
        var clientPort = socket.remotePort

        console.log("tcpServer : (App)Client on [" + clientIP + ":" + clientPort + "] connected")
        clients.push(socket)

        //emitted when data is received
        socket.on('data', handleMessage)

        //emitted when the other end of the socket sends a FIN packet
        socket.on('end', function() {
            console.log("tcpServer: (App)Client on [" + clientIP + ":" + clientPort + "] disconnected")
        })

        //emitted once the socket is fully closed
        socket.on('close', function(){
            console.log("tcpServer: Socket for (App)client on [" + clientIP + ":" + clientPort + "] closed")
            socket.destroy()
            socket = null
        })

        //emitted when an error occurs
        socket.on('error', function(error){
            // console.log(error)
        })
    })

    server.listen(serverPort, serverIP, function() { 
        console.log("tcpServer: Listening on [" + serverIP + ":" + serverPort + "]")
    })
}

function send(message){
    clients.forEach(function(client) {
        if (client == null) {
            console.log("tcpServer: Send failed. (App)Client disconnected")
        }else{
            client.write(message)
        }
    })
}
/***************************************************************************/


// for only single client
/***************************************************************************/
// var serverSocket = null

// function start(serverIP, serverPort, handleMessage){
//     //create a new server for socket client
//     var server = net.createServer(function(socket) { 
//         //'connection' listener
//         serverSocket = socket
//         console.log("tcpServer : (App)Client on [" + serverSocket.remoteAddress + ":" + serverSocket.remotePort + "] connected")

//         //emitted when data is received
//         serverSocket.on('data', handleMessage)

//         //emitted when the other end of the socket sends a FIN packet
//         serverSocket.on('end', function() {
//             console.log("tcpServer: (App)Client on [" + serverSocket.remoteAddress + ":" + serverSocket.remotePort + "] disconnected")
//         })

//         //emitted once the socket is fully closed
//         serverSocket.on('close', function(){
//             serverSocket.destroy()
//             serverSocket = null
//             console.log("tcpServer: Socket for (App)client on [" + serverSocket.remoteAddress + ":" + serverSocket.remotePort + "] closed")
//         })

//         //emitted when an error occurs
//         serverSocket.on('error', function(error){
//             // console.log(error)
//         })
//     })

//     //'listening' listener
//     server.listen(serverPort, serverIP, function() { 
//         console.log("tcpServer: Listening on [" + serverIP + ":" + serverPort + "]")
//     })
// }

// function send(message){
//     if (serverSocket == null) {
//         console.log("tcpServer: Send failed. (App)Client disconnected")
//     }else{
//         serverSocket.write(message)
//     }
// }
/***************************************************************************/

module.exports.start = start
module.exports.send = send
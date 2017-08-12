/* ------------------------------------------
LICENSE

 * \version 
 * \date    2017-8-12
 * \author  Xiangcai Huang
 * \brief	the functions about the 
 	http server.
--------------------------------------------- */
const http = require('http')
    , url = require('url')
    , fs = require('fs')
    , path = require('path')
    , mine = require('./type').types
    , config = require('./config').httpServer

var server = http.createServer(function (request, response)
{
	var pathname = url.parse(request.url).pathname

	if (pathname.slice(-1) === '/') {
		pathname = pathname + 'index-auto.html'
	}

	var realPath = path.join(config.UIPath, pathname)
	var ext = path.extname(realPath)
	ext = ext ? ext.slice(1) : 'unknown'

	fs.exists(realPath, function (exists) {
		if (!exists) {
			response.writeHead(404, {
				'Content-Type': 'text/plain'
			})

			response.write('This request URL'  + pathname + ' was not found on this server.')
			response.end()
		} else {
			fs.readFile(realPath, 'binary', function (err, file) {
				if (err) {
					response.writeHead(500, {
						'Content-Type': 'text/plain'
					})
					response.end(err)
				} else {
					var contentType = mine[ext] || 'text/plain';
					response.writeHead(200, {
						'Content-Type': contentType
					})
					response.write(file, 'binary')
					response.end()
				}
			})
		}
	})
})

function start(port)
{
	if(port == undefined)
		port = config.port
	server.listen(port)
	console.log("\nHttp : Listening at port " + port)
}

module.exports.start = start
var http = require('http');
var WebSocketServer = require('websocket').server;
var nodeStatic = require('node-static');
var wsServer;
var config = {
    PORT : 8888
}

var Controller = require('./app/Controller').Controller;
var file = new (nodeStatic.Server)('./../client/');

var server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response, function(err, res) {
            if (err) {
                console.error('[ERROR] ' + err.message);
                response.writeHead(err.status, err.headers);
                response.end();
            }});
    });
}).listen(config.PORT);

console.log('Listening on ' + config.PORT);

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    //TODO put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function(request) {
    var manager, connection, origin;

    origin = request.origin;
    if (!originIsAllowed(origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + origin + ' rejected.');
        return;
    }

    connection = request.accept('echo-protocol', origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        var data, type, mgrFunction;
        if (message.type === 'utf8') {
            data = JSON.parse(message.utf8Data);
            type = data.type;

            //get the manager and threat the message
            manager = Controller.getManager(type);
            //this closure returns the function of the manager to execute
            mgrFunction = manager.handleMessage(type);
            mgrFunction(data.data).then(function (result) {
                if(result.doBroadCasting) {
                    wsServer.broadcastUTF(JSON.stringify(result.data));
                } else {
                    connection.sendUTF(JSON.stringify(result.data));
                }
            });
        }
    });


    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

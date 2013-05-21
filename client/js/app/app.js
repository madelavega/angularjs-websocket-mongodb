var app = angular.module("app", []);

app.factory("connector", function () {
    var that = this, connection = new WebSocket("ws://localhost:8888", 'echo-protocol'), suscriptors = [],
        handleMessage, fireEvent;

    connection.onopen = function () {
        console.log('Conexión con websocket abierta...');
        fireEvent('connectionopen');
    };

    connection.onclose = function () {
        console.log('Conexión con websocket CERRADA.');
    };


    handleMessage = function(e) {
        var data, evtName;
        data = JSON.parse(e.data);
        for (evtName in data) {
            if( data.hasOwnProperty( evtName ) ) {
                fireEvent(evtName, data[evtName]);
            }
        }
    }

    fireEvent = function (event) {
        var len = suscriptors.length, evtHandler,
            args = Array.prototype.slice.call(arguments);
        console.log('Lanzamos evento ' + event);
        while(len--) {
            evtHandler = suscriptors[len];
            if(typeof evtHandler[event] === 'function') {
                console.log('Ejecutamos ' + event);
                evtHandler[event].apply(that, args.slice(1, args.length));
            }
        }
    }

    connection.onmessage = handleMessage;

    return {
        sendMessage : function (messageType, data, fn) {
            var message = {
               type : messageType,
               data : data,
               fn : fn
            };
            connection.send(angular.toJson(message));
        },
        on : function (event, handler) {
            var evtHandler = {};
            console.log('Nos suscribimos al evento ' + event);
            evtHandler[event] = handler;
            suscriptors.push(evtHandler);
        }

    }
});
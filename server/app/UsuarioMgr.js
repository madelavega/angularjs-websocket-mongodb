var MongoConnector = require('./data/MongoConnector').MongoConnector;
var UsuarioDAO = require('./dao/UsuarioDAO').UsuarioDAO;

exports.UsuarioMgr = (function() {
    var that = this, eventHandlers = [], fireEvent, find, addUser, messages, on;

    fireEvent = function (event) {
        var len = eventHandlers.length, evtHandler,
            args = Array.prototype.slice.call(arguments);
        console.log('Lanzamos evento ' + event);
        while(len--) {
            evtHandler = eventHandlers[len];
            if(typeof evtHandler[event] !== undefined && typeof evtHandler[event] === 'function') {
                console.log('Ejecutamos ' + event);
                evtHandler[event].apply(this, args.slice(1, args.length));
            }
        }
    };

    addUser = function (data) {
        UsuarioDAO.addUser(data).then(function(savedData) {
            fireEvent('add',savedData);
        });
        /*
            //Mock data
            fireEvent('add',data);

        */
    }

    find = function (data) {
        /*var data = [{
            nombre : 'Manuel',
            apellido : 'de la Vega',
            nif: 75883347
        },{
            nombre : 'Inma',
            apellido : 'Huertas',
            nif: 45454545
        },{
            nombre : 'Ataulfo',
            apellido : 'Pérez',
            nif: 343435
        }];

        fireEvent('find',data);

        */

        MongoConnector.getConnection().then(function (client,db) {
            var usuarios = [];
            var stream  = client.collection('usuarios').find(
                //{ },
                //{ nombre: 1, apellido: 1, nif: 1, _id: 0 }
            ).stream();

            stream.on('data', function(item) {
                usuarios.push(item);
            });
            stream.on('end', function() {
                fireEvent('find',usuarios);
                client.close();
            });
        });
    };

    messages = {
        usuarioadded :  addUser,
        findusers   : find
    };

    handleMessage = function (messageType) {
        return function (data) {
            messages[messageType](data);
        }

    };

    on = function (event, handler) {
        var evtHandler = {}, len = eventHandlers.length;
        console.log('Nos suscribimos al evento ' + event);

        //TODO mejorar gestión eventos
        /*
            while(len--) {
                 if(typeof eventHandlers[len][event] === 'function') {
                    return;
                 }
            }
        */

        evtHandler[event] = handler;
        eventHandlers.push(evtHandler);
    }

    return {
        addUser : addUser,

        find : find,

        handleMessage: handleMessage,

        on : on

    }
})();
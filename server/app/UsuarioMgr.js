var UsuarioDAO = require('./dao/UsuarioDAO').UsuarioDAO;

exports.UsuarioMgr = (function() {
    var find, add, messages;


    add = function (connection, data) {
        UsuarioDAO.addUser(data).then(function(savedData) {
            connection.sendUTF(JSON.stringify({"usuarios/add" : savedData}));
        });
    }

    find = function (connection, data) {
        UsuarioDAO.find().then(function(usuarios) {
            connection.sendUTF(JSON.stringify({"usuarios/find" : usuarios}));
        });
    };

    messages = {
        add :  add,
        find   : find
    };

    handleMessage = function (messageType) {
        var message = messageType.split("/");
        message =  message[message.length-1];
        return function (connection, data) {
            messages[message](connection, data);
        }
    };

    return {
        add : add,
        find : find,
        handleMessage: handleMessage
    }
})();
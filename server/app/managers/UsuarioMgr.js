var UsuarioDAO = require('./../dao/UsuarioDAO').UsuarioDAO;
var Q = require('q');

exports.UsuarioMgr = (function() {
    var find, add, messages;


    add = function (data) {
        var d = Q.defer();
        UsuarioDAO.addUser(data).then(function(savedData) {
            d.resolve({"usuarios/add" : savedData});
        });
        return d.promise;
    }

    find = function (data) {
        var d = Q.defer();
        UsuarioDAO.find().then(function(usuarios) {
            d.resolve({"usuarios/find" : usuarios});
        });
        return d.promise;
    }


    messages = {
        add :  { fn : add, doBroadCasting : true},
        find   : { fn : find, doBroadCasting : false}
    }

    handleMessage = function (messageType) {
        var message = messageType.split("/");
        message =  message[message.length-1];
        return function (data) {
            var d = Q.defer(), doBroadCasting;
            doBroadCasting =  messages[message].doBroadCasting;
            messages[message].fn(data).then(function (result) {
                d.resolve({doBroadCasting : doBroadCasting, data : result});
            });
            return d.promise;
        }
    }

    return {
        add : add,
        find : find,
        handleMessage: handleMessage
    }
})();
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


    //contains the functions allowed and if they will do a broadcasting. All the functions declared in fn property
    //will be promises
    messages = {
        add :  { fn : add, doBroadCasting : true},
        find   : { fn : find, doBroadCasting : false}
    }

    handleMessage = function (messageType) {
        var message = messageType.split("/"), matchedProperty;
        message =  message[message.length-1];

        //return the closure to execute the manager method
        return function (data) {
            var d = Q.defer(), doBroadCasting;
            //the matched propertie in manager messages
            matchedProperty = messages[message];

            //check if it would be broadcasting when finish
            doBroadCasting =  matchedMessage.doBroadCasting;

            //the matched function will be execute with the data passed in the closure.
            matchedProperty.fn(data).then(function (result) {
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
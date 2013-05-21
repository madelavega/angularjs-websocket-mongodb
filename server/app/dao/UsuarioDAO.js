var MongoConnector = require('./../data/MongoConnector').MongoConnector;
var Q = require('q');

exports.UsuarioDAO = (function() {
    var find, addUser, doAddUser;

    doAddUser = function (client,data) {
        var d = Q.defer();
        client.collection('usuarios').insert(data,{multi:true},function(error) {
            if(error) {
                d.reject(error);
            } else {
                client.close();
                d.resolve(data);
            }
        });

        return d.promise;
    }

    addUser = function (data) {
        var d = Q.defer();
        console.log('Se añade el usuario ' + data.nombre);

        MongoConnector.getConnection()
        .then(function (client) {
                //importante devolver la función que contiene la promesa
                return doAddUser(client,data);
        })
        .then(function(savedData) {
                d.resolve(savedData);
        });

        return d.promise;
    };

    find = function (data) {
        MongoConnector.getConnection()
        .then(function (client) {
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


    return {
        addUser : addUser,

        find : find
    }
})();
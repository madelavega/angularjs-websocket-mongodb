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

    doFind = function (client) {
        var d = Q.defer(), usuarios, stream;
        usuarios = [];

        stream  = client.collection('usuarios').find(
            //TODO add filter parameters
            //{ },
            //{ nombre: 1, apellido: 1, nif: 1, _id: 0 }
        ).stream();

        stream.on('data', function(item) {
            usuarios.push(item);
        });
        stream.on('end', function() {
            client.close();
            d.resolve(usuarios);
        });

        return d.promise;
    }

    find = function () {
        var d = Q.defer();
        MongoConnector.getConnection()
            .then(doFind)
            .then(function(usuarios) {
                d.resolve(usuarios);
        });
        return d.promise;
    };

    return {
        addUser : addUser,

        find : find
    }
})();
var mongo = require('mongodb');
var Q = require('q');
var Server = mongo.Server;
var Db = mongo.Db;


var server = new Server('ds027348.mongolab.com', 27348, {auto_reconnect : true});
var db = new Db('madelavega', server);


exports.MongoConnector = {};

exports.MongoConnector.getConnection = function () {
    var d = Q.defer();
    /*

    //Con promesas evitamos tener que repetir la siguiente secuencia de callbacks

    db.open(function(err, client) {
        client.authenticate('madelavega', 'wstesting', function(err, success) {
            if(success){
                 client.collection('usuarios').insert(data,{multi:true},function(error) {
                     if(error) {

                     } else {
                        fireEvent('add',data);
                        client.close();
                     }
                 });
            }
        });
    });

    */

    //devolvemos una promesa, la que cuando se resuelva correctamente contendrá el cliente para realizar la sentencia
    //requerida
    this.open()
    .then(this.authenticate)
    .then(function (client) {
        d.resolve(client);
    });

    return d.promise;
}

exports.MongoConnector.authenticate = function (client) {
    var d = Q.defer();
    client.authenticate('madelavega', 'wstesting', function(err, success) {
        if(success) {
            d.resolve(client);
        } else {
            d.reject(err);
        }
    });
    return d.promise;
}

exports.MongoConnector.open = function () {
    var d = Q.defer();
    db.open(function (err, client) {
        if(err) {
            d.reject(err);
        } else {
            d.resolve(client);
        }
    });
    return d.promise;
}

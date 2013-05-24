var DbConfig = require("./../config/database.json"),
    mongo = require('mongodb'),
    Q = require('q'),
    Server,
    Db,
    server,
    db;

Server = mongo.Server;
Db = mongo.Db;


server = new Server(DbConfig.url, DbConfig.port, {auto_reconnect: true});
db = new Db(DbConfig.dbName, server);


exports.MongoConnector = {};

exports.MongoConnector.getConnection = function () {
    var d = Q.defer();
    /*

     //with promises, it will be avoided manage these callbacks

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

    this.open()
        .then(this.authenticate)
        .then(function (client) {
            d.resolve(client);
        });

    return d.promise;
};

exports.MongoConnector.authenticate = function (client) {
    var d = Q.defer();
    client.authenticate(DbConfig.user, DbConfig.password, function (err, success) {
        if (success) {
            d.resolve(client);
        } else {
            d.reject(err);
        }
    });
    return d.promise;
};

exports.MongoConnector.open = function () {
    var d = Q.defer();
    db.open(function (err, client) {
        if (err) {
            d.reject(err);
        } else {
            d.resolve(client);
        }
    });
    return d.promise;
}

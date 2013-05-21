var UsuarioMgr = require('./UsuarioMgr').UsuarioMgr;

exports.Controller = (function() {
    var getManager, managers;

    managers = {
        usuarios : UsuarioMgr
    };

    getManager = function (message) {
        var message = message.split("/"), manager;

        if(message.length > 1) {
            manager = managers[message[0]];
            if(manager) {
                return manager;
            }
        }
    }

    return {
        getManager : getManager
    }
})();
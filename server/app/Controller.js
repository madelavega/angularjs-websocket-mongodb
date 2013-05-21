exports.Controller = (function() {
    var getManager, managers = {}, manager, managerPathList,
        managerPath, managerType, path, splittedPath;

    //loading managers from app/config/managers.json
    managerPathList = require("./config/managers.json");
    for (managerType in managerPathList) {
        if(managerPathList.hasOwnProperty(managerType)) {
            path = "./managers/" + managerPathList[managerType];
            splittedPath = path.split("/");
            //managers must export an object with the same name of the file
            managers[managerType] = require(path)[splittedPath[splittedPath.length-1]];
        }
    }

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
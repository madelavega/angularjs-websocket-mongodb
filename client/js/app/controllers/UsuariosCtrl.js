var UsuariosCtrl = angular.module("app")
    .controller("UsuariosCtrl", ["$scope", "websocket", function ($scope, websocket) {
        "use strict";
        $scope.usuario = {};
        $scope.data = [];

        $scope.load = function () {
            console.log("buscamos usuarios...");
            websocket.sendMessage("usuarios/find", {});
        };

        $scope.reset = function () {
            $scope.usuario = angular.copy($scope.usuario);
        };

        $scope.save = function (usuario) {
            $scope.usuario = angular.copy(usuario);
            websocket.sendMessage("usuarios/add", usuario);
        };

        websocket.on("connectionopen", function () {
            $scope.load();

            websocket.on("usuarios/find", function (usuarios) {
                console.log("Recibimos usuarios...");
                $scope.data = usuarios;
                $scope.$apply();
            });

            websocket.on("usuarios/add", function (usuario) {
                $scope.$apply(function () {
                    $scope.data.push(usuario);
                });
            });
        });
    }]);
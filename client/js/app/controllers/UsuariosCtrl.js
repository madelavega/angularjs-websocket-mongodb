var UsuariosCtrl = app.controller("UsuariosCtrl",["$scope", "connector", function ($scope, connector) {

    $scope.usuario = {};
    $scope.data = [];

    $scope.load = function () {
        console.log('buscamos usuarios...');
        connector.sendMessage('usuarios/find',{});
    }

    $scope.reset = function() {
        $scope.usuario = angular.copy($scope.usuario);
    }

    $scope.save = function(usuario) {
        $scope.usuario = angular.copy(usuario);
        connector.sendMessage('usuarios/add',usuario);
    };

    connector.on('usuarios/find',function (usuarios) {
        console.log('Recibimos usuarios...');
        $scope.$apply(function () {
            $scope.data = usuarios;
        });
    });

    connector.on('usuarios/add',function (usuario) {
        $scope.$apply(function () {
            $scope.data.push(usuario);
        });
    });

    connector.on('connectionopen', function () {
        $scope.load();
    });
}]);
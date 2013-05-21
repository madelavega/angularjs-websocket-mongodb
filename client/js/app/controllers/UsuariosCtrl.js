var UsuariosCtrl = app.controller("UsuariosCtrl",["$scope", "connector", function ($scope, connector) {

    $scope.usuario = {};
    $scope.data = [];

   /*$scope.data = [{
        nombre : 'Manuel',
        apellido : 'de la Vega',
        nif: 75883347
    },{
        nombre : 'Inma',
        apellido : 'Huertas',
        nif: 45454545
    },{
        nombre : 'Ataulfo',
        apellido : 'Pérez',
        nif: 343435
    }]; */

    $scope.load = function () {
        console.log('buscamos usuarios...');
        connector.sendMessage('findusers',{});
    }

    $scope.reset = function() {
        $scope.usuario = angular.copy($scope.usuario);
    }

    $scope.save = function(usuario) {
        $scope.usuario = angular.copy(usuario);
        connector.sendMessage('usuarioadded',usuario);
    };

    connector.on('findusers',function (usuarios) {
        console.log('Recibimos usuarios...');
        $scope.$apply(function () {
            $scope.data = usuarios;
        });
    });

    connector.on('usuarioadded',function (usuario) {
        $scope.$apply(function () {
            $scope.data.push(usuario);
        });
    });

    connector.on('connectionopen', function () {
        $scope.load();
    });
}]);
'use strict';
angular.module('medeye.controllers')
    .controller('SvcCtrl', function (Auth, $routeParams, $rootScope, $location, $scope) {
        $scope.data = {};
        $scope.data.code = $routeParams.uuid;

        function processData(data) {
            if (data.success === true) {
                $rootScope.$broadcast('alert', data.message);
                $location.path('/');
            } else {
                $rootScope.$broadcast('alert', data.message);
                $location.path('/');
            }
        }

        Auth.activate($scope.data)
            .success(function (res) {
                processData(res);
            })
            .error(function (res) {
                processData(res);
            });
    });
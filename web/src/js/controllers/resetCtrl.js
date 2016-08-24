'use strict';
angular.module('medeye.controllers')
    .controller('ResetCtrl', function (Auth, $routeParams, $rootScope, $location, $scope) {
        $scope.data = {};
        var id = $routeParams.id;
        if ($routeParams.id) {
            $scope.restore = false;
        } else {
            $scope.restore = true;
        }
        $scope.sent = false;

        $scope.showSent = $scope.restore && $scope.sent ? true : false;
        $scope.showStart = $scope.restore && !$scope.sent ? true : false;
        $scope.showReset = !$scope.restore ? true : false;

        function processData(data) {
            $scope.sent = true;
            $scope.showSent = $scope.restore && $scope.sent ? true : false;
            $scope.showStart = $scope.restore && !$scope.sent ? true : false;
            $scope.showReset = !$scope.restore ? true : false;
            $rootScope.$broadcast('alert', data.message);
        }

        $scope.restore = function () {
            if ($scope.data.email && $scope.data.email.length > 0) {
                Auth.restore($scope.data)
                    .success(function (res) {
                        processData(res);
                    })
                    .error(function (res) {
                        processData(res);
                    });
            } else {
                $rootScope.$broadcast('alert', 'email_not_valid');
            }
        };

        $scope.reset = function () {
            if (id && id.length > 0) {
                $scope.data.code = id;
                Auth.reset($scope.data)
                    .success(function (res) {
                        $rootScope.$broadcast('alert', res.message);
                        $location.path('/');
                    })
                    .error(function (res) {
                        $rootScope.$broadcast('alert', res.message);
                        $location.path('/');
                    });
            } else {
                $rootScope.$broadcast('alert', 'reset_code_not_valid');
            }
        };

    });
'use strict';
angular.module('videochat.controllers')
    .controller('AuthCtrl', ['$scope', '$rootScope', '$location', '$window', 'Auth',
        function ($scope, $rootScope, $location, $window, Auth) {
            $scope.loginData = {};
            $scope.registerData = {};

            $scope.doLogin = function () {
                Auth.login($scope.loginData)
                    .success(function (res) {
                        if (res.success) {
                            $window.localStorage.setItem('name', res.name);
                            $rootScope.logged = true;
                        } else { console.log(res.message); }
                    });
                $location.path('/');
            };

            $scope.doRegister = function () {
                Auth.register($scope.registerData)
                    .success(function (res) {
                        if (res.success) {
                            $window.localStorage.setItem('name', res.name);
                            $rootScope.logged = true;
                        } else { console.log(res.message); }
                    });
                $location.path('/');
            };

        }]);
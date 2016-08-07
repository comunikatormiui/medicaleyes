'use strict';
angular.module('medeye.controllers')
    .controller('AuthCtrl', ['$scope', '$rootScope', '$window', '$location', 'Auth',
        function ($scope, $rootScope, $window, $location, Auth) {
            $scope.loginData = {};
            $scope.signupData = {};
            $rootScope.processing = false;

            function processData(data) {
                $rootScope.processing = false;
                if (data.success === true) {
                    $window.localStorage.setItem('token', data.token);
                    $window.localStorage.setItem('email', data.email);
                    $scope.getMe();
                    var returnPath = $rootScope.returnPath;
                    if (returnPath) {
                        $location.path(decodeURI(returnPath));
                    } else {
                        $location.path('/');
                    }
                } else {
                    $rootScope.$broadcast('alert', data.message);
                }
            }

            $scope.getMe = function () {
                $rootScope.processing = true;
                Auth.me()
                    .success(function (res) {
                        $rootScope.processing = false;
                        $window.localStorage.setItem('id', res.id);
                    })
                    .error(function () {
                        return;
                    });
            };

            $scope.doLogin = function () {
                $rootScope.processing = true;
                Auth.login($scope.loginData)
                    .success(function (res) {
                        processData(res);
                    })
                    .error(function (res) {
                        processData(res);
                    });
            };

            $scope.doSignup = function () {
                $rootScope.processing = true;
                Auth.signup($scope.signupData)
                    .success(function (res) {
                        processData(res);
                    })
                    .error(function (res) {
                        processData(res);
                    });
            };
        }]);
'use strict';
angular.module('medeye.controllers')
    .controller('AccCtrl', ['$scope', '$rootScope', '$location', '$window', '$mdSidenav', 'Auth',
        function ($scope, $rootScope, $location, $window, $mdSidenav, Auth) {
            $scope.isAdmin = false;
            $scope.isPartner = false;
            $scope.isUser = false;

            $rootScope.processing = false;

            $rootScope.$on('$routeChangeStart', function () {
                if ($rootScope.logged) {
                    setRole();
                    $scope.getMe();
                }
            });

            function setRole() {
                if ($window.localStorage.getItem('role') === 'admin') {
                    $scope.isAdmin = true;
                } else if ($window.localStorage.getItem('role') === 'partner') {
                    $scope.isPartner = true;
                } else {
                    $scope.isUser = true;
                }
            }

            function processData(data) {
                $rootScope.processing = false;
                if (data.success === true) {
                    $scope.getMe();
                } else {
                    $rootScope.$broadcast('alert', data.message);
                }
            }

            $scope.getMe = function () {
                $rootScope.processing = true;
                Auth.me()
                    .success(function (res) {
                        $rootScope.processing = false;
                        $window.localStorage.setItem('token', data.token);
                        $window.localStorage.setItem('email', data.email);
                        $window.localStorage.setItem('role', data.role);
                        $window.localStorage.setItem('id', res.id);
                    })
                    .error(function () {
                        return;
                    });
            };
        }]);
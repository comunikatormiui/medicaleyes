'use strict';
angular.module('medeye.controllers', ['medeye.services'])
    .controller('AppCtrl', ['$scope', '$rootScope', '$location', '$mdToast', 'Auth',
        function ($scope, $rootScope, $location, $mdToast, Auth) {
            $rootScope.processing = false;

            $rootScope.$on('$routeChangeStart', function () {
                if (Auth.logged()) { $rootScope.logged = true; } else { $rootScope.logged = false; }
            });

            $scope.doLogout = function () {
                Auth.logout();
                $rootScope.logged = false;
                $location.path('/');
            };

            $scope.showLogin = function () {
                $location.path('login');
            };
            $scope.showSignup = function () {
                $location.path('signup');
            };

            var last = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };
            $scope.toastPosition = angular.extend({}, last);
            $scope.getToastPosition = function () {
                sanitizePosition();
                return Object.keys($scope.toastPosition)
                    .filter(function (pos) { return $scope.toastPosition[pos]; })
                    .join(' ');
            };
            function sanitizePosition() {
                var current = $scope.toastPosition;
                if (current.bottom && last.top) { current.top = false; }
                if (current.top && last.bottom) { current.bottom = false; }
                if (current.right && last.left) { current.left = false; }
                if (current.left && last.right) { current.right = false; }
                last = angular.extend({}, current);
            }
            $rootScope.$on('alert', function (event, data) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(data)
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                );
            });
        }]);

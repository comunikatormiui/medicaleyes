'use strict';
angular.module('videochat.controllers', ['videochat.services'])
    .controller('AppCtrl', ['Room', '$mdToast', '$scope', '$rootScope', '$route', '$location',
        function (Room, $mdToast, $scope, $rootScope, $route, $location) {
            $scope.createRoom = function () {
                Room.getRoom()
                    .then(function (r) {
                        $location.path('room/' + r.id);
                    });
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
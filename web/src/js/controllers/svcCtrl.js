'use strict';
angular.module('medeye.controllers')
    .controller('SvcCtrl', function (Auth, $routeParams, $rootScope, $location, $scope) {
        $scope.data = {};
        $scope.data.code = $routeParams.uuid;

        $rootScope.inviteCode = $routeParams.invite;
        if ($rootScope.inviteCode) {
            $location.path('signup');
        } else {
            Auth.activate($scope.data)
                .success(function (res) {
                    processData(res);
                })
                .error(function (res) {
                    processData(res);
                });
        }
        function processData(data) {
            if (data && data.success === true) {
                $rootScope.$broadcast('alert', data.message);
                $location.path('/');
            } else {
                $rootScope.$broadcast('alert', data.message);
                $location.path('/');
            }
        }
    });
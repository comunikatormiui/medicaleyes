'use strict';
angular.module('videochat.services', [])
    .factory('Room', function ($q, $http, $apiEndpoint, $rootScope) {
        var roomFactory = {};
        roomFactory.getRoom = function (id) {
            var d = $q.defer();
            $http.get($apiEndpoint.url + 'api/room')
                .success(function (r) {
                    d.resolve(r);
                })
                .error(function (e) {
                    $rootScope.$broadcast('alert', e.message);
                });
            return d.promise;
        };
        return roomFactory;
    });
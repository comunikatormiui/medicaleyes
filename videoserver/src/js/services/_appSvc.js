'use strict';
angular.module('videochat.services', [])
    .factory('Room', function ($q, $http, $apiEndpoint, $rootScope) {
        var roomFactory = {};
        roomFactory.getRoom = function (id) {
            var d = $q.defer();
            $http.get($apiEndpoint.url + 'api/room')
                .success(function (r) { d.resolve(r); })
                .error(function (e) { $rootScope.$broadcast('alert', e.message); });
            return d.promise;
        };
        return roomFactory;
    })
    .factory('Files', function ($q, $http, $apiEndpoint, $rootScope) {
        var filesFactory = {};
        filesFactory.getFiles = function (path) {
            var d = $q.defer();
            $http.get($apiEndpoint.url + 'api/room/files/' + path)
                .success(function (r) { d.resolve(r); })
                .error(function (e) { $rootScope.$broadcast('alert', e.message); });
            return d.promise;
        };
        filesFactory.stream = function (fileOpts) {
            var d = $q.defer();
            $http.get($apiEndpoint.url + 'api/room/getStream/' + fileOpts.path + '/' + fileOpts.filename,
                { headers: { 'Range': 'bytes=0-1000000' } })
                .success(function (r) { d.resolve(r); })
                .error(function (e) { $rootScope.$broadcast('alert', e); });
            return d.promise;
        };
        filesFactory.download = function (fileOpts) {
            var d = $q.defer();
            $http.post($apiEndpoint.url + 'api/room/download', fileOpts)
                .success(function (r) { d.resolve(r); })
                .error(function (e) { $rootScope.$broadcast('alert', e); });
            return d.promise;
        };
        return filesFactory;
    });
'use strict';
angular.module('medeye.services')
    .factory('Invite', ['$http', '$apiEndpoint', '$window',
        function ($http, $apiEndpoint, $window) {
            var invFactory = {};
            invFactory.create = function (data) {
                return $http.post($apiEndpoint.url + 'invite', data);
            };
            invFactory.get = function (id) {
                return $http.get($apiEndpoint.url + 'invite/' + id);
            };
            invFactory.list = function () {
                return $http.get($apiEndpoint.url + 'invite/list');
            };
            invFactory.remove = function (id) {
                return $http.delete($apiEndpoint.url + 'invite/' + id);
            };
            return invFactory;
        }]);
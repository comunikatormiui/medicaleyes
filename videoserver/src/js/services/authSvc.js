'use strict';
angular.module('videochat.services')
    .factory('Auth', ['$http', '$apiEndpoint', '$window',
        function ($http, $apiEndpoint, $window) {
            var authFactory = {};
            authFactory.register = function (data) {
                return $http.post($apiEndpoint.url + 'account', data);
            };
            authFactory.login = function (data) {
                return $http.post($apiEndpoint.url + 'account/login', data);
            };
            authFactory.list = function () {
                return $http.get($apiEndpoint.url + 'account/list');
            };
            authFactory.get = function (name) {
                return $http.get($apiEndpoint.url + 'account/get/' + name);
            };
            authFactory.logout = function () {
                $window.localStorage.removeItem('name');
            };
            authFactory.logged = function () {
                var name = $window.localStorage.getItem('name');
                return name && name != 'undefined' ? true : false;
            };
            return authFactory;
        }]);
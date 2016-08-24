'use strict';
angular.module('medeye.services')
    .factory('Auth', ['$http', '$apiEndpoint', '$window', function ($http, $apiEndpoint, $window) {
        var authFactory = {};
        authFactory.signup = function (data) {
            return $http.post($apiEndpoint.url + 'auth/signup', data);
        };
        authFactory.login = function (data) {
            return $http.post($apiEndpoint.url + 'auth/login', data);
        };
        authFactory.me = function () {
            return $http.get($apiEndpoint.url + 'auth/me');
        };
        authFactory.activate = function (data) {
            return $http.post($apiEndpoint.url + 'auth/activate', data);
        };
        authFactory.restore = function (data) {
            return $http.post($apiEndpoint.url + 'auth/restore', data);
        };
        authFactory.reset = function (data) {
            return $http.post($apiEndpoint.url + 'auth/reset', data);
        };
        authFactory.logout = function () {
            $window.localStorage.removeItem('email');
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('role');
            $window.localStorage.removeItem('id');
        };
        authFactory.logged = function () {
            var token = $window.localStorage.getItem('token');
            if (token && token != 'undefined') { return true; } else { return false; }
        };
        return authFactory;
    }]);
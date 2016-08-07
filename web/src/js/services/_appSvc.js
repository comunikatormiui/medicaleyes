'use strict';
angular.module('medeye.services', [])
    .factory('HttpRequestInterceptor', function ($q, $location, $window) {
        var authInterceptorFactory = {};
        authInterceptorFactory.request = function (config) {
            var token = $window.localStorage.getItem('token');
            if (token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        };
        authInterceptorFactory.responseError = function (response) {
            if (response.status == 403) { $location.path('login'); }
            return $q.reject(response);
        };
        return authInterceptorFactory;
    });
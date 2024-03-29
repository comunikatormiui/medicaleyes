'use strict';
angular.module('medeye', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngMessages', 'ngAria', 'ngAnimate', 'ngSanitize',
    'flow', 'pascalprecht.translate', 'medeye.services', 'medeye.controllers'])
    .constant('$apiEndpoint', {
        url: 'https://localhost:3001/api/v1/'
    })
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey', {
                'default': '800',
                'hue-1': '400',
                'hue-2': '600',
                'hue-3': 'A100'
            })
            .accentPalette('orange');
        $mdThemingProvider.theme('second')
            .primaryPalette('blue-grey', {
                'default': 'A400',
                'hue-1': 'A100',
                'hue-2': 'A200',
                'hue-3': 'A100'
            })
            .accentPalette('orange');
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('HttpRequestInterceptor');
    })
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/body.html',
                controller: 'AppCtrl'
            })
            .when('/cabinet', {
                templateUrl: 'views/cabinet.html',
                controller: 'CabCtrl'
            })
            .when('/account', {
                templateUrl: 'views/account.html',
                controller: 'AccCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'AuthCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'AuthCtrl'
            })
            .when('/reset/:id?', {
                templateUrl: 'views/reset.html',
                controller: 'ResetCtrl'
            })
            .when('/activate/:uuid', {
                template: ' ',
                controller: 'SvcCtrl'
            })
            .when('/invite/:invite', {
                template: ' ',
                controller: 'SvcCtrl'
            })
            .when('/404', {
                templateUrl: 'views/404.html'
            })
            .otherwise({
                redirectTo: '404'
            });
        $locationProvider.html5Mode(true);
    });
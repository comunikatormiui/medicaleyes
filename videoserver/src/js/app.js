'use strict';
angular.module('videochat', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngMessages', 'ngAria', 'ngAnimate',
    'videochat.services', 'videochat.controllers', 'videochat.directives'])
    .constant('$apiEndpoint', {
        url: 'http://localhost:3000/api/v1/'
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
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/body.html',
                controller: 'AppCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'AuthCtrl'
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'AuthCtrl'
            })
            .when('/rooms/:id?', {
                templateUrl: 'views/rooms.html',
                controller: 'RoomsCtrl'
            })
            .otherwise({
                redirectTo: 'login'
            });
        $locationProvider.html5Mode(true);
    });
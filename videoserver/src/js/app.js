'use strict';
angular.module('videochat', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngMessages', 'ngAria', 'ngAnimate',
    'videochat.services', 'videochat.controllers'])
    .constant('$apiEndpoint', {
        url: 'https://52.183.42.1/'
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
            .when('/room/:id?', {
                templateUrl: 'views/room.html',
                controller: 'RoomCtrl'
            })
            .when('/files', {
                templateUrl: 'views/files.html',
                controller: 'FilesCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    });
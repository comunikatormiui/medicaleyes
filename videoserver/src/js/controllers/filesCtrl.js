'use strict';
angular.module('videochat.controllers')
    .controller('FilesCtrl', ['Files', '$scope', '$rootScope', '$route', '$location', '$apiEndpoint',
        function (Files, $scope, $rootScope, $route, $location, $apiEndpoint) {
            $scope.roomPath = {};
            $scope.fileOpts = {};
            $scope.files = [];
            $scope.getFiles = function () {
                Files.getFiles($scope.roomPath.path)
                    .then(function (r) {
                        _.each(r.files, function (file) {
                            $scope.files.push(file);
                        });
                    });
            };
            $scope.play = function (fileName) {
                $scope.fileOpts.filename = fileName;
                $scope.fileOpts.path = $scope.roomPath.path;
                var q1 = document.querySelector('#files');
                var e1 = angular.element(q1);
                e1.attr('src', $apiEndpoint.url + 'api/room/getStream/' + $scope.roomPath.path + '/' + fileName);
                Files.stream($scope.fileOpts);
            };
            $scope.download = function (fileName) {
                $scope.fileOpts.filename = fileName;
                $scope.fileOpts.path = $scope.roomPath.path;
                Files.download($scope.fileOpts);
            };
        }]);
'use strict';
angular.module('videochat.controllers')
    .controller('FilesCtrl', ['Files', '$scope', '$rootScope', '$route', '$location',
        function (Files, $scope, $rootScope, $route, $location) {
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
                Files.stream($scope.fileOpts)
                    .then(function (r) {
                        var q1 = document.querySelector('#files');
                        var e1 = angular.element(q1);
                        e1.attr('src', fileName);
                    });
            };
            $scope.download = function (fileName) {
                $scope.fileOpts.filename = fileName;
                $scope.fileOpts.path = $scope.roomPath.path;
                Files.download($scope.fileOpts);
            };
        }]);
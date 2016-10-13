'use strict';
angular.module('videochat.directives', [])
    .directive('videoPlayer', function ($sce) {
        return {
            template: '<video ng-src="" autoplay></video>',
            restrict: 'E',
            replace: true,
            scope: {
                vidSrc: '@'
            },
            link: function (scope) {
                scope.trustSrc = function () {
                    if (!scope.vidSrc) {
                        return undefined;
                    }
                    return $sce.trustAsResourceUrl(scope.vidSrc);
                };
            }
        };
    });
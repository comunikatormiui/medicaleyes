'use strict';
angular.module('medeye.controllers')
    .controller('AccCtrl', ['$scope', '$rootScope', '$location', '$window', '$mdSidenav', 'Auth', 'Invite',
        function ($scope, $rootScope, $location, $window, $mdSidenav, Auth, Invite) {
            $rootScope.isAdmin = $rootScope.isAdmin ? $rootScope.isAdmin : false;
            $rootScope.isPartner = $rootScope.isPartner ? $rootScope.isPartner : false;
            $rootScope.isUser = $rootScope.isUser ? $rootScope.isUser : false;

            $rootScope.processing = false;

            $rootScope.$on('$routeChangeStart', function () {
                if ($rootScope.logged) {
                    $scope.getMe();
                    setRole();
                }
            });

            function setRole() {
                if ($window.localStorage.getItem('role') === 'admin') {
                    $rootScope.isAdmin = true;
                } else if ($window.localStorage.getItem('role') === 'partner') {
                    $rootScope.isPartner = true;
                } else {
                    $rootScope.isUser = true;
                }
            }

            function processData(data) {
                $rootScope.processing = false;
                if (data && data.success === true) {
                } else {
                    $rootScope.$broadcast('alert', data.message);
                }
            }

            $scope.sendInvite = function () {
                $rootScope.processing = true;
                Invite.create($scope.inviteData)
                    .success(function (res) {
                        $rootScope.processing = false;
                        processData(res);
                    })
                    .error(function () {
                        return;
                    });
            };

            $scope.getInvite = function (id) {
                $rootScope.processing = true;
                Invite.get(id)
                    .success(function (res) {
                        $rootScope.processing = false;
                        processData(res);
                    })
                    .error(function () {
                        return;
                    });
            };

            $scope.myInvites = function () {
                $rootScope.processing = true;
                Invite.list()
                    .success(function (res) {
                        $rootScope.processing = false;
                        processData(res);
                    })
                    .error(function () {
                        return;
                    });
            };

            $scope.removeInvite = function (id) {
                $rootScope.processing = true;
                Invite.remove(id)
                    .success(function (res) {
                        $rootScope.processing = false;
                        processData(res);
                    })
                    .error(function () {
                        return;
                    });
            };

            $scope.getMe = function () {
                $rootScope.processing = true;
                Auth.me()
                    .success(function (res) {
                        $rootScope.processing = false;
                        $window.localStorage.setItem('token', data.token);
                        $window.localStorage.setItem('email', data.email);
                        $window.localStorage.setItem('role', data.role);
                        $window.localStorage.setItem('id', res.id);
                    })
                    .error(function () {
                        return;
                    });
            };
        }]);
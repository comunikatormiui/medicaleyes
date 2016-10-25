'use strict';
angular.module('videochat.controllers')
    .controller('RoomCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$apiEndpoint',
        function ($scope, $rootScope, $location, $routeParams, $apiEndpoint) {
            $scope.inRoom = false;
            var roomId, stream, pc;
            var socket = io.connect($apiEndpoint.url);
            var rtcConstraints = {
                'OfferToReceiveAudio': true,
                'OfferToReceiveVideo': true
            };
            var selfCandidates = [];

            if ($routeParams.id) {
                roomId = $routeParams.id;
                $scope.inRoom = true;
                checkRoom();
            }

            function checkRoom() {
                socket.emit('check', { id: roomId });
            }

            function scid() {
                socket.emit('join', { id: roomId });
            }

            function iceHandle(event) {
                if (event.candidate) {
                    socket.emit('message', {
                        type: 'candidate',
                        id: roomId,
                        candidate: event.candidate
                    });
                    selfCandidates.push(event.candidate.candidate);
                } else {
                }
            }

            function createRTCOffer() {
                pc.createOffer(
                    function (sessionDescription) {
                        pc.setLocalDescription(sessionDescription)
                            .then(function () {
                                var message = { id: roomId, sessionDescription: sessionDescription, type: 'offer' };
                                socket.emit('message', message);
                            }, function (e) {
                                return;
                            });
                    },
                    function (e) {
                        return;
                    },
                    rtcConstraints
                );
            }

            function buildInitialVideo() {
                var q1 = document.querySelector('#local');
                var e1 = angular.element(q1);
                e1.attr('src', URL.createObjectURL(stream));
                var q2 = document.querySelector('#remote');
                var e2 = angular.element(q2);
                e2.attr('src', URL.createObjectURL(stream));
            }

            function buildRemoteVideo(evt) {
                var qr = document.querySelector('#remote');
                var el = angular.element(qr);
                el.attr('src', URL.createObjectURL(evt.stream));
            }

            function createPeerConnection() {
                var rtcConfig = {
                    iceServers: [
                        { urls: ['turn:video.medykt.ru'] },
                    ]
                };
                pc = new RTCPeerConnection(rtcConfig);
                pc.addStream(stream);
                pc.onicecandidate = iceHandle;
                pc.onaddstream = buildRemoteVideo;
            }

            function init() {
                var config = { video: true, audio: true };
                navigator.mediaDevices.getUserMedia(config)
                    .then(function (s) {
                        stream = s;
                        buildInitialVideo();
                        createPeerConnection();
                        createRTCOffer();
                    }, function (e) {
                        $rootScope.$broadcast('alert', e);
                    });
            }

            socket.on('message', function (data) {
                var message = data;
                if (message.id === roomId) {
                    if (message.type === 'offer') {
                        pc.setRemoteDescription(new RTCSessionDescription(message.sessionDescription))
                            .then(function () {
                                pc.createAnswer()
                                    .then(function (sessionDescription) {
                                        pc.setLocalDescription(sessionDescription);
                                        var msg = { id: roomId, sessionDescription: sessionDescription, type: 'answer' };
                                        socket.emit('message', msg);
                                    });
                            }, function (e) {
                                $rootScope.$broadcast('alert', e);
                            });
                    } else if (message.type === 'answer') {
                        pc.setRemoteDescription(new RTCSessionDescription(message.sessionDescription))
                            .then(function () {
                            }, function (e) {
                            });
                    } else if (message.type === 'candidate') {
                        if (selfCandidates.indexOf(message.candidate.candidate) === -1) {
                            setTimeout(function () {
                                pc.addIceCandidate(new RTCIceCandidate(message.candidate));
                            }, 1000);
                        }
                    }
                }
            });


            socket.on('accept', function (data) {
                if (data.id === roomId) {
                    init();
                }
            });

            socket.on('reject', function (data) {
                if (data.id === roomId) {
                    $rootScope.$broadcast('alert', 'The room is full');
                    $location.path('/');
                }
            });

            socket.on('roomchecked', function (data) {
                if (data.id === roomId) {
                    if (data.success) { scid(); }
                    else { $rootScope.$broadcast('alert', 'The room is not ready'); $location.path('/'); }
                }
            });
        }]);
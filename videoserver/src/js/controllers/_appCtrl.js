'use strict';
angular.module('videochat.controllers', ['videochat.services'])
    .controller('AppCtrl', ['$scope', '$rootScope', '$sce', '$route', 'Auth', 'Video',
        function ($scope, $rootScope, $sce, $route, Auth, Video) {
            $rootScope.$on('$routeChangeStart', function () {
                $rootScope.logged = Auth.logged();
            });

            $scope.doLogout = function () {
                Auth.logout();
                $route.reload();
            };

            var videoCounter = 0;
            var connection;
            var recorder;
            $scope.recording = false;
            $scope.startRecord = function () {
                $scope.recording = true;
                connection.send(JSON.stringify({ type: 'start-recording' }));
            };
            $scope.stopRecord = function () {
                $scope.recording = false;
                connection.send(JSON.stringify({ type: 'stop-recording' }));
            };
            function getRecorder() {
                var options = { mimeType: 'video/webm' };
                recorder = new MediaRecorder(stream, options);
                recorder.ondataavailable = videoDataHandler;
            }
            function videoDataHandler(event) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(event.data);
                videoCounter++;
                reader.onloadend = function (event) {
                    connection.send(reader.result);
                };
            }
            function getWebSocket() {
                var websocketEndpoint = 'ws://localhost:3000';
                connection = new WebSocket(websocketEndpoint);
                connection.binaryType = 'arraybuffer';
                connection.onmessage = function (message) {
                    handleSocketMessage(message);
                };
            }
            function handleSocketMessage(message) {
                message = JSON.parse(message.data);
                /*if (!offerCreated && message.type === 'offer') {
                    console.log('got offer');
                    var sessionDescription = new window.mozRTCSessionDescription(message.sessionDescription);
                    pc.setRemoteDescription(sessionDescription, createRTCAnswer, function (error) {
                        console.log('cannot set remote description');
                    });
                } else if (offerCreated && message.type === 'answer') {
                    console.log('got answer');
                    var sessionDescription = new window.mozRTCSessionDescription(message.sessionDescription);
                    pc.setRemoteDescription(sessionDescription, function () {
                        console.log('created remote description');
                    }, function (error) {
                        console.log(error);
                        console.log('cannot set remote description');
                    });
                } else if (message.type === 'candidate') {
                    if (selfCandidates.indexOf(message.candidate) === -1) {
                        var candidate = new window.mozRTCIceCandidate({
                            sdpMLineIndex: message.label,
                            candidate: message.candidate
                        });
                        pc.addIceCandidate(candidate);
                    }
                } else */
                if (message.type === 'start-recording') {
                    console.log('starting to record');
                    recorder.start(3000);
                } else if (message.type === 'stop-recording') {
                    console.log('stop recording');
                    recorder.stop();
                } else if (message.part === videoCounter && recorder.state === 'inactive') {
                    console.log('sending over complete video message');
                    connection.send(JSON.stringify({
                        completedVideo: message.fileName
                    }));
                }
            }

            if (!window.RTCPeerConnection || !navigator.getUserMedia) {
                $scope.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
                return;
            }

            var stream;

            Video.get()
                .then(function (s) {
                    stream = s;
                    getWebSocket();
                    getRecorder();
                    stream = URL.createObjectURL(stream);
                }, function () {
                    console.log('no permission');
                });

            $scope.getLocalVideo = function () {
                return $sce.trustAsResourceUrl(stream);
            };
        }]);
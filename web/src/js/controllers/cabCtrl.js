'use strict';
angular.module('medeye.controllers')
    .controller('CabCtrl', ['$scope', '$rootScope', '$location', 'Auth',
        function ($scope, $rootScope, $location, Auth) {
            $rootScope.processing = false;
            $scope.patListEmpty = true;
            $scope.notAnonymized = true;
            $scope.patsList = [];
            if (!$rootScope.logged) {
                $location.path('/');
                $rootScope.$broadcast('alert', 'Log in, please');
            }
            $scope.clear = function ($flow) {
                $scope.patListEmpty = true;
                $scope.notAnonymized = true;
                $scope.patsList = [];
                $flow.cancel();
            };
            $scope.anonymize = function () {
                _.each($scope.patsList, function (item) {
                    item.patientName = null;
                    item.centerName = null;
                    item.centerAddress = null;
                    item.scanDate = null;
                });
                $scope.notAnonymized = false;
            };
            $scope.filesAdded = function (event, $flow) {
                $rootScope.processing = true;
                $scope.notAnonymized = true;
                event.preventDefault();
                _.each($flow.files, function (item) {
                    var reader = new FileReader();
                    reader.onload = function (file) {
                        var arrayBuffer = reader.result;
                        var temp = new Uint8Array(arrayBuffer);
                        try {
                            var dataSet = dicomParser.parseDicom(temp);

                            // print the patient's name
                            var patientName = dataSet.string('x00100010');
                            var centerName = dataSet.string('x00080080');
                            var centerAddress = dataSet.string('x00080081');
                            var scanDate = dataSet.string('x00400244');

                            var st = scanDate;
                            var pattern = /(\d{4})(\d{2})(\d{2})/;

                            var patItem = {
                                fileName: item.name,
                                patientName: patientName,
                                centerName: centerName,
                                centerAddress: centerAddress,
                                scanDate: new Date(st.replace(pattern, '$1-$2-$3'))
                            };
                            $scope.patsList.push(patItem);

                            // Get the pixel data element and calculate the SHA1 hash for its data
                            /*var pixelData = dataSet.elements.x7fe00010;
                            var pixelDataBuffer = dicomParser.sharedCopy(dicomFileAsBuffer, pixelData.dataOffset, pixelData.length);
         
                            if (pixelData.encapsulatedPixelData) {
                                var imageFrame = dicomParser.readEncapsulatedPixelData(dataSet, pixelData, 0);
                                if (pixelData.basicOffsetTable.length) {
                                    imageFrame = dicomParser.readEncapsulatedImageFrame(dataSet, pixelData, 0);
                                } else {
                                    imageFrame = dicomParser.readEncapsulatedPixelDataFromFragments(dataSet, pixelData, 0, pixelData.fragments.length);
                                }
                            }*/
                        } catch (e) { }
                    };
                    reader.readAsArrayBuffer(item.file);
                    $scope.patListEmpty = false;
                    $rootScope.processing = false;
                });
            };
        }]);
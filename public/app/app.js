angular.module('app', ['ngCroppie'])
    .controller('appCtrl', function ($scope, $window) {

        $scope.inputImage = '';
        $scope.mode = 'horizontal';
        $scope.files = [];
        var token = 'cbx9XfVKlgAAAAAAAAAB-ATHeVYL3cjCTX1mTt0Ce8J4cI3ahLqFnGioE6Sb7q36';

        var handleFileSelect = function (evt) {
            $scope.status = "Processing!";
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            $scope.fileName = file.name;
            
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.inputImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };

        $scope.upload = function () {
            $scope.status = "Processing!";
            var file = dataURLtoFile($scope['outputImage' + $scope.mode], $scope.fileName);
            var xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (xhr.status === 200) {
                    $scope.status = "Uploaded!";
                }
                else {
                    var errorMessage = xhr.response || 'Unable to upload file';
                    $scope.status = "Failed!";
                    console.log(errorMessage);
                }
            };

            xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
                path: '/' + $scope.mode + file.name,
                mode: 'add',
                autorename: true,
                mute: false
            }));

            xhr.send(file);

        };

        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        $scope.getList = function () {
            var xhr1 = new XMLHttpRequest();
            xhr1.onload = function () {
                if (xhr1.status === 200) {
                    var fileInfo = JSON.parse(xhr1.response);
                    $scope.$apply(function () {
                        $scope.files = fileInfo.entries;
                    });
                }
                else {
                    var errorMessage = xhr1.response || 'Unable to get data from server';
                    console.log(errorMessage);
                }
            };

            xhr1.open('POST', 'https://api.dropboxapi.com/2/files/list_folder');
            xhr1.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr1.setRequestHeader('Content-Type', 'application/json');
            xhr1.send(JSON.stringify({
                "path": "",
                "include_media_info": false,
                "include_deleted": false,
                "include_has_explicit_shared_members": false
            }));
        };
        //get the list for the first time

        $scope.getList();

        $scope.displayImage = function (path) {
            var xhr1 = new XMLHttpRequest();
            xhr1.responseType = 'blob';
            xhr1.onreadystatechange = function () {
                if (xhr1.readyState === 4 && xhr1.status === 200) {
                    var imageUrl = (window.URL || window.webkitURL).createObjectURL(xhr1.response);

                    // display, assuming <img id="image"> somewhere
                    document.getElementById('image').src = imageUrl;
                } else {
                    var errorMessage = xhr1.response || 'Unable to get data from server';
                    console.log(errorMessage);
                }
            };
            xhr1.open('POST', 'https://content.dropboxapi.com/2/files/download');
            xhr1.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr1.setRequestHeader('Dropbox-API-Arg', JSON.stringify({ "path": path }));

            xhr1.send();
        };

        function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }

    })





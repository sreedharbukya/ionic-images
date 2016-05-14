imageapp.factory('ImageFactory', ["$cordovaCamera", "$q", "$cordovaFile",
    function ($cordovaCamera, $q, $cordovaFile) {
        function makeid() {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }


        function optionsForType(type) {
            var source;
            var orientation = false;
            switch (type) {
                case 0:
                    source = Camera.PictureSourceType.CAMERA;
                    orientation = true;
                    break;
                case 1:
                    source = Camera.PictureSourceType.PHOTOLIBRARY;
                    break;
            }
            return {
                quality : 50,
                correctOrientation : orientation,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: source,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
        }

        function prepare_duplicate_of_file(imageUrl) {
            return $q(function (resolve, reject) {
                var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
                var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
                var newName = makeid() + name;

                $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName).then(function (info) {
                    console.log("Success in cordova copy file" + info);
                    resolve(cordova.file.dataDirectory + newName);
                }, function (error) {
                    console.log("Error .. " + error);
                    reject(error);
                });
            })
        }

        function takePicture(type) {
            return $q(function (resolve, reject) {
                var options = optionsForType(type);
                $cordovaCamera.getPicture(options).then(function (imageUrl) {
                    console.log(typeof (imageUrl));
                    console.log(imageUrl);
                    var isAndroid = ionic.Platform.isAndroid();
                    if (options.sourceType == 0) {
                        if (isAndroid) {
                            var imagePath = window.FilePath.resolveNativePath(imageUrl, function (resolved_file_path) {
                                console.log("Resolving native file path" + resolved_file_path);
                                prepare_duplicate_of_file(resolved_file_path).then(function (imageFile) {
                                    resolve(imageFile);
                                }, function (error) {
                                    console.error("Resolving native file path" + error);
                                    console.log(error);
                                    reject(error);
                                });
                            }, function (error) {
                                console.error("Resolving native file path" + error);
                                reject(error);
                            })
                        }
                        else {
                            prepare_duplicate_of_file(imageUrl).then(function (imageFile) {
                                resolve(imageFile);
                            }, function (error) {
                                console.error("Resolving native file path" + error);
                                reject(error)
                            });
                        }
                    }
                    else if (options.sourceType == 1) {
                        prepare_duplicate_of_file(imageUrl).then(function (imageFile) {
                            resolve(imageFile);
                        }, function (error) {
                            reject(error)
                        });
                    }
                });
            })
        }

        return {
            handleMediaDialog: takePicture
        }
    }]);

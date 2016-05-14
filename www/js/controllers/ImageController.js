imageapp.controller('ImageController', ["$scope", "ImageFactory", "$ionicActionSheet",
  function ($scope, ImageFactory, $ionicActionSheet) {

    $scope.images = [];

    $scope.deleteAll = function(){
      // todo: extend to delete all images in which are stored under app data files
      $scope.images = [];
    };

    $scope.addImages = function () {
      $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: 'Take photo'},
          {text: 'Photo from library'}
        ],
        titleText: 'Add images',
        cancelText: 'Cancel',
        buttonClicked: function (index) {
          $scope.capturePicture(index);
        }
      });

    };

    $scope.capturePicture = function (type) {
      $scope.hideSheet();
      ImageFactory.handleMediaDialog(type).then(function (ImageURI) {
        $scope.images.push(ImageURI);

      }, function(error){
         console.log(error);
         console.log("Unable to capture/select Image")
      })
    }
  }]);

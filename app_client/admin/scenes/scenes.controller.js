angular
.module('app')
.controller('adminscenesCtrl', adminscenesCtrl)
.controller('addChaacterCtrl', addChaacterCtrl);


function adminscenesCtrl ($scope,$http,allScenes,$routeParams,Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $scope.scenes = allScenes;
   $scope.sceneBtn ="New scene";

  $scope.newScene = function(){
     var uploadUrl = "/api/add-scene/"+$routeParams.id;
     $scope.sceneBtn ="Loading...";
     $http.post(uploadUrl,'',{
        headers: {
         Authorization: 'Bearer '+ authentication.getToken()
        }
     }).then(function (response) {
        $scope.scenes.push(response.data);
        toastr.success('Scene added successfully');
        $scope.sceneBtn ="New scene";
    }, function (error) {
        $scope.sceneBtn ="New scene";
        toastr.error(error.data.message);
    });
  };

   $scope.newCharacter = function () {
        var dialog = ngDialog.open({ 
          template: 'addChaacter', 
          controller: 'addChaacterCtrl',
          className: 'ngdialog-theme-default',
          closeByDocument: false,
          closeByEscape: false,
          resolve : {
            StoryId : function () {
              return $routeParams.id;
            }
          }
        });
    };

}

function addChaacterCtrl ($scope,StoryId,$http,$routeParams,Class,authentication,$location,ngDialog,toastr) {
    $scope.btn ="Add character";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="Adding...";
        var uploadUrl = "/api/add-character/"+StoryId;
       $http.post(uploadUrl, $scope.character, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
           $scope.closeThisDialog($scope.character.name);
          toastr.success('Character added successfully');
          $scope.btn ="Add character";
      }, function (error) {
          $scope.btn ="Add character";
          toastr.error(error.data.message);
      });
    };
}


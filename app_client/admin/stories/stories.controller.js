angular
.module('app')
.controller('adminstoriesCtrl', adminstoriesCtrl)
.controller('addStoryCtrl', addStoryCtrl)

function adminstoriesCtrl ($scope,allStories,Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);
   $scope.stories = allStories;


    $scope.add = function () {
        var dialog = ngDialog.open({ 
          template: 'addstory', 
          controller: 'addStoryCtrl',
          className: 'ngdialog-theme-default',
          closeByDocument: false,
          closeByEscape: false,
        });

        dialog.closePromise.then(function (data) {
            if(data.value != '$closeButton'){
               $scope.stories.push(data.value);
            }
        });
    };

  
}

function addStoryCtrl ($scope,authentication,$location,$http,ngDialog,toastr) {
   $scope.story ={};
    $scope.btn ="Add story";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="Adding...";
       var uploadUrl = "/api/add-story";
       var fd = new FormData();
       for(var key in $scope.story)
          fd.append(key, $scope.story[key]);
       $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {
          'Content-Type': undefined,
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          toastr.success('Story added successfully');
          $scope.btn ="Add story";
      }, function (error) {
          $scope.btn ="Add story";
          toastr.error(error.data.message);
      });
    };
}
angular
.module('app')
.controller('adminsceneCtrl', adminsceneCtrl)
.controller('addConversationCtrl', addConversationCtrl);



function adminsceneCtrl ($scope,$http,allConversations,Class,authentication,$location,ngDialog,toastr) {
   var myClass = {bg : false};
   Class.setmyClass(myClass);

   $scope.conversations = allConversations.conversation;
   console.log($scope.conversations);
   $scope.characters = allConversations.scene.story.characters;

 $scope.newCharacter = function () {
      var dialog = ngDialog.open({ 
        template: 'addChaacter', 
        controller: 'addChaacterCtrl',
        className: 'ngdialog-theme-default',
        closeByDocument: false,
        closeByEscape: false,
        resolve : {
          StoryId : function () {
            return allConversations.scene.story._id;
          }
        }
      });

      dialog.closePromise.then(function (data) {
          if(data.value != '$closeButton'){
             $scope.characters.push(data.value);
          }
      });
  };

  $scope.newConversation = function () {
      var dialog = ngDialog.open({ 
        template: 'addConversation', 
        controller: 'addConversationCtrl',
        className: 'ngdialog-theme-default',
        closeByDocument: false,
        closeByEscape: false,
        resolve : {
            Characters : function () {
              return $scope.characters;
            }
          }
      });


      dialog.closePromise.then(function (data) {
          if(data.value != '$closeButton'){
             $scope.conversations.push(data.value);
          }
      });
  };

}

function addConversationCtrl ($scope,Characters,$http,$routeParams,authentication,$location,ngDialog,toastr) {
    $scope.conversation ={};
    $scope.characters = Characters;
    $scope.btn ="Add Conversation";
    $scope.submitted = false;
    $scope.add = function(valid){
     if(!valid){
        $scope.submitted = true;
        return;
      }
      $scope.btn ="Adding...";
       var uploadUrl = "/api/add-conversation/"+$routeParams.id;
       $http.post(uploadUrl, $scope.conversation, {
          headers: {
           Authorization: 'Bearer '+ authentication.getToken()
          }
       }).then(function (response) {
          $scope.closeThisDialog(response.data);
          toastr.success('Conversation added successfully');
          $scope.btn ="Add Conversation";
      }, function (error) {
          $scope.btn ="Add Conversation";
          toastr.error(error.data.message);
      });
    };
}


angular
.module('app')
.controller('adminregisterCtrl', adminregisterCtrl);

function adminregisterCtrl ($scope,Class,authentication,$location, toastr) {
	 var myClass = {bg : true};
   Class.setmyClass(myClass);

   $scope.credentials = {
    email : "",
		password : ""
	};

  $scope.btn = "Create Account";

 function register(){
      authentication
      .adminRegister($scope.credentials)
          .then(function (response) {
              authentication.saveToken(response.data.token);
              toastr.success('You have successfully registered and logged in');
              $location.path('/dashboard');
          }, function (error) {
               $scope.btn = "Create Account";
               toastr.error(error.data.message);
          });
  }
	$scope.onSubmit = function(isvalid){
    if(!isvalid){
        $scope.submitted = true;
        return;
    }
    $scope.btn = "Loading...";
		register();
	};
  $scope.clear = function(){
   
  };
}
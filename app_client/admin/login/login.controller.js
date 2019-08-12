angular
.module('app')
.controller('adminloginCtrl', adminloginCtrl);

function adminloginCtrl ($scope,authentication,Class,$location, toastr) {
	 var myClass = {bg : true};
   Class.setmyClass(myClass);

   $scope.credentials = {
		email : "",
		password : ""
	};
  $scope.btn = "Login to your account";

 function userlogin(){
      authentication
      .adminlogin($scope.credentials)
          .then(function (response) {
              authentication.saveToken(response.data.token);
              toastr.success('You have successfully logged in');
              $location.path('/dashboard');
          }, function (error) {
              $scope.btn = "Login to your account";
              toastr.error(error.data.message);
          });
  }
	$scope.onSubmit = function(){
     $scope.btn = "Loading...";
		 userlogin();
	};
  $scope.clear = function(){
   
  };
}
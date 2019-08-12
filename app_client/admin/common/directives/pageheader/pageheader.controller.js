angular
.module('app')
.controller('pageheaderCtrl', pageheaderCtrl);

function pageheaderCtrl ($scope,$routeParams,$route,$location,authentication) {
	
	$scope.logout = function() {
	    authentication.adminlogout();
	    $location.path('/admin');
	    $route.reload();
	  };

}
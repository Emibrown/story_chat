angular
.module('app')
.controller('sidebarCtrl', sidebarCtrl);

function sidebarCtrl ($scope,$routeParams,$route,$location,authentication) {

	$scope.logout = function() {
	    authentication.adminlogout();
	    $location.path('/');
	    $route.reload();
	  };

	
}
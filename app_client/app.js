angular.module('app', ['ngRoute','ngProgress','ngAnimate','ngSanitize','ngDialog','ngFileUpload','toastr']);

function config ($routeProvider, $locationProvider, $httpProvider,toastrConfig) {
	
	$routeProvider
	.when('/admin', {
		templateUrl: 'admin/login/login.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin/stories');   
	            }else{
	                       
	            }
	        }
	    },
		controller: 'adminloginCtrl'
	})
	.when('/admin/register', {
		templateUrl: 'admin/register/register.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin/stories');   
	            }else{
	                       
	            }
	        }
	    },
		controller: 'adminregisterCtrl'
	})
	.when('/admin/stories', {
		templateUrl: 'admin/stories/stories.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allStories": function(authentication){
	               return authentication
				      .getStories()
				      .then(function (response) {
				      	return response.data;
				      }, function (error) {
				    	return;
				      });
            }
	    },
		controller: 'adminstoriesCtrl'
	})
	.when('/admin/stories/:id', {
		templateUrl: 'admin/scenes/scenes.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allScenes": function($route,authentication){
	               return authentication
				      .getScenes($route.current.params.id)
				      .then(function (response) {
				      	return response.data;
				      }, function (error) {
				    	return;
				      });
            }
	    },
		controller: 'adminscenesCtrl'
	})
	.when('/admin/scenes/:id', {
		templateUrl: 'admin/scene/scene.view.html',
		resolve:{
	        "check":function(authentication,$location){   //function to be resolved, accessFac and $location Injected
	            if(!authentication.isAdminLoggedIn()){    //check if the user has permission -- This happens before the page loads
	                $location.path('/admin');
	            }
	        },
	        "allConversations": function($route,authentication){
               return authentication
			      .getConversations($route.current.params.id)
			      .then(function (response) {
			      	return response.data;
			      }, function (error) {
			    	return;
			      });
            },
	    },
		controller: 'adminsceneCtrl'
	})
	.otherwise({redirectTo: '/admin'});
	
	$locationProvider.html5Mode(true);

	angular.extend(toastrConfig, {
	    autoDismiss: true,
	    containerId: 'toast-container',
	    maxOpened: 0,    
	    newestOnTop: true,
	    positionClass: 'toast-top-right',
	    preventDuplicates: false,
	    preventOpenDuplicates: true,
	    target: 'body'
	  });
}

angular
.module('app')
.factory('Class', function(){
  var myClass = {};
  return {
    myClass: function() { return myClass; },
    setmyClass: function(newClass) { myClass = newClass; }
  };
});

angular
.module('app')
.controller('mainCtrl', mainCtrl);

function mainCtrl ($scope,Class) {
	$scope.myClass = Class;
};

angular
.module('app')
.config(['$routeProvider', '$locationProvider', '$httpProvider','toastrConfig', config]);

angular.module('app').run(function ($rootScope, ngProgressFactory) { 

    // first create instance when app starts
    $rootScope.progressbar = ngProgressFactory.createInstance();
    $rootScope.progressbar.setHeight('1px');
    $rootScope.progressbar.setColor('blue');
    

    $rootScope.$on("$routeChangeStart", function () {
        $rootScope.progressbar.start();
    });

    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.progressbar.complete();
    });
});


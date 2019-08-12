angular
.module('app')
.service('authentication', authentication);

function authentication ($http,$window) {



   var saveToken = function (token) {
		$window.localStorage['chat-token'] = token;
	};

	var getToken = function () {
		return $window.localStorage['chat-token'];
	};

	var adminlogin = function(user) {
		return $http.post('/api/login', user);
	};

	var adminRegister = function(user) {
		return $http.post('/api/register', user);
	};

	var adminlogout = function() {
		$window.localStorage.removeItem('chat-token');
	};

	var getStories = function(){
		return $http.get('/api/stories',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getScenes = function(id){
		return $http.get('/api/stories/'+id+'/scenes',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getConversations = function(id){
		return $http.get('/api/scenes/'+id+'/conversations',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var isAdminLoggedIn = function() {
		var token = getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	var currentAdmin = function() {
		if(isAdminLoggedIn()){
			var token = getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return {
				id: payload._id,
				email : payload.email
			};
		}
	};

	return {
		saveToken : saveToken,
		getToken : getToken,
		adminlogin: adminlogin,
		adminlogout: adminlogout,
		isAdminLoggedIn: isAdminLoggedIn,
		currentAdmin: currentAdmin,
		adminRegister: adminRegister,
		getStories: getStories,
		getScenes: getScenes,
		getConversations: getConversations
	};
}
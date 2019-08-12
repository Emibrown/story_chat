angular
.module('app')
.service('authentication', authentication);

function authentication ($http,$window) {



   var saveToken = function (token) {
		$window.localStorage['tnx-token'] = token;
	};

	var getToken = function () {
		return $window.localStorage['tnx-token'];
	};

	var userlogin = function(user) {
		return $http.post('/api/login', user);
	};

	var userRegister = function(user) {
		return $http.post('/api/register', user);
	};

	var getVatFiles = function(){
		return $http.get('/api/vatfiles',{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var getVatPayment = function(id){
		return $http.get('/api/vatfiles/'+id+"/payment",{
		headers: {Authorization: 'Bearer '+ getToken()}
		});
	};

	var userlogout = function() {
		$window.localStorage.removeItem('tnx-token');
	};

	var isUserLoggedIn = function() {
		var token = getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	var currentUser = function() {
		if(isadminLoggedIn()){
			var token = getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return {
				id: payload._id,
				email : payload.email,
				name : payload.username,
				CAC : payload.CAC,
				TIN : payload.TIN
			};
		}
	};

	return {
		saveToken : saveToken,
		getToken : getToken,
		userlogin: userlogin,
		userlogout: userlogout,
		isUserLoggedIn: isUserLoggedIn,
		currentUser: currentUser,
		userRegister: userRegister,
		getVatFiles: getVatFiles,
		getVatPayment: getVatPayment
	};
}
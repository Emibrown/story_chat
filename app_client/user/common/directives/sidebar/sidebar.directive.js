angular
.module('app')
.directive('sidebar', sidebar);

function sidebar () {
	return {
		restrict: 'EA',
		templateUrl: '/admin/common/directives/sidebar/sidebar.template.html',
		controller: 'sidebarCtrl'
	};
}
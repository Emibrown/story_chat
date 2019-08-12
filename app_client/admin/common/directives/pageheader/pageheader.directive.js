angular
.module('app')
.directive('pageheader', pageheader);

function pageheader () {
	return {
		restrict: 'EA',
		templateUrl: '/admin/common/directives/pageheader/pageheader.template.html',
		controller: 'pageheaderCtrl'
	};
}
'use strict';

var app = angular.module("notifyapp", ['ui.router']);
app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {

	$locationProvider.html5Mode(true);
	$stateProvider.state('404', {
		url: '/404/',
		templateUrl: "html/404.html"
	});
}]);
"use strict";

app.controller("mainController", function ($scope, $rootScope, $state) {
	console.log("ok2");
});
//# sourceMappingURL=index.js.map

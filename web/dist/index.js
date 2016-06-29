'use strict';

var app = angular.module("notifyapp", ['ui.router']);
app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
	console.log('222');
	$locationProvider.html5Mode(true);
	$stateProvider.state('404', {
		url: '/404',
		templateUrl: "/html/404.html"
	}).state('main', {
		url: '/',
		templateUrl: "/html/index.html",
		controller: "homeController"
	});
	$urlRouterProvider.otherwise("/404");
}]);
"use strict";

app.controller("mainController", function ($scope, $rootScope, $state) {
	console.log("ok2", $state.current);
}).controller("homeController", function ($scope, $rootScope, $state) {
	console.log("ok3", $state.current);
});
//# sourceMappingURL=index.js.map

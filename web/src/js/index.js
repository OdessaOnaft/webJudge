var app = angular.module("notifyapp", ['ui.router']);
app
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
	  ($locationProvider, $stateProvider, $urlRouterProvider) =>{
	  	console.log('222')
	    $locationProvider.html5Mode(true) 
	    $stateProvider
	      .state('404', {
		        url:'/404',
		        templateUrl: "/html/404.html"
		    })
	      .state('main', {
		        url:'/',
		        templateUrl: "/html/index.html",
		        controller: "homeController"
		    });
	    $urlRouterProvider.otherwise("/404");
	  }
	])
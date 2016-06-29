var app = angular.module("notifyapp", ['ui.router']);
app
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
	  ($locationProvider, $stateProvider, $urlRouterProvider) =>{

	    $locationProvider.html5Mode(true) 
	    $stateProvider
	      .state('404', {
		        url:'/404/',
		        templateUrl: "html/404.html"
		    })
	  }
	])
var app = angular.module("notifyapp", ['ui.router', 'ui.date']);
app
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider',
	  ($locationProvider, $stateProvider, $urlRouterProvider) =>{
	    $locationProvider.html5Mode(true) 
	    $urlRouterProvider.when('','/')
	    $urlRouterProvider.otherwise("/404/");
	    $stateProvider
	      .state('404', {
          url:'/404/',
          templateUrl: "/html/404.html"
		    })
	      .state('main', {
	        url:'/',
	        templateUrl: "/html/index.html",
	        controller: "homeController"
        })
	      .state('register', {
	        url:'/register/',
	        templateUrl: "/html/register.html",
	        controller: "registerController"
        })
	      .state('login', {
	        url:'/',
	        templateUrl: "/html/login.html",
	        controller: "loginController"
		    });
	    
	  }
	])
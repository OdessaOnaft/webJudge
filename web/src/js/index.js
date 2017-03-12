angular.module("notifyapp", ['ui.router', 'ui.date', 'ngAnimate', 'ngSanitize', 'hljs'])
	.run(['$state', '$rootScope', '$location',  ($state, $rootScope, $location)=>{
		var path = $location.url()
    if(path[path.length-1] != '/' && path.indexOf("?")==-1){
    	console.log(path.indexOf("?"), path, $location)
      $location.path(path+'/')
    }
	}])
	.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'hljsServiceProvider',
	  ($locationProvider, $stateProvider, $urlRouterProvider, hljsServiceProvider) =>{
	    $locationProvider.html5Mode(true) 
	    $urlRouterProvider.when('','/')
	    $urlRouterProvider.when('/cabinet/','/cabinet/problems/')
	    $urlRouterProvider.when('/cabinet/problem/','/cabinet/problems/')
	    $urlRouterProvider.when('/cabinet/admin/',($state)=>{
	    	$state.go("cabinet.admin.child", {type: "users"})
	    })
	    
	    $urlRouterProvider.otherwise("/404/");
	    hljsServiceProvider.setOptions({
		    
		  });
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
	        url:'/login/',
	        templateUrl: "/html/login.html",
	        controller: "loginController"
		    })
		    .state('cabinet', {
	        url:'/cabinet/',
	        templateUrl: "/html/cabinet.html",
	        controller: "cabinetController"
		    })

		    .state('cabinet.profile', {
	        url:'profile/',
	        templateUrl: "/html/profile.html",
	        controller: "profileController"
		    })
		    .state('cabinet.news', {
	        url:'news/',
	        templateUrl: "/html/news.html",
	        controller: "newsController"
		    })
		    .state('cabinet.problems', {
	        url:'problems/',
	        templateUrl: "/html/problems.html",
	        controller: "problemsController"
		    })
		    .state('cabinet.addProblem', {
	        url:'add-problem/{id}/',
	        templateUrl: "/html/add_problem.html",
	        controller: "addProblemController"
		    })
		    .state('cabinet.problem', {
	        url:'problem/{id}/',
	        templateUrl: "/html/problem.html",
	        controller: "problemController"
		    })
		    .state('cabinet.solutions', {
	        url:'solutions/',
	        templateUrl: "/html/solutions.html",
	        controller: "solutionsController"
		    })
		    .state('cabinet.solutionsQueue', {
	        url:'queue/',
	        templateUrl: "/html/solutions_queue.html",
	        controller: "solutionsQueueController"
		    })
		    .state('cabinet.solution', {
	        url:'solution/{id}/',
	        templateUrl: "/html/solution.html",
	        controller: "solutionController"
		    })
		    .state('cabinet.user', {
	        url:'user-{id}/',
	        templateUrl: "/html/user.html",
	        controller: "userController"
		    })
		    .state('cabinet.admin', {
	        url:'admin/',
	        templateUrl: "/html/admin.html",
	        controller: "adminController"
		    })
		    .state('cabinet.admin.child', {
	        url:'q?{type, id}/'
		    })
		    .state('cabinet.groups', {
	        url:'groups/',
	        templateUrl: "/html/groups.html",
	        controller: "groupsController"
		    })
		    .state('cabinet.group', {
	        url:'group-{id}/',
	        templateUrl: "/html/group.html",
	        controller: "groupController"
		    });
	  }
	])
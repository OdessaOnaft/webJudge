app
	.controller("mainController", ($scope, $rootScope, $state)=>{
		console.log("ok2", $state.current)
	})
	.controller("homeController", ($scope, $rootScope, $state)=>{
		console.log("ok3", $state.current)
	})
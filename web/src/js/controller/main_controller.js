angular.module("notifyapp")
  .controller("mainController", ($scope, $rootScope, $state, $translate)=>{
    $rootScope.lang = "ru"
    $scope.state = $state
    $rootScope.translate = $scope.translate = $translate
    $scope.setLang = (lang)=>{
      $rootScope.lang = lang
    }
    $scope.logout = ()=>{
      delete localStorage.token;
      $state.go("main");
    }
    
  })
  .controller("homeController", ($scope, $rootScope, $state)=>{
  })
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
    $scope.nTimes = (n)=>{
      var a = [];
      for(var i=0;i<n;i++) {
        a.push(i)
      }
      return a;
    }
    
  })
  .controller("homeController", ($scope, $rootScope, $state)=>{
  })
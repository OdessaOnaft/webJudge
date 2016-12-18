angular.module("notifyapp")
  .controller("mainController", ($scope, $rootScope, $state, $translate)=>{
    $rootScope.lang = "ru"
    $rootScope.translate = $scope.translate = $translate
    $scope.setLang = (lang)=>{
      $rootScope.lang = lang
    }
    
  })
  .controller("homeController", ($scope, $rootScope, $state)=>{
  })
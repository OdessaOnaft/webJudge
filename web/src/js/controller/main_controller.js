app
  .controller("mainController", ($scope, $rootScope, $state, $translate)=>{
    $rootScope.lang = "ru"
    $rootScope.translate = $scope.translate = $translate
    
  })
  .controller("homeController", ($scope, $rootScope, $state)=>{
  })
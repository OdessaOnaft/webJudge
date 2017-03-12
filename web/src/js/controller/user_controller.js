angular.module("notifyapp")
  .controller("userController", ($scope, $rootScope, $state, $timeout, $server)=>{
    $scope.userInfo = {}
    $scope.getUserById = ()=>{
      $rootScope.preloader = true
      $server.getUserById({userId: $state.params.id}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err) {
            $scope.userInfo = data
          }
        })
      })
    }
    $scope.getUserById()
  })
app
  .controller("registerController", ($scope, $rootScope, $state, $timeout)=>{
    $scope.user={}
    $scope.submitRegister = ()=>{
      $scope.user.isSubmitted = false;
      $timeout(()=>{
        $scope.user.isSubmitted = true;
      })
    }
  })
  .controller("loginController", ($scope, $rootScope, $state)=>{
  })
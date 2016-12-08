app
  .controller("registerController", ($scope, $rootScope, $state, $timeout)=>{
    $scope.user={}
    $scope.submitRegister = ()=>{
      $scope.user.isSubmitted = false;
      $timeout(()=>{
        $scope.user.isSubmitted = true;
      })
    }
    $scope.dateOptions = {
      dateFormat: "dd.mm.yy",
      maxDate: 0,
      changeYear: true
    }
    $scope.register = ()=>{
      console.log('register.ok')
    }
  })
  .controller("loginController", ($scope, $rootScope, $state)=>{
  })
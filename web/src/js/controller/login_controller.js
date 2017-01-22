angular.module("notifyapp")
  .controller("registerController", ($scope, $rootScope, $state, $timeout, $server)=>{
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
  .controller("loginController", ($scope, $rootScope, $state, $server)=>{
    $scope.user={}
    $scope.login = ()=>{
      $scope.user.error = "";
      $server.login($scope.user, (err,data)=>{
        $scope.$apply(()=>{
          if(err===undefined && !err) {
            if(!data) {
              data = {token: 'hihiohiho'}
            }
            localStorage.token = data.token
            $state.go("cabinet")
          } else {
            $scope.user.error = "Неверный логин или пароль"
          }
        })
        
      })
    }
  })
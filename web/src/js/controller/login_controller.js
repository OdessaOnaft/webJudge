angular.module("notifyapp")
  .controller("registerController", ($scope, $rootScope, $state, $timeout, $server)=>{
    delete localStorage.token
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
      changeYear: true,
      yearRange: "1950:2009"
    }
    $scope.register = ()=>{
      $server.register($scope.user, (err,data)=>{
        if(!err) {
          $server.login($scope.user, (err,data)=>{
            $scope.$apply(()=>{
              if(!err) {
                localStorage.token = data.token
                $state.go("cabinet")
              }
            })
            
          })
        }
      })
    }
  })
  .controller("loginController", ($scope, $rootScope, $state, $server)=>{
    delete localStorage.token
    $scope.user={}
    $scope.login = ()=>{
      $scope.user.error = "";
      $server.login($scope.user, (err,data)=>{
        $scope.$apply(()=>{
          if(!err) {
            localStorage.token = data.token
            $state.go("cabinet")
          } else {
            $scope.user.error = "Неверный логин или пароль"
          }
        })
        
      })
    }
  })
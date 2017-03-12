angular.module("notifyapp")
  .controller("profileController", ($scope, $rootScope, $state, $server, $timeout)=>{
    $scope.user = {}
    window.s = $scope
    $rootScope.preloader = true;
    $scope.submitProfile = ()=>{
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
    $scope.editProfile = ()=>{
      $scope.user.profileSubmitPreloader = true
      $server.submitProfile($scope.user, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.user.profileSubmitPreloader = false
            $scope.getProfile()
          } else {
            $scope.user.profileSubmitPreloader = false
            $scope.user.error = "Ошибка сервера, перезагрузите страницу"
          }
        })
        
      })
    }
    $scope.getProfile = ()=>{
      $server.getProfile({}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false;
        })
        $scope.$apply(()=>{
          if(!err) {
            $scope.user = data || $scope.user
            $scope.user.modifiedScopeStart = $scope.user.modifiedScope
          } else {
            console.log("error", err)
          }
        })
        
      })
    }
    $scope.getProfile()
  })
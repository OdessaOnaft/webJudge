angular.module("notifyapp")
  .controller("profileController", ($scope, $rootScope, $state, $server, $timeout)=>{
    $scope.user={}
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
      changeYear: true
    }
    $scope.editProfile = ()=>{
      $scope.user.profileSubmitPreloader = true
      $server.editProfile($scope.user, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.user.profileSubmitPreloader = false
          } else {
            console.log("err", err)
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
          } else {
            console.log("error", err)
          }
        })
        
      })
    }
    $scope.getProfile()
  })
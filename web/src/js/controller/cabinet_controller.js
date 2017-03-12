angular.module("notifyapp")
  .controller("cabinetController", ($scope, $rootScope, $state, $server)=>{
    $scope.user = {}
    $scope.state = $state
    $scope.checkSession = ()=>{
      if(!localStorage.token) {
        // $state.go("main")
        $rootScope.isGuest = true
        return;
      }
      $server.checkSession({}, (err,data)=>{

        $scope.$apply(()=>{
          if(!err) {
            $scope.user = data;
            $rootScope.isGuest = false
          } else {
            delete localStorage.token;
            // $state.go("main");
            $rootScope.isGuest = true
          }
        })
        
      })
    }
    $scope.checkSession()
  })
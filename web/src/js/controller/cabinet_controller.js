angular.module("notifyapp")
  .controller("cabinetController", ($scope, $rootScope, $state, $server)=>{
    $scope.user = {}
    $scope.checkSession = ()=>{
      if(!localStorage.token) {
        $state.go("main")
        return;
      }
      $server.checkSession({}, (err,data)=>{

        $scope.$apply(()=>{
          if(!err) {
            $scope.user = data;
          } else {
            delete localStorage.token;
            $state.go("main");
          }
        })
        
      })
    }
    $scope.checkSession()
  })
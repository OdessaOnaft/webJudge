angular.module("notifyapp")
  .controller("cabinetController", ($scope, $rootScope, $state, $server)=>{
    $scope.user = {}
    $scope.checkSession = ()=>{
      if(!localStorage.token) {
        $state.go("main")
        return;
      }
      $server.checkSession({}, (err,data)=>{

        if(!data)data = {}
        if(!err) {
          $scope.user.role = data.role;
        } else {
          delete localStorage.token;
          $state.go("main");
        }
      })
    }
    $scope.checkSession()
  })
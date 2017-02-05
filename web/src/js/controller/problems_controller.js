angular.module("notifyapp")
  .controller("problemsController", ($scope, $rootScope, $state, $server)=>{
    $scope.problems = []
    $scope.getProblems = ()=>{
      $server.getProblems({skip: 0, limit: 4242, lang: $rootScope.lang}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err) {
            $scope.problems = data
          } else {

          }
        })
      })
    }
    $scope.getProblems()
  })
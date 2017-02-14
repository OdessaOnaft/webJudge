angular.module("notifyapp")
  .controller("problemsController", ($scope, $rootScope, $state, $server)=>{
    $scope.problems = []
    $scope.pag = {
      skip: 0,
      limit: 10
    }
    $scope.getProblems = ()=>{
      $server.getProblems({skip: $scope.pag.skip, limit: $scope.pag.limit, lang: $rootScope.lang}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err) {
            $scope.problems = data.result
            $scope.pag.length = +data.count
          } else {

          }
        })
      })
    }
    $scope.getProblems()
  })
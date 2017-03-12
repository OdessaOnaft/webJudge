angular.module("notifyapp")
  .controller("solutionsQueueController", ($scope, $rootScope, $state, $server, $timeout)=>{
    $scope.pag = {
      skip: 0,
      limit: 10
    }
     $scope.getSolutionsQueue = ()=>{
      $rootScope.preloader = true
      $server.getSolutionsQueue({
        problemId: $state.params.id,
        skip: $scope.pag.skip,
        limit: $scope.pag.limit,
        lang: $rootScope.lang
      }, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err) {
            $scope.solutions = data.result
            $scope.pag.length = +data.count
            var isWaiting = false
            _.each($scope.solutions, (v)=>{
              if(v.status=='waiting')isWaiting = true
                // $server.getSolution(v, (err,data)=>{})
            })
            if(isWaiting) {
              $timeout(()=>{
                $scope.getSolutionsQueue()
              }, 200)
            }
          } else {
          }
        })
      })
    }
    $scope.getSolutionsQueue()
    $rootScope.$watch("lang", (val)=>{
      $scope.getSolutionsQueue()
    })
  })
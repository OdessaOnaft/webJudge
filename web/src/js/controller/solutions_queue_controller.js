angular.module("notifyapp")
  .controller("solutionsQueueController", ($scope, $rootScope, $state, $server, $timeout)=>{


     $scope.getSolutionsQueue = ()=>{
      $rootScope.preloader = true
      $server.getSolutionsQueue({problemId: $state.params.id, skip: 0, limit: 4242, lang: $rootScope.lang}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err) {
            $scope.solutions = data
            var isWaiting = false
            _.each(data, (v)=>{
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
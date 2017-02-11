angular.module("notifyapp")
  .controller("solutionsController", ($scope, $rootScope, $state, $server, $timeout)=>{


     $scope.getMySolutions = ()=>{
      $rootScope.preloader = true
      $server.getMySolutions({problemId: $state.params.id, skip: 0, limit: 4242, lang: $rootScope.lang}, (err,data)=>{
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
                $scope.getMySolutions()
              }, 200)
            }
           
          } else {

          }
        })
      })
    }
    $scope.getMySolutions()
    $rootScope.$watch("lang", (val)=>{
      $scope.getMySolutions()
    })
  })
  .controller("solutionController", ($scope, $rootScope, $state, $server)=>{
    $scope.solution = {}

    $scope.getSolution = ()=>{
      $rootScope.preloader = true
      $server.getSolution({solutionId: $state.params.id}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false;
        })
        $scope.$apply(()=>{
          if(!err) {
            $scope.solution = data
          } else {

          }
        })
      })
    }
    $scope.getSolution();
  })




  
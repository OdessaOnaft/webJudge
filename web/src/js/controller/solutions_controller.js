angular.module("notifyapp")
  .controller("solutionsController", ($scope, $rootScope, $state, $server, $timeout)=>{

    $scope.pag = {
      skip: 0,
      limit: 10
    }
    $scope.getMySolutions = ()=>{
      $rootScope.preloader = true
      $server.getMySolutions({problemId: $state.params.id, skip: $scope.pag.skip, limit: $scope.pag.limit, lang: $rootScope.lang}, (err,data)=>{
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
  .controller("solutionController", ($scope, $rootScope, $state, $server, $window)=>{
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
            if($scope.solution.solution) {
              $scope.solution.solution = $window.atob($scope.solution.solution)
            }
          } else {

          }
        })
      })
    }
    $scope.getSolution();
  })




  
angular.module("notifyapp")
  .controller("solutionsController", ($scope, $rootScope, $state, $server)=>{
     
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




  
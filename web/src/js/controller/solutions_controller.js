angular.module("notifyapp")
  .controller("solutionsController", ($scope, $rootScope, $state, $server)=>{


     $scope.getMySolutions = ()=>{
      $rootScope.preloader = true
      $server.getMySolutions({problemId: $state.params.id, skip: 0, limit: 4242, lang: $rootScope.lang}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err) {
            $scope.solutions = data

           
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




  
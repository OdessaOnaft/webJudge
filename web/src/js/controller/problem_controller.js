angular.module("notifyapp")
  .controller("problemController", ($scope, $rootScope, $state, $server, $window, $interval)=>{
    $scope.solve = {problemId: $state.params.id, lang: "cpp"}
    $scope.problem = {}
    $scope.submit = ()=>{
      $scope.obj = JSON.parse(JSON.stringify($scope.solve))
      delete $scope.obj.sourceFile
      $scope.obj.source = $window.btoa($scope.obj.source)
      $server.submitSolution($scope.obj, (err,data)=>{
        $scope.$apply(()=>{
          if(!err) {
            if($scope.submitInterval) {
              $interval.cancel($scope.submitInterval)
            }
            $scope.submitInterval = $interval(()=>{
              $scope.getSolutionsByProblemId()
            }, 300)
          } else {

          }
        })
      })
    }
    $scope.$watch("solve.sourceFile.base64", (val)=>{
      if(val){
        $scope.solve.source = $window.atob(val)
      }
    })
    $rootScope.$watch("lang", (val)=>{
      $scope.getProblem()
    })
    $scope.showAllSamples = ()=>{
      $scope.problem.samples = $scope.problem.allSamples
    }
    $scope.getProblem = ()=>{
      $rootScope.preloader = true
      $server.getProblem({problemId: $state.params.id, lang: $rootScope.lang}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err) {
            $scope.problem = data
            $scope.problem.allSamples = data.samples
            $scope.problem.samples = []
            _.each($scope.problem.allSamples, (el, i)=>{
              el.input = $window.atob(el.input)
              el.output = $window.atob(el.output)
              if(i<2) {
                $scope.problem.samples.push(el)
              }
            })

          } else {

          }
        })
        
      })
    }
    $scope.getProblem()
    $scope.$on("$destroy", ()=>{
      $interval.cancel($scope.submitInterval)
    })
    $scope.getSolutionsByProblemId = ()=>{
      $server.getSolutionsByProblemId({problemId: $state.params.id, skip: 0, limit: 4242}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err) {
            $scope.solutions = []
            var isWaiting = false
            _.each(data, (v)=>{
              if(v.problemId == $state.params.id) {
                $scope.solutions.push(v)
                if(v.status=='waiting')isWaiting = true
                // $server.getSolution(v, (err,data)=>{})
              }
            })
            if(!isWaiting) {
              $interval.cancel($scope.submitInterval)
            }
          } else {

          }
        })
      })
    }
    $scope.getSolutionsByProblemId()
  })
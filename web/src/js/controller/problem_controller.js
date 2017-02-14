angular.module("notifyapp")
  .controller("problemController", ($scope, $rootScope, $state, $server, $window, $interval, $timeout)=>{
    $scope.solve = {problemId: $state.params.id, lang: "cpp"}
    $scope.problem = {}
    $scope.pag = {
      skip: 0,
      limit: 10
    }
    $scope.submit = ()=>{
      $scope.solve.isSubmitting = true
      $scope.obj = JSON.parse(JSON.stringify($scope.solve))
      delete $scope.obj.sourceFile
      $scope.obj.source = $window.btoa($scope.obj.source)
      $server.submitSolution($scope.obj, (err,data)=>{
        $scope.$apply(()=>{
          $timeout(()=>{
            $scope.solve.isSubmitting = false
          }, 1000)
          
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
      $server.getSolutionsByProblemId({problemId: $state.params.id, skip: $scope.pag.skip, limit: $scope.pag.limit}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err) {

            $scope.solutions = data.result
            var isWaiting = false
            $scope.pag.length = +data.count
            _.each($scope.solutions, (v)=>{

              if(v.status=='waiting') {
                isWaiting = true
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
    $window.s = $scope
    $scope.getSolutionsByProblemId()
  })
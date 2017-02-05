angular.module("notifyapp")
  .controller("addProblemController", ($scope, $rootScope, $state, $server, $window, $timeout)=>{
    $window.s = $scope

    var interval = setInterval(()=>{
      localStorage.addProblem = JSON.stringify($scope.problem)
    }, 1000)
    $scope.$on("$destroy", ()=>{
      clearInterval(interval)
    })

    $server.checkSession({}, (err,data)=>{
      $scope.$apply(()=>{
        if(!err) {
          $scope.user = data;
          if($scope.user.scope!='admin' && $scope.user.scope!='teacher') {
            $state.go("cabinet.problems");
          }
        } else {
          delete localStorage.token;
          $state.go("cabinet.problems");
        }
      })
      
    })
    if(!localStorage.addProblem) {
      $scope.problem = {
        name: [{lang: 'ru'}, {lang: 'en'}],
        description: [{lang: 'ru'}, {lang: 'en'}],
        outputSourceFile: {},
        samples: []
      }
    } else {
      $scope.problem = JSON.parse(localStorage.addProblem)
    }
    if($state.params.id) {
      $rootScope.preloader = true
      $server.getProblemFull({problemId: $state.params.id}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err) {
            $scope.problem = data
          }
        })
      })
    }
    $scope.$watch("problem.outputSourceFile[0].base64", (val)=>{
      if(val){
        $scope.problem.outputSource = $window.atob(val)
      }
    })


    $scope.submitAddProblem = ()=>{
      $scope.problem.isSubmitted = false;
      $timeout(()=>{
        $scope.problem.isSubmitted = true;
      })
    }
    $scope.addProblem = ()=>{
      $scope.obj = JSON.parse(JSON.stringify($scope.problem))
      $scope.obj.outputSource = $window.btoa($scope.obj.outputSource);
      $scope.obj.memoryLimit = $scope.obj.memoryLimit*1024*1024
      delete $scope.problem.isSubmitted
      _.each($scope.obj.samples, (el, i)=>{
        el.input = el.base64
        delete el.url
        delete el.base64
      })
      delete $scope.obj.outputSourceFile
      delete $scope.obj.isSubmitted
      $scope.obj.publicCount = 2
      $server.addProblem($scope.obj, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.user.addProblemPreloader = false
            $state.go("cabinet.problem", {id: data.problemId})
          } else {
            $scope.user.addProblemPreloader = false
            $scope.user.error = "Ошибка сервера, перезагрузите страницу"
          }
        })
        
      })
    }
  })
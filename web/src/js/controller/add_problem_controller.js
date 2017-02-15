angular.module("notifyapp")
  .controller("addProblemController", ($scope, $rootScope, $state, $server, $window, $timeout)=>{
    $window.s = $scope
    // delete localStorage.addProblem
    var interval = setInterval(()=>{
      if($scope.problem) {
        var obj = JSON.parse(JSON.stringify($scope.problem))
        delete obj.samples;

        localStorage.addProblem = JSON.stringify(obj)
      }
    }, 1000)
    $scope.$on("$destroy", ()=>{
      clearInterval(interval)
    })
    $scope.initProblem = ()=>{
        $scope.problem = {
          name: [{lang: 'ru'}, {lang: 'en'}],
          description: [{lang: 'ru'}, {lang: 'en'}],
          outputSourceFile: {},
          samples: []
        }
    }
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
    
    
    if($state.params.id) {
      $rootScope.preloader = true
      $server.getProblemFull({problemId: $state.params.id}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err) {
            data.memoryLimit = +data.memoryLimit / 1024 / 1024
            data.timeLimit = +data.timeLimit*1
            $scope.problem = data
            data.outputSource = $window.atob(data.outputSource)
            console.log($scope.problem.name[0])
          } else {
            $scope.initProblem()
          }
        })
      })
    } else {
      if(!localStorage.addProblem) {
        $scope.initProblem()
      } else {
        if(localStorage.addProblem!="undefined")
          $scope.problem = JSON.parse(localStorage.addProblem)
        if($scope.problem.problemId && !$state.params.id) {
          $scope.initProblem()
        }
      }
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
      $scope.problem.preloader = true
      $scope.obj = JSON.parse(JSON.stringify($scope.problem))
      $scope.obj.outputSource = $window.btoa($scope.obj.outputSource);
      $scope.obj.memoryLimit = $scope.obj.memoryLimit*1024*1024
      delete $scope.problem.isSubmitted
      _.each($scope.obj.samples, (el, i)=>{
        el.input = el.base64 || el.input
        delete el.url
        delete el.base64
      })
      delete $scope.obj.outputSourceFile
      delete $scope.obj.isSubmitted
      $scope.obj.publicCount = 2
      console.log($state.params.id)
      if($state.params.id) {
        $scope.obj.problemId = $state.params.id
        $server.editProblem($scope.obj, (err,data)=>{
          $scope.$apply(()=>{
            $scope.problem.preloader = false
            if(!err){
              $scope.user.addProblemPreloader = false
              $state.go("cabinet.problem", {id: $state.params.id})
            } else {
              $scope.user.addProblemPreloader = false
              $scope.user.error = "Ошибка сервера, перезагрузите страницу"
            }
          })
          
        })
      } else {
        $server.addProblem($scope.obj, (err,data)=>{
          $scope.$apply(()=>{
            $scope.problem.preloader = false
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
    }
  })
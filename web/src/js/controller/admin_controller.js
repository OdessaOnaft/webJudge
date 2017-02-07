angular.module("notifyapp")
  .controller("adminController", ($scope, $rootScope, $state, $server)=>{
    $scope.acceptUserScope = ()=>{
      $server.acceptUserScope({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){

          }
        })
      })
    }
    $scope.rejectUserScope = ()=>{
      $server.rejectUserScope({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){

          }
        })
      })
    }
    $scope.getNews = ()=>{
      $server.getNews({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.news = data
          }
        })
      })
    }
    $scope.getNewsById = ()=>{
      $server.getNewsById({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){

          }
        })
      })
    }
    $scope.addNews = ()=>{
      $server.addNews({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){

          }
        })
      })
    }
    $scope.editNews = ()=>{
      $server.editNews({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){

          }
        })
      })
    }
    var events = {
      addNews: ()=>{
        
      },
      news: ()=>{
        $scope.getNews();
      },
      users: ()=>{
        $scope.getUsers();
      }
    }
    $scope.$on("$stateChangeSuccess", ()=>{
      var state = $state.params.type
      console.log(state)
      
      if(state) {
        events[state]();
      }
    })
  })
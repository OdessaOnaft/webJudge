angular.module("notifyapp")
  .controller("adminController", ($scope, $rootScope, $state, $server)=>{
    $scope.addNewsContent = {title: [{lang: 'ru'}, {lang: 'en'}], body: [{lang: 'ru'}, {lang: 'en'}]}
    $scope.acceptUserScope = (id)=>{
      $server.acceptUserScope({userId: id}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.getUsers()
          }
        })
      })
    }
    $scope.rejectUserScope = (id)=>{
      $server.rejectUserScope({userId: id}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.getUsers()
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
      $server.addNews($scope.addNewsContent, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.addNewsContent = {title: [{lang: 'ru'}, {lang: 'en'}], body: [{lang: 'ru'}, {lang: 'en'}]}
            alert("Новость успешно добавлена")
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
    $scope.getUsers = ()=>{
      $server.getUsers({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.users = data
            console.log($scope.users)
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
    $scope.state = {}
    $scope.$on("$stateChangeSuccess", ()=>{
      $scope.state.type = $state.params.type
      
      if($scope.state.type) {
        events[$scope.state.type]();
      }
    })
  })
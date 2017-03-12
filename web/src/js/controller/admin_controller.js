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
      $server.getNews({lang: $rootScope.lang}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.news = data.result
          }
        })
      })
    }
    $scope.getNewsById = ()=>{
      $server.getNewsById({id: $state.params.id}, (err,data)=>{
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
            $state.go("cabinet.admin.child", {type: "news"})
          }
        })
      })
    }
    $scope.deleteNews = ()=>{
      $scope.addNewsContent.newsId = $state.params.id
      $server.deleteNews($scope.addNewsContent, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.getNews()
          }
        })
      })
    }
    $scope.editNews = ()=>{
      $scope.addNewsContent.newsId = $state.params.id
      $server.editNews($scope.addNewsContent, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $state.go("cabinet.admin.child", {type: "news"})
          }
        })
      })
    }
    $scope.getUsers = ()=>{
      $server.getUsers({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.users = data
          }
        })
      })
    }
    var events = {

      addNews: ()=>{
        $scope.addNewsContent = {title: [{lang: 'ru'}, {lang: 'en'}], body: [{lang: 'ru'}, {lang: 'en'}]}
        if($state.params.id) {
          _.each(['ru','en'], (lang, i)=>{
            $server.getNewsById({newsId: $state.params.id, lang}, (err,data)=>{
              $scope.$apply(()=>{
                if(!err){
                  $scope.addNewsContent.title[i].value = data.title
                  $scope.addNewsContent.body[i].value = data.body
                  
                }
              })
            })
          })
        }
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
      $scope.state = $state.params
      if($scope.state.type) {
        events[$scope.state.type]();
      }
    })
  })
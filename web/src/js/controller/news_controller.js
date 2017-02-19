angular.module("notifyapp")
  .controller("newsController", ($scope, $rootScope, $state, $server)=>{

    $scope.getNews = ()=>{
      $rootScope.preloader = true
      $server.getNews({lang: $rootScope.lang}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err){
            $scope.news = data.result
          }
        })
      })
    }
    $rootScope.$watch("lang", ()=>{
      $scope.getNews()
    })
    $scope.getNews()
  })
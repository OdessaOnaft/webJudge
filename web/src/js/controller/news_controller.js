angular.module("notifyapp")
  .controller("newsController", ($scope, $rootScope, $state, $server)=>{
    $scope.getNews = ()=>{
      $server.getNews({}, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.news = data.result
          }
        })
      })
    }
    $scope.getNews()
  })
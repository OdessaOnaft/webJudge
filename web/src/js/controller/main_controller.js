angular.module("notifyapp")
  .controller("mainController", ($scope, $rootScope, $state, $translate, $server, $formatter)=>{
    if(!localStorage.lang) {
      localStorage.lang = "ru"
    }
    $rootScope.dateFormat = $scope.dateFormat = $formatter.dateFormat
    $rootScope.lang = localStorage.lang
    $scope.state = $state
    $rootScope.translate = $scope.translate = $translate
    $scope.setLang = (lang)=>{
      $rootScope.lang = lang
      localStorage.lang = lang
    }
    $scope.floor = $rootScope.floor = (v)=>{
      return Math.floor(v*100)/100
    }
    $scope.logout = ()=>{
      
      $server.logout({}, (err, data)=>{
        $scope.$apply(()=>{
          if(!err) {
            delete localStorage.token;
          } else {
            delete localStorage.token;
          }
        })
      })
      $state.go("main");
    }
    $scope.nTimes = (n)=>{
      var a = [];
      for(var i=0;i<n;i++) {
        a.push(i)
      }
      return a;
    }
    
  })
  .controller("homeController", ($scope, $rootScope, $state)=>{
  })
angular.module("notifyapp")
  .controller("mainController", ($scope, $rootScope, $state, $translate, $server, $formatter, $timeout)=>{
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


    $timeout(()=>{
      $scope.checkSession2 = ()=>{
        if(!localStorage.token) {
          // $state.go("main")
          $rootScope.isGuest = true
          return;
        }
        $server.checkSession({}, (err,data)=>{

          $scope.$apply(()=>{
            if(!err) {
              $scope.user = data;
              $rootScope.isGuest = false
              if(!$state.includes('cabinet')) {
                $state.go('cabinet')
              }
            } else {
              delete localStorage.token;
              // $state.go("main");
              $rootScope.isGuest = true
            }
          })
          
        })
      }
      if($state.current.name.indexOf('cabinet')==-1) {
        $scope.checkSession2()
      }
    }, 50)
    
    $scope.logout = ()=>{
      $rootScope.isGuest = true
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
    $scope.prevent = $rootScope.prevent = (e)=>{
      e.stopPropagation();
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
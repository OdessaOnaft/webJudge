angular.module("notifyapp")
  .controller("groupsController", ($scope, $rootScope, $state, $server, $timeout)=>{
    $scope.obj = {}
    $scope.makeGroup = ()=>{
      $scope.obj.preloader = true
      $server.makeGroup($scope.obj, (err,data)=>{
        $scope.$apply(()=>{
          $scope.obj.preloader = false
          if(!err){
            obj.showAddGroup = false
            $scope.getGroups('my')
          }
        })
      })
    }
    $scope.makeGroupSubmit = ()=>{
      $scope.obj.isSubmitted = false
      $timeout(()=>{
        $scope.obj.isSubmitted = true
      }, 1)
    }
    $scope.editGroup = ()=>{
      $server.editGroup($scope.obj, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){

          }
        })
      })
    }
    
    $scope.groups = []
    $scope.getGroups = (type)=>{
      $rootScope.preloader = true
      $server.getGroups({type: type || 'all'}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err){
            $scope.groups = data.result
          }
        })
      })
    }
    
    $scope.getGroups('my')
  })
  .controller("groupController", ($scope, $rootScope, $state, $server, $timeout)=>{
    $scope.group = {}
    $scope.addGroupUser = ()=>{
      $scope.group.addUserError = ""
      $server.addGroupUser($scope.group, (err,data)=>{
        $scope.$apply(()=>{
          if(!err){
            $scope.getGroupById()
          } else {
            $scope.group.addUserError = "Такого пользователя не существует"
          }
        })
      })
    }
    $scope.removeGroupUser = (id)=>{
      if(!$scope.group.preloader) {
        $scope.group.preloader = {}
      }
      $scope.group.preloader[id] = true
      $server.removeGroupUser({userId: id, groupId: $state.params.id}, (err,data)=>{
        $scope.$apply(()=>{
          delete $scope.group.preloader[id]
          if(!err){
            $scope.getGroupById()
          }
        })
      })
    }
    $scope.getGroupById = ()=>{
      $rootScope.preloader = true
      $server.getGroupById({groupId: $state.params.id}, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err){
            $scope.group = data
          }
        })
      })
    }
    $scope.editGroupSubmit = ()=>{
      $scope.group.isSubmitted = false
      $timeout(()=>{
        $scope.group.isSubmitted = true
      }, 1)
    }
    $scope.editGroup = ()=>{
      $rootScope.preloader = true
      $server.editGroup($scope.group, (err,data)=>{
        $rootScope.$apply(()=>{
          $rootScope.preloader = false
        })
        $scope.$apply(()=>{
          if(!err){
            $scope.getGroupById()
          }
        })
      })
    }
    $scope.getGroupById()
  })
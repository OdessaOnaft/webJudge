angular.module("notifyapp")
  .directive('onEnterPress', ($timeout, $server, $rootScope, $parse)=>{
    return (scope, element, attrs)=>{
      element.on("keydown", (e)=>{
        if(e.which == 13){
          scope.$apply(()=>{
            eval($parse(attrs.onEnterPress)(scope))
          })
        }
      })
    }
  })
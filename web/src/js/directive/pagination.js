angular.module("notifyapp")
  .directive('pagination', ($timeout, $server, $rootScope, $parse, $compile)=>{
    return (scope, element, attrs)=>{
      var length = attrs.length
      scope.$watch(attrs.length, (val)=>{

      })
      var skipModel = attrs.skip
      
      
      scope.$watch(skipModel, ()=>{
        var limitModel = attrs.limit
        var lengthModel = attrs.length
        var skip = $parse(attrs.skip)(scope)
        var limit = $parse(attrs.limit)(scope)
        var length = $parse(attrs.length)(scope)
        var f = $parse(attrs.onChange)(scope)
        var func = attrs.onChange
        var pages=Math.ceil(length/limit)
        console.log(skipModel, skip, limitModel, limit, lengthModel,length, pages)
        var list = angular.element('<div class="pagination-list"></div>');
        element.html('')
        if(pages<6) {
          for(var i=0;i<pages;i++){
            var item = angular.element(`<div class="pagination-item" ng-class="{'active': ${skipModel}==${i}*${limitModel} }" ng-click="${skipModel}=${i}*${limitModel};${func}()">${(i+1)}</div>`)
            list.append(item)
          }
        } else {
          for(var i=0;i<3;i++){
            var item = angular.element(`<div class="pagination-item" ng-class="{'active': ${skipModel}==${i}*${limitModel} }" ng-click="${skipModel}=${i}*${limitModel};${func}()">${(i+1)}</div>`)
            list.append(item)
          }
          var curPage=skip/limit
          console.log(curPage)
          for(var i=curPage-1;i<=curPage+2;i++){
            console.log(i)
            if(i<3 || i>pages-4)continue;

            var item = angular.element(`<div class="pagination-item" ng-class="{'active': ${skipModel}==${i}*${limitModel} }" ng-click="${skipModel}=${i}*${limitModel};${func}()">${(i+1)}</div>`)
            list.append(item)
          }
          if(curPage<pages-4) { 
            list.append(angular.element(`<div class="pagination-item dead">...</div>`))
          }
          for(var i=pages-3;i<pages;i++){
            var item = angular.element(`<div class="pagination-item" ng-click="${skipModel}=${i}*${limitModel};${func}()">${(i+1)}</div>`)
            list.append(item)
          }
        }
        list = $compile(list)(scope)
        element.append(list)
      })
      
    }
  })
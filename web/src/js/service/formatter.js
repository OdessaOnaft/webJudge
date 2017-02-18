angular.module("notifyapp")
  .factory('$formatter', ($state)=>{
    return {
      dateFormat: (date, type)=>{
        var v = +date || date
        var format = "DD.MM.YY, HH:mm"
        if(type=="date") {
          format = "DD.MM.YYYY"
        }
        return moment(v).format(format)
      }
    }
  })
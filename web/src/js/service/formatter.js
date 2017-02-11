angular.module("notifyapp")
  .factory('$formatter', ($state)=>{
    return {
      dateFormat: (date, type)=>{
        var v = +date || date
        return moment(v).format("DD.MM.YY, HH:mm")
      }
    }
  })
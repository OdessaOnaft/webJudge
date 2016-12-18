angular.module("notifyapp")
  .factory('$translate', ['$rootScope','$translateRu','$translateEn', ($rootScope,$translateRu, $translateEn) => {
    var vocabulary = {
        ru: $translateRu,
        en: $translateEn
      }
    console.log(vocabulary)
    return (word)=>{
      return vocabulary[$rootScope.lang][word] || word
    }
  }])
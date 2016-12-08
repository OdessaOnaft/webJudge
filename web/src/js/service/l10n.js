app
  .factory('$translate', ($scope,$rootScope) => {
    var vocabulary = {
        ru: {
          name: "Имя"
        },
        en: {
          name: "Name"
        }
      }
    return (word)=>{
      console.log(word)
      return vocabulary[$rootScope.lang][word] || word
    }
  })
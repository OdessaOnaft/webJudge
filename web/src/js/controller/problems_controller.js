angular.module("notifyapp")
  .controller("problemsController", ($scope, $rootScope, $state, $server)=>{
    $scope.problems = [
      {
        title: "Задача о кроликах",
        id: 1,
        difficulty: 1,
        author: "Пройденко А.А."

      },
      {
        title: "Задача о гномах",
        id: 2,
        difficulty: 2,
        author: "Пройденко А.А."
        
      },
      {
        title: "Камушки",
        id: 3,
        difficulty: 2,
        author: "Пройденко А.А."
        
      },{
        title: "Игра",
        id: 4,
        difficulty: 4,
        author: "Пройденко А.А."
        
      }
    ]
  })
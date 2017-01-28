angular.module("notifyapp")
  .controller("problemController", ($scope, $rootScope, $state, $server)=>{
    console.log($state.params)
    $scope.solve = {}

    $scope.problem = {
      title: "Задача о кроликах",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores, incidunt.",
      input: "дается 3 числа n,m,k",
      output: "вывести n чисел - ответ к задаче",
      samples: [
        {
          input: [
            "5 4 3",
            "2 4 1 2",
            "2 4 8 2",
            "2 3 1 6"
          ],
          output: [
            "7 7 5 4 3"
          ]
        },
        {
          input: [
            "2 4 3",
            "2 4 1 2"
          ],
          output: [
            "7 7"
          ]
        },
      ]
    }
    $scope.submit = ()=>{
      console.log($scope.solve)
    }
  })
'use strict';

angular.module("notifyapp", ['ui.router', 'ui.date', 'ngAnimate', 'ngSanitize']).run(['$state', '$rootScope', '$location', function ($state, $rootScope, $location) {
	var path = $location.path();
	if (path[path.length - 1] != '/') {
		$location.path(path + '/');
	}
}]).config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.when('', '/');
	$urlRouterProvider.when('/cabinet/problem/', '/cabinet/problems/');

	$urlRouterProvider.otherwise("/404/");
	$stateProvider.state('404', {
		url: '/404/',
		templateUrl: "/html/404.html"
	}).state('main', {
		url: '/',
		templateUrl: "/html/index.html",
		controller: "homeController"
	}).state('register', {
		url: '/register/',
		templateUrl: "/html/register.html",
		controller: "registerController"
	}).state('login', {
		url: '/login/',
		templateUrl: "/html/login.html",
		controller: "loginController"
	}).state('cabinet', {
		url: '/cabinet/',
		templateUrl: "/html/cabinet.html",
		controller: "cabinetController"
	}).state('cabinet.profile', {
		url: 'profile/',
		templateUrl: "/html/profile.html",
		controller: "profileController"
	}).state('cabinet.news', {
		url: 'news/',
		templateUrl: "/html/news.html",
		controller: "newsController"
	}).state('cabinet.problems', {
		url: 'problems/',
		templateUrl: "/html/problems.html",
		controller: "problemsController"
	}).state('cabinet.addProblem', {
		url: 'add-problem/{id}/',
		templateUrl: "/html/add_problem.html",
		controller: "addProblemController"
	}).state('cabinet.problem', {
		url: 'problem/{id}/',
		templateUrl: "/html/problem.html",
		controller: "problemController"
	}).state('cabinet.solutions', {
		url: 'solutions/',
		templateUrl: "/html/solutions.html",
		controller: "solutionsController"
	}).state('cabinet.solution', {
		url: 'solution/{id}/',
		templateUrl: "/html/solution.html",
		controller: "solutionController"
	}).state('cabinet.admin', {
		url: 'admin/',
		templateUrl: "/html/admin.html",
		controller: "adminController"
	}).state('cabinet.groups', {
		url: 'groups/',
		templateUrl: "/html/groups.html",
		controller: "groupsController"
	});
}]);
'use strict';

angular.module("notifyapp").factory('$server', function ($state) {
  var api = {};
  var methods = ['register', 'login', 'checkSession', 'submitProfile', 'getProfile', 'logout', 'addProblem', 'getProblem', 'getProblems', 'submitSolution', 'getSolutions', 'getMySolutions', 'getSolution', 'getProblemFull'];
  var addMethod = function addMethod(methodName) {
    api[methodName] = function (data, callback) {
      var domain = "localhost";
      domain = "webjudgeapi.westcentralus.cloudapp.azure.com";

      data.cookies = {
        sessionId: localStorage.token
      };
      var request = $.ajax({
        url: 'http://' + domain + '/call/' + methodName,
        method: 'POST',
        contentType: "application/json;charset=utf-8",
        headers: {
          'sessionidcors': localStorage.token
        },
        data: JSON.stringify(data),
        dataType: 'json'
      });
      request.done(function (data) {
        if (data.err && data.err.message == "Invalid session") {
          delete localStorage.token;
          $state.go('main');
        };
        callback(data.err, data.data);
      });

      request.fail(function (xhr) {
        callback(xhr.responseJSON);
      });
    };
  };

  for (var method in methods) {
    addMethod(methods[method]);
  }
  return api;
});
'use strict';

angular.module("notifyapp").factory('$translate', ['$rootScope', '$translateRu', '$translateEn', function ($rootScope, $translateRu, $translateEn) {
  var vocabulary = {
    ru: $translateRu,
    en: $translateEn
  };
  console.log(vocabulary);
  return function (word) {
    return vocabulary[$rootScope.lang][word] || word;
  };
}]);
"use strict";

angular.module("notifyapp").factory('$formatter', function ($state) {
  return {
    dateFormat: function dateFormat(date, type) {
      var v = +date || date;
      return moment(v).format("DD MMMM YYYY, HH:mm");
    }
  };
});
"use strict";

angular.module("notifyapp").factory('$translateRu', [function () {
  var words = {
    name: "Имя",
    logIn: "Войти",
    namePlaceholder: "Введите ваше имя",
    email: "Электронный адрес",
    password: "Пароль",
    phone: "Номер телефона",
    birthday: "Дата рождения",
    homePage: "Главная",
    register: "Регистрация",
    emailPlaceholder: "Введите ваш электронный адрес",
    passwordPlaceholder: "Введите ваш пароль",
    phonePlaceholder: "Введите ваш номер телефона",
    birthdayPlaceholder: "Выберите вашу дату рождения",
    profile: "Профиль",
    save: "Сохранить",
    logout: "Выйти",
    student: 'Студент',
    teacher: 'Учитель',
    admin: 'Админ',
    on_moderation: "На подтверждении",
    editProblem: "Редактировать эту задачу",
    addProblem: "Добавить задачу",
    problemName: "Название задачи",
    problemNamePlaceholder: "Введите название задачи",
    problemDescription: "Условие задачи",
    problemDescriptionPlaceholder: "Введите условие задачи",
    timeLimit: "Лимит времени",
    timelimitPlaceholder: "Укажите лимит времети (мс)",
    memoryLimit: "Лимит памяти",
    memoryLimitPlaceholder: "Укажите лимит памяти (Мбайт)",
    tests: "Тесты",
    solution: "Решение",
    testId: "Тест №",
    status: "Статус",
    execTime: "Время выполнения",
    execMemory: "Затрачено памяти"
  };
  return words;
}]);
"use strict";

angular.module("notifyapp").factory('$translateEn', [function () {
  var words = {
    name: "Name",
    logIn: "Login",
    namePlaceholder: "Enter your name",
    email: "Email",
    password: "Password",
    phone: "Phone number",
    birthday: "Birthday",
    homePage: "Home",
    register: "Register",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    phonePlaceholder: "Enter your phone number",
    birthdayPlaceholder: "Enter your birthday",
    profile: "Profile",
    save: "Save",
    logout: "Logout",
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Admin',
    on_moderation: "On moderation",
    editProblem: "Edit this problem",
    addProblem: "Add problem",
    problemName: "Problem name",
    problemNamePlaceholder: "Enter problem name",
    problemDescription: "Problem description",
    problemDescriptionPlaceholder: "Enter problem description",
    timeLimit: "Time limit",
    timelimitPlaceholder: "Enter time limit (ms)",
    memoryLimit: "Memory limit",
    memoryLimitPlaceholder: "Enter memory limit (Mb)",
    tests: "Tests",
    solution: "Solution",
    testId: "Test #",
    status: "Status",
    execTime: "Execution time",
    execMemory: "Execution memory"
  };
  return words;
}]);
"use strict";

angular.module("notifyapp").controller("solutionsController", function ($scope, $rootScope, $state, $server) {}).controller("solutionController", function ($scope, $rootScope, $state, $server) {
  $scope.solution = {};

  $scope.getSolution = function () {
    $rootScope.preloader = true;
    $server.getSolution({ solutionId: $state.params.id }, function (err, data) {
      $rootScope.$apply(function () {
        $rootScope.preloader = false;
      });
      $scope.$apply(function () {
        if (!err) {
          $scope.solution = data;
        } else {}
      });
    });
  };
  $scope.getSolution();
});
"use strict";

angular.module("notifyapp").controller("profileController", function ($scope, $rootScope, $state, $server, $timeout) {
  $scope.user = {};
  $rootScope.preloader = true;
  $scope.submitProfile = function () {
    $scope.user.isSubmitted = false;
    $timeout(function () {
      $scope.user.isSubmitted = true;
    });
  };
  $scope.dateOptions = {
    dateFormat: "dd.mm.yy",
    maxDate: 0,
    changeYear: true
  };
  $scope.editProfile = function () {
    $scope.user.profileSubmitPreloader = true;
    $server.submitProfile($scope.user, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.user.profileSubmitPreloader = false;
          $scope.getProfile();
        } else {
          $scope.user.profileSubmitPreloader = false;
          $scope.user.error = "Ошибка сервера, перезагрузите страницу";
        }
      });
    });
  };
  $scope.getProfile = function () {
    $server.getProfile({}, function (err, data) {
      $rootScope.$apply(function () {
        $rootScope.preloader = false;
      });
      $scope.$apply(function () {
        if (!err) {
          $scope.user = data || $scope.user;
          $scope.user.modifiedScopeStart = $scope.user.modifiedScope;
        } else {
          console.log("error", err);
        }
      });
    });
  };
  $scope.getProfile();
});
"use strict";

angular.module("notifyapp").controller("problemController", function ($scope, $rootScope, $state, $server, $window) {
  $scope.solve = { problemId: $state.params.id, lang: "cpp" };
  $scope.problem = {};
  $scope.submit = function () {
    $scope.obj = JSON.parse(JSON.stringify($scope.solve));
    delete $scope.obj.sourceFile;
    $scope.obj.source = $window.btoa($scope.obj.source);
    $server.submitSolution($scope.obj, function (err, data) {
      $scope.$apply(function () {
        if (!err) {} else {}
      });
    });
  };
  $scope.$watch("solve.sourceFile.base64", function (val) {
    if (val) {
      $scope.solve.source = $window.atob(val);
    }
  });
  $rootScope.$watch("lang", function (val) {
    $scope.getProblem();
  });
  $scope.showAllSamples = function () {
    $scope.problem.samples = $scope.problem.allSamples;
  };
  $scope.getProblem = function () {
    $rootScope.preloader = true;
    $server.getProblem({ problemId: $state.params.id, lang: $rootScope.lang }, function (err, data) {
      $rootScope.$apply(function () {
        $rootScope.preloader = false;
      });
      $scope.$apply(function () {
        if (!err) {
          $scope.problem = data;
          $scope.problem.allSamples = data.samples;
          $scope.problem.samples = [];
          _.each($scope.problem.allSamples, function (el, i) {
            el.input = $window.atob(el.input);
            el.output = $window.atob(el.output);
            if (i < 2) {
              $scope.problem.samples.push(el);
            }
          });
        } else {}
      });
    });
  };
  $scope.getProblem();

  $scope.getMySolutions = function () {
    $server.getMySolutions({ problemId: $state.params.id, skip: 0, limit: 4242 }, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.solutions = [];
          _.each(data, function (v) {
            if (v.problemId == $state.params.id) {
              $scope.solutions.push(v);
              $server.getSolution(v, function (err, data) {});
            }
          });
        } else {}
      });
    });
  };
  $scope.getMySolutions();
});
"use strict";

angular.module("notifyapp").controller("problemsController", function ($scope, $rootScope, $state, $server) {
  $scope.problems = [];
  $scope.getProblems = function () {
    $server.getProblems({ skip: 0, limit: 4242, lang: $rootScope.lang }, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.problems = data;
        } else {}
      });
    });
  };
  $scope.getProblems();
});
"use strict";

angular.module("notifyapp").controller("newsController", function ($scope, $rootScope, $state, $server) {});
"use strict";

angular.module("notifyapp").controller("mainController", function ($scope, $rootScope, $state, $translate, $server, $formatter) {
  if (!localStorage.lang) {
    localStorage.lang = "ru";
  }
  $rootScope.dateFormat = $scope.dateFormat = $formatter.dateFormat;
  $rootScope.lang = localStorage.lang;
  $scope.state = $state;
  $rootScope.translate = $scope.translate = $translate;
  $scope.setLang = function (lang) {
    $rootScope.lang = lang;
    localStorage.lang = lang;
  };
  $scope.floor = $rootScope.floor = function (v) {
    return Math.floor(v * 100) / 100;
  };
  $scope.logout = function () {

    $server.logout({}, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          delete localStorage.token;
        } else {
          delete localStorage.token;
        }
      });
    });
    $state.go("main");
  };
  $scope.nTimes = function (n) {
    var a = [];
    for (var i = 0; i < n; i++) {
      a.push(i);
    }
    return a;
  };
}).controller("homeController", function ($scope, $rootScope, $state) {});
"use strict";

angular.module("notifyapp").controller("registerController", function ($scope, $rootScope, $state, $timeout, $server) {
  delete localStorage.token;
  $scope.user = {};
  $scope.submitRegister = function () {
    $scope.user.isSubmitted = false;
    $timeout(function () {
      $scope.user.isSubmitted = true;
    });
  };
  $scope.dateOptions = {
    dateFormat: "dd.mm.yy",
    maxDate: 0,
    changeYear: true
  };
  $scope.register = function () {
    $server.register($scope.user, function (err, data) {
      if (!err) {
        $server.login($scope.user, function (err, data) {
          $scope.$apply(function () {
            if (!err) {
              localStorage.token = data.token;
              $state.go("cabinet");
            }
          });
        });
      }
    });
  };
}).controller("loginController", function ($scope, $rootScope, $state, $server) {
  delete localStorage.token;
  $scope.user = {};
  $scope.login = function () {
    $scope.user.error = "";
    $server.login($scope.user, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          localStorage.token = data.token;
          $state.go("cabinet");
        } else {
          $scope.user.error = "Неверный логин или пароль";
        }
      });
    });
  };
});
"use strict";

angular.module("notifyapp").controller("groupsController", function ($scope, $rootScope, $state, $server) {});
"use strict";

angular.module("notifyapp").controller("cabinetController", function ($scope, $rootScope, $state, $server) {
  $scope.user = {};
  $scope.checkSession = function () {
    if (!localStorage.token) {
      $state.go("main");
      return;
    }
    $server.checkSession({}, function (err, data) {

      $scope.$apply(function () {
        if (!err) {
          $scope.user = data;
        } else {
          delete localStorage.token;
          $state.go("main");
        }
      });
    });
  };
  $scope.checkSession();
});
"use strict";

angular.module("notifyapp").controller("adminController", function ($scope, $rootScope, $state, $server) {});
"use strict";

angular.module("notifyapp").controller("addProblemController", function ($scope, $rootScope, $state, $server, $window, $timeout) {
  $window.s = $scope;

  var interval = setInterval(function () {
    localStorage.addProblem = JSON.stringify($scope.problem);
  }, 1000);
  $scope.$on("$destroy", function () {
    clearInterval(interval);
  });

  $server.checkSession({}, function (err, data) {
    $scope.$apply(function () {
      if (!err) {
        $scope.user = data;
        if ($scope.user.scope != 'admin' && $scope.user.scope != 'teacher') {
          $state.go("cabinet.problems");
        }
      } else {
        delete localStorage.token;
        $state.go("cabinet.problems");
      }
    });
  });
  if (!localStorage.addProblem) {
    $scope.problem = {
      name: [{ lang: 'ru' }, { lang: 'en' }],
      description: [{ lang: 'ru' }, { lang: 'en' }],
      outputSourceFile: {},
      samples: []
    };
  } else {
    $scope.problem = JSON.parse(localStorage.addProblem);
  }
  if ($state.params.id) {
    $rootScope.preloader = true;
    $server.getProblemFull({ problemId: $state.params.id }, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.problem = data;
        }
      });
    });
  }
  $scope.$watch("problem.outputSourceFile[0].base64", function (val) {
    if (val) {
      $scope.problem.outputSource = $window.atob(val);
    }
  });

  $scope.submitAddProblem = function () {
    $scope.problem.isSubmitted = false;
    $timeout(function () {
      $scope.problem.isSubmitted = true;
    });
  };
  $scope.addProblem = function () {
    $scope.obj = JSON.parse(JSON.stringify($scope.problem));
    $scope.obj.outputSource = $window.btoa($scope.obj.outputSource);
    $scope.obj.memoryLimit = $scope.obj.memoryLimit * 1024 * 1024;
    delete $scope.problem.isSubmitted;
    _.each($scope.obj.samples, function (el, i) {
      el.input = el.base64;
      delete el.url;
      delete el.base64;
    });
    delete $scope.obj.outputSourceFile;
    delete $scope.obj.isSubmitted;
    $scope.obj.publicCount = 2;
    $server.addProblem($scope.obj, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.user.addProblemPreloader = false;
          $state.go("cabinet.problem", { id: data.problemId });
        } else {
          $scope.user.addProblemPreloader = false;
          $scope.user.error = "Ошибка сервера, перезагрузите страницу";
        }
      });
    });
  };
});
'use strict';

angular.module("notifyapp").factory('$validators', function () {
  var validators = {
    positiveNumber: function positiveNumber(value) {
      return _.isNumber(value) && value > 0;
    },
    statement: function statement(value) {
      return eval(value);
    },
    notEmptyArray: function notEmptyArray(value) {
      return _.isArray(value) && value.length;
    },
    phoneNumber: function phoneNumber(value) {
      return value.match(/380[0-9]{9}/);
    },
    adr: function adr(value) {
      return _.isNumber(value) && value > 0 && value < 10;
    },
    temperature: function temperature(value) {
      return _.isNumber(value) && value > -274;
    },
    cargoWeight: function cargoWeight(value) {
      return _.isNumber(value) && value > 0 && value < 41;
    },
    percent: function percent(value) {
      return _.isNumber(value) && value > 0 && value < 101;
    },
    email: function email(value) {
      return _.isString(value) && value.length > 0 && value.indexOf(' ') == -1 && value.match(/.+@.+/);
    }
  };
  return validators;
}).directive('checkForm', function ($timeout) {
  return function (scope, element, attrs) {
    scope.$watch(attrs.checkForm, function (formSubmitted) {
      if (!formSubmitted) {
        return;
      };
      var models = $(element).find("[ng-model]");
      for (var el in models) {
        $(el).keydown(function () {
          $(undefined).removeClass('error');
        });
      }
      var badFields = $(element).find(".invalid-model");
      console.log(badFields, badFields.length);
      _.each(badFields, function (el) {
        $(el).addClass("error");
      });

      if (badFields.length) {
        console.log("bad validation", badFields);
        if (attrs.onValidationError && _.isFunction(eval('scope.' + attrs.onValidationError))) {
          eval(eval('scope.' + attrs.onValidationError + '()'));
        }
      } else {
        console.log("good validation");
        eval(eval('scope.' + attrs.onValidationOk + '()'));
      }
    });
  };
}).directive('validator', function ($timeout, $validators) {
  return function (scope, element, attrs) {
    var validators = $validators;
    var model = 'scope.' + $(element).attr("ng-model");
    if (attrs.index) {
      model = model.split('$index').join(attrs.index);
    }
    var value = eval(model);
    var validator = attrs.isRequired;
    var target = attrs.errorTarget;
    if (!target) {
      target = element;
    } else {
      target = "#" + target;
    }
    scope.$watch(attrs.ngModel, function (value) {
      $(target).removeClass("error");
      var value = eval(model);
      var validator = attrs.validator;
      if (!_.isUndefined(attrs.isRequired)) {
        if (_.isNull(value) || _.isUndefined(value) || value == "") {
          $(target).addClass("invalid-model");
        } else if (validator && !eval('validators.' + validator)(value)) {
          $(target).addClass("invalid-model");
        } else {
          $(target).removeClass("invalid-model");
        }
      } else {
        if (!(_.isNull(value) || _.isUndefined(value))) {
          if (validator && !eval('validators.' + validator)(value)) {
            $(target).addClass("invalid-model");
          } else {
            $(target).removeClass("invalid-model");
          }
        } else {
          $(target).removeClass("invalid-model");
        }
      }
    });
  };
});
"use strict";

angular.module("notifyapp").directive('onEnterPress', function ($timeout, $server, $rootScope, $parse) {
  return function (scope, element, attrs) {
    element.on("keydown", function (e) {
      if (e.which == 13) {
        scope.$apply(function () {
          eval($parse(attrs.onEnterPress)(scope));
        });
      }
    });
  };
});
'use strict';

angular.module("notifyapp").directive('ngFileModel', ['$parse', '$http', '$window', function ($parse, $http, $window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                        url: URL.createObjectURL(item)
                    };
                    $http({
                        method: 'GET',
                        url: value.url
                    }).then(function successCallback(response) {
                        value.base64 = $window.btoa(response.data);
                    }, function errorCallback(response) {});
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);
//# sourceMappingURL=index.js.map

angular.module('notifyapp').run(['$templateCache', function($templateCache) {$templateCache.put('/index.html','<!DOCTYPE html>\r\n<html lang="en" ng-app="notifyapp" ng-controller="mainController">\r\n<head>\r\n    <meta charset="UTF-8">\r\n    <title>notify APP</title>\r\n    <base href="/">\r\n    <link rel="stylesheet" href="assets/init.css">\r\n    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">\r\n    <!-- bower:css -->\r\n    <!-- endbower -->\r\n\r\n    <link rel="stylesheet" href="css/index.css">\r\n</head>\r\n<body>\r\n\r\n    <header class="main-header" ng-include="\'/html/header.html\'"></header>\r\n    <div class="ui-view main-container"></div>\r\n    <footer class="main-footer" ng-include="\'/html/footer.html\'"></footer>\r\n\r\n    <!-- bower:js -->\r\n    <script src="../bower_components/angular/angular.js"></script>\r\n    <script src="../bower_components/jquery/dist/jquery.js"></script>\r\n    <script src="../bower_components/angular-ui-router/release/angular-ui-router.js"></script>\r\n    <script src="../bower_components/underscore/underscore.js"></script>\r\n    <script src="../bower_components/moment/moment.js"></script>\r\n    <script src="../bower_components/jquery-ui/jquery-ui.js"></script>\r\n    <script src="../bower_components/angular-ui-date/dist/date.js"></script>\r\n    <script src="../bower_components/angular-animate/angular-animate.js"></script>\r\n    <script src="../bower_components/angular-sanitize/angular-sanitize.js"></script>\r\n    <!-- endbower -->\r\n    \r\n\r\n    <script src="index.js"></script>\r\n    <script src="scripts/vendor.js"></script>\r\n    <script src="scripts/index.js"></script>\r\n    \r\n    <!-- inject:js -->\r\n    <!-- endinject -->\r\n</body>\r\n</html>');
$templateCache.put('/html/404.html','<div>404</div>');
$templateCache.put('/html/add_problem.html','<div class="add-problem"><h2 style="margin-bottom: 20px">{{translate("addProblem")}}</h2><div class="form" check-form="problem.isSubmitted" on-validation-ok="addProblem"><h2>\u0420\u0443\u0441\u0441\u043A\u0438\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442</h2><table><tr><td>{{translate("problemName")}}:</td><td><input type="text" ng-model="problem.name[0].value" placeholder="{{translate(\'problemNamePlaceholder\')}}"></td></tr><tr><td>{{translate("problemDescription")}}:</td><td><textarea ng-model="problem.description[0].value" placeholder="{{translate(\'problemDescriptionPlaceholder\')}}"></textarea></td></tr></table><h2>\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442</h2><table><tr><td>{{translate("problemName")}}:</td><td><input type="text" ng-model="problem.name[1].value" placeholder="{{translate(\'problemNamePlaceholder\')}}"></td></tr><tr><td>{{translate("problemDescription")}}:</td><td><textarea ng-model="problem.description[1].value" placeholder="{{translate(\'problemDescriptionPlaceholder\')}}"></textarea></td></tr><tr><td>{{translate("timeLimit")}}:</td><td><input type="number" ng-model="problem.timeLimit" placeholder="{{translate(\'timelimitPlaceholder\')}}"></td></tr><tr><td>{{translate("memoryLimit")}}:</td><td><input type="number" ng-model="problem.memoryLimit" placeholder="{{translate(\'memoryLimitPlaceholder\')}}"></td></tr><tr><td>{{translate("tests")}}:</td><td><input type="file" multiple="multiple" ng-file-model="problem.samples"></td></tr><tr><td>{{translate("solution")}}:</td><td><input type="file" multiple="multiple" ng-file-model="problem.outputSourceFile"><textarea ng-model="problem.outputSource"></textarea></td></tr></table><button ng-click="submitAddProblem()" class="default"><span ng-if="!user.addProblemPreloader">{{translate("save")}}</span> <span ng-if="user.addProblemPreloader" class="button-preloader"></span></button><p class="error" ng-if="user.error" style="margin-top: 10px">{{user.error}}</p></div></div>');
$templateCache.put('/html/admin.html','<div class="admin"></div>');
$templateCache.put('/html/cabinet.html','<div class="wrapper cabinet"><div class="left-menu"><ul><li ui-sref=".profile"><a>\u041C\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C</a></li><li ui-sref=".news"><a>\u041D\u043E\u0432\u043E\u0441\u0442\u0438</a></li><li ui-sref=".problems"><a>\u0417\u0430\u0434\u0430\u0447\u0438</a></li><li ui-sref=".solutions"><a>\u041C\u043E\u0438 \u0440\u0435\u0448\u0435\u043D\u0438\u044F</a></li><li ui-sref=".groups"><a>\u041C\u043E\u0438 \u0433\u0440\u0443\u043F\u043F\u044B</a></li><li ui-sref=".admin" ng-if="user.scope==\'admin\'"><a>\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435</a></li></ul></div><!--\r\n  --><div class="cabinet-inner" ui-view></div></div>');
$templateCache.put('/html/footer.html','<div class="wrapper"><img src="assets/img/js.png" width="50" height="50" alt="js"></div>');
$templateCache.put('/html/groups.html','<div class="groups"></div>');
$templateCache.put('/html/header.html','<div class="wrapper"><img src="assets/img/js.png" width="50" height="50" alt="js"> <img src="assets/img/menu.svg" alt="" id="menu-img" ng-click="showMenu =! showMenu"><ul class="links"><li ng-if="!state.includes(\'cabinet\')"><a ui-sref="login">{{translate("logIn")}}</a></li><li ng-if="!state.includes(\'cabinet\')"><a ui-sref="register">{{translate("register")}}</a></li><li><a ng-click="setLang(\'ru\')">Ru</a></li><li><a ng-click="setLang(\'en\')">En</a></li><li ng-if="state.includes(\'cabinet\')"><a ng-click="logout()">{{translate("logout")}}</a></li></ul><ul class="links-mobile" ng-show="showMenu" ng-click="showMenu = false"><li ui-sref="login" ng-if="!state.includes(\'cabinet\')"><a>{{translate("logIn")}}</a></li><li ui-sref="register" ng-if="!state.includes(\'cabinet\')"><a>{{translate("register")}}</a></li><li ng-click="setLang(\'ru\')"><a>Ru</a></li><li ng-click="setLang(\'en\')"><a>En</a></li><li ng-click="logout()" ng-if="state.includes(\'cabinet\')"><a>{{translate("logout")}}</a></li></ul></div>');
$templateCache.put('/html/index.html','<div class="wrapper"><h1>Hello site!</h1></div>');
$templateCache.put('/html/login.html','<div class="wrapper"><ul class="breadcrumb"><li class="breadcrumb-item"><a href="" ui-sref="main">{{translate("homePage")}}</a></li></ul><h2>\u0412\u0445\u043E\u0434</h2><div class="form" check-form="user.isSubmitted" on-validation-ok="register"><table><tr><td>{{translate("email")}}:</td><td><input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}" on-enter-press="login()"></td></tr><tr><td>{{translate("password")}}:</td><td><input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}" on-enter-press="login()"></td></tr></table><p class="error" ng-if="user.error">\u0412\u044B \u0443\u043A\u0430\u0437\u0430\u043B\u0438 \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C</p><button ng-click="login()" class="default">\u0412\u043E\u0439\u0442\u0438</button></div></div>');
$templateCache.put('/html/news.html','<div class="news"></div>');
$templateCache.put('/html/problem.html','<div class="problem" ng-show="!$root.preloader"><h1>{{problem.title}}</h1><button class="default" ui-sref="^.addProblem({id: solve.problemId})" ng-if="user.scope==\'admin\'">{{translate(\'editProblem\')}}</button><div ng-bind-html="problem.description"></div><div class="wrapper-problem"><div class="samples"><table><tr ng-repeat="sample in problem.samples"><td><p>{{sample.input}}</p></td><td><p>{{sample.output}}</p></td></tr></table></div><a ng-click="showAllSamples()" class="blue show-tests">{{translate(\'showAllTests\')}}</a><div class="solve"><input type="file" ng-file-model="solve.sourceFile" style="margin-bottom: 10px"><textarea placeholder="\u0418\u0441\u0445\u043E\u0434\u043D\u044B\u0439 \u043A\u043E\u0434 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u044E\u0434\u0430" ng-model="solve.source"></textarea><div class="processing"><button class="default" ng-click="submit()"><span ng-if="!solve.profileSubmitPreloader">{{translate("submit")}}</span> <span ng-if="solve.profileSubmitPreloader" class="button-preloader"></span></button><p class="progress">submiting....</p></div></div><div class="solutions" ng-if="solutions.length"><table><thead><th>{{translate(\'solutionId\')}}</th><th>{{translate(\'created\')}}</th><th>{{translate(\'lang\')}}</th><th>{{translate(\'status\')}}</th></thead><tbody><tr ng-repeat="solution in solutions" ui-sref="^.solution({id: solution.solutionId})"><td>{{solution.solutionId}}</td><td>{{dateFormat(solution.created)}}</td><td>{{solution.lang}}</td><td>{{solution.status}}</td></tr></tbody></table></div></div></div>');
$templateCache.put('/html/problems.html','<div class="problems"><button class="default" ui-sref="^.addProblem" ng-if="user.scope==\'admin\' || user.scope==\'teacher\'">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443</button><table class="problems-table"><thead><th>ID</th><th>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</th><th>\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C</th><th>\u0410\u0432\u0442\u043E\u0440</th></thead><tbody><tr ng-repeat="problem in problems" ui-sref="cabinet.problem({id: problem.problemId})"><td>{{problem.problemId}}</td><td>{{problem.name}}</td><td><img src="assets/img/muscles.png" alt="" width="14" height="13" ng-repeat="el in nTimes(problem.difficulty)"></td><td>{{problem.author}}</td></tr></tbody></table></div>');
$templateCache.put('/html/profile.html','<div class="profile"><h2>{{translate("profile")}}</h2><div class="form" check-form="user.isSubmitted" on-validation-ok="editProfile"><table><tr><td>{{translate("name")}}:</td><td><input type="text" ng-model="user.name" is-required validator placeholder="{{translate(\'namePlaceholder\')}}"></td></tr><!--       <tr>\r\n        <td>{{translate("email")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}">\r\n        </td>\r\n      </tr> --><!--  <tr>\r\n        <td>{{translate("password")}}:</td>\r\n        <td>\r\n          <input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}">\r\n        </td>\r\n      </tr> --><tr><td>{{translate("phone")}}:</td><td><input type="tel" ng-model="user.phone" is-required validator="phoneNumber" placeholder="{{translate(\'phonePlaceholder\')}}"></td></tr><tr><td>{{translate("birthday")}}:</td><td><input type="text" ng-model="user.birthday" ui-date="dateOptions" is-required validator placeholder="{{translate(\'birthdayPlaceholder\')}}"></td></tr><tr><td><p>\u0420\u043E\u043B\u044C:</p><p>({{translate(user.scope)}})</p></td><td><div class="input-wrapper"><input type="radio" id="1" ng-model="user.modifiedScope" value="student"><label for="1">{{translate(\'student\')}} <span class="light" ng-if="user.modifiedScopeStart == \'student\'">({{translate(\'on_moderation\')}})</span></label></div><div class="input-wrapper"><input type="radio" id="2" ng-model="user.modifiedScope" value="teacher"><label for="2">{{translate(\'teacher\')}} <span class="light" ng-if="user.modifiedScopeStart == \'teacher\'">({{translate(\'on_moderation\')}})</span></label></div><div class="input-wrapper"><input type="radio" id="3" ng-model="user.modifiedScope" value="admin"><label for="3">{{translate(\'admin\')}} <span class="light" ng-if="user.modifiedScopeStart == \'admin\'">({{translate(\'on_moderation\')}})</span></label></div></td></tr></table><button ng-click="submitProfile()" class="default"><span ng-if="!user.profileSubmitPreloader">{{translate("save")}}</span> <span ng-if="user.profileSubmitPreloader" class="button-preloader"></span></button><p class="error" ng-if="user.error" style="margin-top: 10px">{{user.error}}</p></div></div>');
$templateCache.put('/html/register.html','<div class="wrapper"><ul class="breadcrumb"><li class="breadcrumb-item"><a href="" ui-sref="main">{{translate("homePage")}}</a></li></ul><h2>{{translate("register")}}</h2><div class="form" check-form="user.isSubmitted" on-validation-ok="register"><table><!--  <tr>\r\n        <td>{{translate("name")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.name" is-required validator placeholder="{{translate(\'namePlaceholder\')}}">\r\n        </td>\r\n      </tr> --><tr><td>{{translate("email")}}:</td><td><input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}"></td></tr><tr><td>{{translate("password")}}:</td><td><input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}"></td></tr><!--  <tr>\r\n        <td>{{translate("phone")}}:</td>\r\n        <td>\r\n          <input type="tel" ng-model="user.phone" is-required validator="phoneNumber" placeholder="{{translate(\'phonePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("birthday")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.date" ui-date="dateOptions" is-required validator placeholder="{{translate(\'birthdayPlaceholder\')}}">\r\n        </td>\r\n      </tr> --></table><button ng-click="submitRegister()" class="default">{{translate("register")}}</button></div></div>');
$templateCache.put('/html/solution.html','<div class="solution" ng-show="!$root.preloader"><div class="form"><table class="border"><thead><th>{{translate(\'testId\')}}</th><th>{{translate(\'status\')}}</th><th>{{translate(\'execTime\')}}</th><th>{{translate(\'execMemory\')}}</th></thead><tbody><tr ng-repeat="test in solution.tests track by $index" ui-sref="^.solution({solutionId: solution.solutionId})"><td>{{$index+1}}</td><td>{{test.status}}</td><td>{{test.execTime}} ms</td><td>{{floor(test.execMemory/1024)}} kb</td></tr></tbody></table></div></div>');
$templateCache.put('/html/solutions.html','<div class="solutions"></div>');}]);
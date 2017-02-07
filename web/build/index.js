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
	}).state('cabinet.solutionsQueue', {
		url: 'queue/',
		templateUrl: "/html/solutions_queue.html",
		controller: "solutionsQueueController"
	}).state('cabinet.solution', {
		url: 'solution/{id}/',
		templateUrl: "/html/solution.html",
		controller: "solutionController"
	}).state('cabinet.admin', {
		url: 'admin/',
		templateUrl: "/html/admin.html",
		controller: "adminController"
	}).state('cabinet.admin.child', {
		url: '{type}/'
	}).state('cabinet.groups', {
		url: 'groups/',
		templateUrl: "/html/groups.html",
		controller: "groupsController"
	});
}]);
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
'use strict';

angular.module("notifyapp").factory('$server', function ($state) {
  var api = {};
  var methods = ['register', 'login', 'checkSession', 'submitProfile', 'getProfile', 'logout', 'addProblem', 'getProblem', 'getProblems', 'submitSolution', 'getSolutions', 'getMySolutions', 'getSolution', 'getProblemFull', 'acceptUserScope', 'rejectUserScope', 'getNews', 'getNewsById', 'addNews', 'editNews', 'getSolutionsByProblemId', 'getUsers', 'getSolutionsQueue'];
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
      return moment(v).format("DD.MM.YY, HH:mm");
    }
  };
});
"use strict";

angular.module("notifyapp").controller("solutionsQueueController", function ($scope, $rootScope, $state, $server, $timeout) {

  $scope.getSolutionsQueue = function () {
    $rootScope.preloader = true;
    $server.getSolutionsQueue({ problemId: $state.params.id, skip: 0, limit: 4242, lang: $rootScope.lang }, function (err, data) {
      $rootScope.$apply(function () {
        $rootScope.preloader = false;
      });
      $scope.$apply(function () {
        if (!err) {
          $scope.solutions = data;
          var isWaiting = false;
          _.each(data, function (v) {
            if (v.status == 'waiting') isWaiting = true;
            // $server.getSolution(v, (err,data)=>{})
          });
          if (isWaiting) {
            $timeout(function () {
              $scope.getSolutionsQueue();
            }, 200);
          }
        } else {}
      });
    });
  };
  $scope.getSolutionsQueue();
  $rootScope.$watch("lang", function (val) {
    $scope.getSolutionsQueue();
  });
});
"use strict";

angular.module("notifyapp").controller("solutionsController", function ($scope, $rootScope, $state, $server, $timeout) {

  $scope.getMySolutions = function () {
    $rootScope.preloader = true;
    $server.getMySolutions({ problemId: $state.params.id, skip: 0, limit: 4242, lang: $rootScope.lang }, function (err, data) {
      $rootScope.$apply(function () {
        $rootScope.preloader = false;
      });
      $scope.$apply(function () {
        if (!err) {
          $scope.solutions = data;
          var isWaiting = false;
          _.each(data, function (v) {
            if (v.status == 'waiting') isWaiting = true;
            // $server.getSolution(v, (err,data)=>{})
          });
          if (isWaiting) {
            $timeout(function () {
              $scope.getMySolutions();
            }, 200);
          }
        } else {}
      });
    });
  };
  $scope.getMySolutions();
  $rootScope.$watch("lang", function (val) {
    $scope.getMySolutions();
  });
}).controller("solutionController", function ($scope, $rootScope, $state, $server) {
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

angular.module("notifyapp").controller("problemController", function ($scope, $rootScope, $state, $server, $window, $interval) {
  $scope.solve = { problemId: $state.params.id, lang: "cpp" };
  $scope.problem = {};
  $scope.submit = function () {
    $scope.obj = JSON.parse(JSON.stringify($scope.solve));
    delete $scope.obj.sourceFile;
    $scope.obj.source = $window.btoa($scope.obj.source);
    $server.submitSolution($scope.obj, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          if ($scope.submitInterval) {
            $interval.cancel($scope.submitInterval);
          }
          $scope.submitInterval = $interval(function () {
            $scope.getSolutionsByProblemId();
          }, 300);
        } else {}
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
  $scope.$on("$destroy", function () {
    $interval.cancel($scope.submitInterval);
  });
  $scope.getSolutionsByProblemId = function () {
    $server.getSolutionsByProblemId({ problemId: $state.params.id, skip: 0, limit: 4242 }, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.solutions = [];
          var isWaiting = false;
          _.each(data, function (v) {
            if (v.problemId == $state.params.id) {
              $scope.solutions.push(v);
              if (v.status == 'waiting') isWaiting = true;
              // $server.getSolution(v, (err,data)=>{})
            }
          });
          if (!isWaiting) {
            $interval.cancel($scope.submitInterval);
          }
        } else {}
      });
    });
  };
  $scope.getSolutionsByProblemId();
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

angular.module("notifyapp").controller("mainController", function ($scope, $rootScope, $state, $translate, $server, $formatter, $timeout) {
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

  $timeout(function () {
    $scope.checkSession2 = function () {
      if (!localStorage.token) {
        // $state.go("main")
        $rootScope.isGuest = true;
        return;
      }
      $server.checkSession({}, function (err, data) {

        $scope.$apply(function () {
          if (!err) {
            $scope.user = data;
            $rootScope.isGuest = false;
            $state.go('cabinet');
          } else {
            delete localStorage.token;
            // $state.go("main");
            $rootScope.isGuest = true;
          }
        });
      });
    };
    if ($state.current.name.indexOf('cabinet') == -1) {
      $scope.checkSession2();
    }
  }, 50);

  $scope.logout = function () {
    $rootScope.isGuest = true;
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
  $scope.prevent = $rootScope.prevent = function (e) {
    e.stopPropagation();
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
      // $state.go("main")
      $rootScope.isGuest = true;
      return;
    }
    $server.checkSession({}, function (err, data) {

      $scope.$apply(function () {
        if (!err) {
          $scope.user = data;
          $rootScope.isGuest = false;
        } else {
          delete localStorage.token;
          // $state.go("main");
          $rootScope.isGuest = true;
        }
      });
    });
  };
  $scope.checkSession();
});
"use strict";

angular.module("notifyapp").controller("adminController", function ($scope, $rootScope, $state, $server) {
  $scope.acceptUserScope = function (id) {
    $server.acceptUserScope({ userId: id }, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.getUsers();
        }
      });
    });
  };
  $scope.rejectUserScope = function (id) {
    $server.rejectUserScope({ userId: id }, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.getUsers();
        }
      });
    });
  };
  $scope.getNews = function () {
    $server.getNews({}, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.news = data;
        }
      });
    });
  };
  $scope.getNewsById = function () {
    $server.getNewsById({}, function (err, data) {
      $scope.$apply(function () {
        if (!err) {}
      });
    });
  };
  $scope.addNews = function () {
    $server.addNews({}, function (err, data) {
      $scope.$apply(function () {
        if (!err) {}
      });
    });
  };
  $scope.editNews = function () {
    $server.editNews({}, function (err, data) {
      $scope.$apply(function () {
        if (!err) {}
      });
    });
  };
  $scope.getUsers = function () {
    $server.getUsers({}, function (err, data) {
      $scope.$apply(function () {
        if (!err) {
          $scope.users = data;
          console.log($scope.users);
        }
      });
    });
  };
  var events = {
    addNews: function addNews() {},
    news: function news() {
      $scope.getNews();
    },
    users: function users() {
      $scope.getUsers();
    }
  };
  $scope.state = {};
  $scope.$on("$stateChangeSuccess", function () {
    $scope.state.type = $state.params.type;

    if ($scope.state.type) {
      events[$scope.state.type]();
    }
  });
});
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
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module("notifyapp").factory('$translateRu', [function () {
  var _words;

  var words = (_words = {
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
    execMemory: "Затрачено памяти",
    myProfile: "Мой профиль",
    news: "Новости",
    tasks: "Задачи",
    mySolutions: "Мои решения",
    myGroups: "Мои группы",
    administration: "Администрирование",
    noSolutions: "У вас пока нет решений, вы сможете смотреть свои решения здесь, когда они у вас будут.",
    solutionId: "Решение №",
    problemId: "Задача №",
    created: "Дата отправки",
    lang: "Язык",
    cpp: "C++"
  }, _defineProperty(_words, "problemName", 'Название задачи'), _defineProperty(_words, "userId", "ID Пользователя"), _defineProperty(_words, "scope", "Роль"), _defineProperty(_words, "modifiedScope", "Роль на подтверждении"), _defineProperty(_words, "proceedOnTest", "Выполняется на тесте"), _defineProperty(_words, "queue", "Очередь"), _defineProperty(_words, "user", "Пользователь"), _words);
  return words;
}]);
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module("notifyapp").factory('$translateEn', [function () {
  var _words;

  var words = (_words = {
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
    execMemory: "Execution memory",
    myProfile: "My profile",
    news: "News",
    tasks: "Problems",
    mySolutions: "My Solves",
    myGroups: "My groups",
    administration: "Administration",
    noSolutions: "You haven't any solution, submit some problem and you will see solutions here.",
    solutionId: "Solution #",
    problemId: "Problem #",
    created: "Created",
    lang: "Language",
    cpp: "C++"
  }, _defineProperty(_words, "problemName", 'Problem name'), _defineProperty(_words, "userId", "user ID"), _defineProperty(_words, "scope", "Scope"), _defineProperty(_words, "modifiedScope", "Modified scope"), _defineProperty(_words, "proceedOnTest", "Run on test"), _defineProperty(_words, "queue", "Queue"), _defineProperty(_words, "user", "User"), _words);
  return words;
}]);
'use strict';

angular.module('notifyapp').run(['$templateCache', function ($templateCache) {
  $templateCache.put('/index.html', '<!DOCTYPE html>\r\n<html lang="en" ng-app="notifyapp" ng-controller="mainController">\r\n<head>\r\n    <meta charset="UTF-8">\r\n    <title>notify APP</title>\r\n    <base href="/">\r\n    <link rel="stylesheet" href="assets/init.css">\r\n    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">\r\n    <!-- bower:css -->\r\n    <!-- endbower -->\r\n\r\n    <link rel="stylesheet" href="css/index.css">\r\n</head>\r\n<body>\r\n\r\n    <header class="main-header" ng-include="\'/html/header.html\'"></header>\r\n    <div class="ui-view main-container"></div>\r\n    <footer class="main-footer" ng-include="\'/html/footer.html\'"></footer>\r\n\r\n    <!-- bower:js -->\r\n    <!-- endbower -->\r\n    \r\n    <script src="scripts/vendor.js"></script>\r\n    <script src="index.js"></script>\r\n    \r\n    \r\n    <!-- inject:js -->\r\n    <!-- endinject -->\r\n</body>\r\n</html>');
  $templateCache.put('/html/404.html', '<div>\r\n\t404\r\n</div>');
  $templateCache.put('/html/add_problem.html', '<div class="add-problem">\r\n  <h2 style="margin-bottom: 20px;">{{translate("addProblem")}}</h2>\r\n  <div class="form"  check-form="problem.isSubmitted" on-validation-ok=\'addProblem\' >\r\n    <h2 >\u0420\u0443\u0441\u0441\u043A\u0438\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442</h2>\r\n    <table>\r\n      <tr>\r\n        <td>{{translate("problemName")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="problem.name[0].value" placeholder="{{translate(\'problemNamePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("problemDescription")}}:</td>\r\n        <td>\r\n          <textarea ng-model="problem.description[0].value" placeholder="{{translate(\'problemDescriptionPlaceholder\')}}"></textarea>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n\r\n    <h2>\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442</h2>\r\n    <table>\r\n      <tr>\r\n        <td>{{translate("problemName")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="problem.name[1].value" placeholder="{{translate(\'problemNamePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("problemDescription")}}:</td>\r\n        <td>\r\n          <textarea ng-model="problem.description[1].value" placeholder="{{translate(\'problemDescriptionPlaceholder\')}}"></textarea>\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("timeLimit")}}:</td>\r\n        <td>\r\n          <input type="number" ng-model="problem.timeLimit" placeholder="{{translate(\'timelimitPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("memoryLimit")}}:</td>\r\n        <td>\r\n          <input type="number" ng-model="problem.memoryLimit" placeholder="{{translate(\'memoryLimitPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n\r\n      <tr>\r\n        <td>{{translate("tests")}}:</td>\r\n        <td>\r\n          <input type="file" multiple ng-file-model="problem.samples">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("solution")}}:</td>\r\n        <td>\r\n          <input type="file" multiple ng-file-model="problem.outputSourceFile">\r\n          <textarea  ng-model="problem.outputSource"></textarea>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n\r\n\r\n    <button ng-click="submitAddProblem()" class="default">\r\n      <span ng-if="!user.addProblemPreloader">{{translate("save")}}</span>\r\n      <span ng-if="user.addProblemPreloader" class="button-preloader"></span>\r\n    </button>\r\n    <p class="error" ng-if="user.error" style="margin-top: 10px;">{{user.error}}</p>\r\n  </div>\r\n</div>');
  $templateCache.put('/html/admin.html', '<div class="admin">\r\n  <ul class="links">\r\n    <li ng-class="{\'active\': state.type==\'news\'}"><a ui-sref="cabinet.admin.child({type:\'news\'})">\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u0438</a></li>\r\n    <li ng-class="{\'active\': state.type==\'addNews\'}"><a ui-sref="cabinet.admin.child({type:\'addNews\'})">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u044C</a></li>\r\n    <li ng-class="{\'active\': state.type==\'users\'}"><a ui-sref="cabinet.admin.child({type:\'users\'})">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438</a></li>\r\n  </ul>\r\n\r\n  <div class="admin-content">\r\n    <div class="news" ng-if="state.type==\'news\'"></div>\r\n\r\n    <div class="add-news" ng-if="state.type==\'addNews\'"></div>\r\n\r\n    <div class="users" ng-if="state.type==\'users\'">\r\n      <table class="default">\r\n        <thead>\r\n          <th>{{translate(\'userId\')}}</th>\r\n          <th>{{translate(\'name\')}}</th>\r\n          <th>{{translate(\'scope\')}}</th>\r\n          <th>{{translate(\'modifiedScope\')}}</th>\r\n        </thead>\r\n        <tbody>\r\n          <tr ng-repeat="user in users">\r\n            <td>{{user.userId}}</td>\r\n            <td>{{user.name}} ({{user.email}})</td>\r\n            <td>{{translate(user.scope)}}</td>\r\n            <td>\r\n              <p ng-if="user.modifiedScope">\r\n                <span style="display: inline-block;margin-right: 10px;">{{translate(user.modifiedScope)}}</span>\r\n                <button class="default" ng-click="acceptUserScope(user.userId)">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C</button>\r\n                <button class="default" ng-click="acceptUserScope(user.userId)">\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C</button>\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n    </div>\r\n  </div>\r\n</div>');
  $templateCache.put('/html/cabinet.html', '<div class="wrapper cabinet">\r\n  <div class="left-menu">\r\n    <ul>\r\n      <li ui-sref=".profile" ng-if="!$root.isGuest"><a>{{translate(\'myProfile\')}}</a></li>\r\n      <li ui-sref=".solutionsQueue"><a>{{translate(\'queue\')}}</a></li>\r\n      <li ui-sref=".news"><a>{{translate(\'news\')}}</a></li>\r\n      <li ui-sref=".problems"><a>{{translate(\'tasks\')}}</a></li>\r\n      <li ui-sref=".solutions" ng-if="!$root.isGuest"><a>{{translate(\'mySolutions\')}}</a></li>\r\n      <li ui-sref=".groups" ng-if="!$root.isGuest"><a>{{translate(\'myGroups\')}}</a></li>\r\n      <li ui-sref=".admin" ng-if="user.scope==\'admin\'"><a>{{translate(\'administration\')}}</a></li>\r\n    </ul>\r\n  </div><!--\r\n  --><div class="cabinet-inner" ui-view></div>\r\n</div>');
  $templateCache.put('/html/footer.html', '<div class="wrapper">\r\n  <img src="assets/img/js.png" width="50" height="50" alt="js">\r\n  \r\n</div>');
  $templateCache.put('/html/groups.html', '<div class="groups"></div>');
  $templateCache.put('/html/header.html', '<div class="wrapper">\r\n  <img src="assets/img/js.png" width="50" height="50" alt="js">\r\n  <img src="assets/img/menu.svg" alt="" id="menu-img" ng-click="showMenu =! showMenu">\r\n  <ul class="links">\r\n    <li ng-if="$root.isGuest"><a ui-sref="login">{{translate("logIn")}}</a></li>\r\n    <li ng-if="$root.isGuest"><a ui-sref="register">{{translate("register")}}</a></li>\r\n    <li><a ng-click="setLang(\'ru\')">Ru</a></li>\r\n    <li><a ng-click="setLang(\'en\')">En</a></li>\r\n    <li ng-if="!$root.isGuest"><a ng-click="logout()">{{translate("logout")}}</a></li>\r\n  </ul>\r\n  <ul class="links-mobile" ng-show="showMenu" ng-click="showMenu = false">\r\n    <li ui-sref="login" ng-if="$root.isGuest"><a>{{translate("logIn")}}</a></li>\r\n    <li ui-sref="register" ng-if="$root.isGuest"><a>{{translate("register")}}</a></li>\r\n    <li ng-click="setLang(\'ru\')"><a>Ru</a></li>\r\n    <li ng-click="setLang(\'en\')"><a>En</a></li>\r\n    <li ng-click="logout()" ng-if="!$root.isGuest"><a>{{translate("logout")}}</a></li>\r\n  </ul>\r\n</div>');
  $templateCache.put('/html/index.html', '\r\n<div class="wrapper">\r\n  <h1>Hello site!</h1>\r\n</div>\r\n');
  $templateCache.put('/html/login.html', '<div class="wrapper">\r\n  <ul class="breadcrumb">\r\n    <li class="breadcrumb-item"><a href="" ui-sref="main">{{translate("homePage")}}</a></li>\r\n  </ul>\r\n  <h2>\u0412\u0445\u043E\u0434</h2>\r\n  <div class="form"  check-form="user.isSubmitted" on-validation-ok=\'register\' >\r\n    <table>\r\n      \r\n      <tr>\r\n        <td>{{translate("email")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}" on-enter-press="login()">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("password")}}:</td>\r\n        <td>\r\n          <input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}" on-enter-press="login()">\r\n        </td>\r\n      </tr>\r\n    </table>\r\n    <p class="error" ng-if="user.error">\u0412\u044B \u0443\u043A\u0430\u0437\u0430\u043B\u0438 \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C</p>\r\n    <button ng-click="login()" class="default">\u0412\u043E\u0439\u0442\u0438</button>\r\n  </div>\r\n</div>');
  $templateCache.put('/html/news.html', '<div class="news"></div>');
  $templateCache.put('/html/problem.html', '<div class="problem" ng-show="!$root.preloader">\r\n  \r\n  <button class="default" ui-sref="^.addProblem({id: solve.problemId})" ng-if="user.scope==\'admin\'">{{translate(\'editProblem\')}}</button>\r\n\r\n  <h1>{{problem.name}}</h1>\r\n  <div ng-bind-html="problem.description"></div>\r\n\r\n\r\n  <div class="wrapper-problem">\r\n    <div class="samples">\r\n      <table>\r\n        <tr ng-repeat="sample in problem.samples">\r\n          <td>\r\n            <p>\r\n              {{sample.input}}\r\n            </p>\r\n          </td>\r\n          <td>\r\n            <p >\r\n                {{sample.output}}\r\n              </p>\r\n          </td>\r\n        </tr>\r\n      </table>\r\n\r\n    </div>\r\n    <a ng-click="showAllSamples()" class="blue show-tests">{{translate(\'showAllTests\')}}</a>\r\n    <div class="solve">\r\n      <input type="file" ng-file-model="solve.sourceFile" style="margin-bottom: 10px;">\r\n      <textarea placeholder="\u0418\u0441\u0445\u043E\u0434\u043D\u044B\u0439 \u043A\u043E\u0434 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u044E\u0434\u0430" ng-model="solve.source"></textarea>\r\n      \r\n      <div class="processing">\r\n        <button class="default" ng-click="submit()">\r\n          <span ng-if="!solve.profileSubmitPreloader">{{translate("submit")}}</span>\r\n          <span ng-if="solve.profileSubmitPreloader" class="button-preloader"></span>\r\n        </button>\r\n        <p class="progress">submiting....</p>\r\n      </div>\r\n    </div>\r\n    <div class="solutions" ng-if="solutions.length">\r\n      <table class="default">\r\n        <thead>\r\n          <th>{{translate(\'solutionId\')}}</th>\r\n          <th>{{translate(\'created\')}}</th>\r\n          <th>{{translate(\'lang\')}}</th>\r\n          <th>{{translate(\'status\')}}</th>\r\n        </thead>\r\n        <tbody>\r\n          <tr ng-repeat="solution in solutions" ui-sref="^.solution({id: solution.solutionId})" ng-class="{\'green\': solution.status==\'ok\', \'yellow\': solution.status==\'waiting\', \'red\': (solution.status!=\'ok\'&&solution.status!=\'waiting\')}">\r\n            <td>{{solution.solutionId}}</td>\r\n            <td>{{dateFormat(solution.created)}}</td>\r\n            <td>{{translate(solution.lang)}}</td>\r\n            <td>\r\n              <span ng-if="solution.status!=\'waiting\'">{{solution.status}}</span>\r\n              <span ng-if="solution.status==\'waiting\'">\r\n                <span ng-if="+solution.testPassed">{{translate(\'proceedOnTest\') + " " + solution.testPassed+"/"+solution.testCount}}</span>\r\n                <span ng-if="!+solution.testPassed">{{solution.status}}</span>\r\n              </span>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n  </div>\r\n</div>');
  $templateCache.put('/html/problems.html', '<div class="problems">\r\n  <button class="default" ui-sref="^.addProblem" ng-if="user.scope==\'admin\' || user.scope==\'teacher\'">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443</button>\r\n  <table class="problems-table">\r\n    <thead>\r\n      <th>ID</th>\r\n      <th>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</th>\r\n      <th>\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C</th>\r\n      <th>\u0410\u0432\u0442\u043E\u0440</th>\r\n    </thead>\r\n    <tbody>\r\n      <tr ng-repeat="problem in problems" ui-sref="cabinet.problem({id: problem.problemId})">\r\n        <td>{{problem.problemId}}</td>\r\n        <td>{{problem.name}}</td>\r\n        <td><img src="assets/img/muscles.png" alt="" width="14" height="13" ng-repeat="el in nTimes(problem.difficulty)"></td>\r\n        <td>{{problem.author}}</td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n</div>');
  $templateCache.put('/html/profile.html', '<div class="profile">\r\n  <h2>{{translate("profile")}}</h2>\r\n  <div class="form"  check-form="user.isSubmitted" on-validation-ok=\'editProfile\' >\r\n    <table>\r\n      <tr>\r\n        <td>{{translate("name")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.name" is-required validator placeholder="{{translate(\'namePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n<!--       <tr>\r\n        <td>{{translate("email")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}">\r\n        </td>\r\n      </tr> -->\r\n     <!--  <tr>\r\n        <td>{{translate("password")}}:</td>\r\n        <td>\r\n          <input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}">\r\n        </td>\r\n      </tr> -->\r\n      <tr>\r\n        <td>{{translate("phone")}}:</td>\r\n        <td>\r\n          <input type="tel" ng-model="user.phone" is-required validator="phoneNumber" placeholder="{{translate(\'phonePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("birthday")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.birthday" ui-date="dateOptions" is-required validator placeholder="{{translate(\'birthdayPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>\r\n          <p>\u0420\u043E\u043B\u044C:</p>\r\n          <p>({{translate(user.scope)}})</p>\r\n        </td>\r\n        <td>\r\n           <div class="input-wrapper"><input type="radio" id="1" ng-model="user.modifiedScope" value="student"><label for="1">{{translate(\'student\')}} <span class="light" ng-if="user.modifiedScopeStart == \'student\'">({{translate(\'on_moderation\')}})</span></label></div>\r\n           <div class="input-wrapper"><input type="radio" id="2" ng-model="user.modifiedScope" value="teacher"><label for="2">{{translate(\'teacher\')}} <span class="light" ng-if="user.modifiedScopeStart == \'teacher\'">({{translate(\'on_moderation\')}})</span></label></div>\r\n           <div class="input-wrapper"><input type="radio" id="3" ng-model="user.modifiedScope" value="admin"><label for="3">{{translate(\'admin\')}} <span class="light" ng-if="user.modifiedScopeStart == \'admin\'">({{translate(\'on_moderation\')}})</span></label></div>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n    <button ng-click="submitProfile()" class="default">\r\n      <span ng-if="!user.profileSubmitPreloader">{{translate("save")}}</span>\r\n      <span ng-if="user.profileSubmitPreloader" class="button-preloader"></span>\r\n    </button>\r\n    <p class="error" ng-if="user.error" style="margin-top: 10px;">{{user.error}}</p>\r\n  </div>\r\n</div>');
  $templateCache.put('/html/register.html', '<div class="wrapper">\r\n  <ul class="breadcrumb">\r\n    <li class="breadcrumb-item"><a href="" ui-sref="main">{{translate("homePage")}}</a></li>\r\n  </ul>\r\n  <h2>{{translate("register")}}</h2>\r\n  <div class="form"  check-form="user.isSubmitted" on-validation-ok=\'register\' >\r\n    <table>\r\n     <!--  <tr>\r\n        <td>{{translate("name")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.name" is-required validator placeholder="{{translate(\'namePlaceholder\')}}">\r\n        </td>\r\n      </tr> -->\r\n      <tr>\r\n        <td>{{translate("email")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("password")}}:</td>\r\n        <td>\r\n          <input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n     <!--  <tr>\r\n        <td>{{translate("phone")}}:</td>\r\n        <td>\r\n          <input type="tel" ng-model="user.phone" is-required validator="phoneNumber" placeholder="{{translate(\'phonePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("birthday")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.date" ui-date="dateOptions" is-required validator placeholder="{{translate(\'birthdayPlaceholder\')}}">\r\n        </td>\r\n      </tr> -->\r\n    </table>\r\n    <button ng-click="submitRegister()" class="default">{{translate("register")}}</button>\r\n  </div>\r\n</div>');
  $templateCache.put('/html/solution.html', '<div class="solution" ng-show="!$root.preloader">\r\n  <div class="form">\r\n    <table class="border default">\r\n      <thead>\r\n        <th>{{translate(\'testId\')}}</th>\r\n        <th>{{translate(\'status\')}}</th>\r\n        <th>{{translate(\'execTime\')}}</th>\r\n        <th>{{translate(\'execMemory\')}}</th>\r\n      </thead>\r\n      <tbody>\r\n        <tr ng-repeat="test in solution.tests track by $index" ui-sref="^.solution({solutionId: solution.solutionId})">\r\n          <td><span style="width: 25px;display: inline-block;">{{$index+1}}</span> <img src="assets/img/tick.png"  alt="" ng-if="test.status==\'ok\'" width="13" height="13" ></td>\r\n          <td>{{test.status}}</td>\r\n          <td>{{test.execTime}} ms</td>\r\n          <td>{{floor(test.execMemory/1024)}} kb</td>\r\n        </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n</div>');
  $templateCache.put('/html/solutions.html', '<div class="solutions" ng-show="!$root.preloader || true">\r\n  <table ng-if="solutions.length" class="default">\r\n    <thead>\r\n      <th>{{translate(\'solutionId\')}}</th>\r\n      <th>{{translate(\'problemId\')}}</th>\r\n      <th>{{translate(\'problemName\')}}</th>\r\n      <th>{{translate(\'created\')}}</th>\r\n      <th>{{translate(\'lang\')}}</th>\r\n      <th>{{translate(\'status\')}}</th>\r\n    </thead>\r\n    <tbody>\r\n      <tr ng-repeat="solution in solutions" ui-sref="^.solution({id: solution.solutionId})" ng-class="{\'green\': solution.status==\'ok\', \'yellow\': solution.status==\'waiting\', \'red\': (solution.status!=\'ok\'&&solution.status!=\'waiting\')}">\r\n        <td>{{solution.solutionId}}</td>\r\n        <td ng-click="prevent($event);" ui-sref="cabinet.problem({id: solution.problemId})">{{solution.problemId}}</td>\r\n        <td ng-click="prevent($event);" ui-sref="cabinet.problem({id: solution.problemId})">{{solution.problemName}}</td>\r\n        <td>{{dateFormat(solution.created)}}</td>\r\n        <td>{{translate(solution.lang)}}</td>\r\n        <td>\r\n          <span ng-if="solution.status!=\'waiting\'">{{solution.status}}</span>\r\n          <span ng-if="solution.status==\'waiting\'">\r\n            <span ng-if="+solution.testPassed">{{translate(\'proceedOnTest\') + " " + solution.testPassed+"/"+solution.testCount}}</span>\r\n            <span ng-if="!+solution.testPassed">{{solution.status}}</span>\r\n          </span>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n\r\n  <p ng-if="!solutions.length && !$root.preloader">{{translate(\'noSolutions\')}} <a ui-sref="^.problems" class="blue">\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0437\u0430\u0434\u0430\u0447</a></p>\r\n</div>\r\n');
  $templateCache.put('/html/solutions_queue.html', '<div class="solutions" ng-show="!$root.preloader || true">\r\n  <table ng-if="solutions.length" class="default">\r\n    <thead>\r\n      <th>{{translate(\'solutionId\')}}</th>\r\n      <th>{{translate(\'user\')}}</th>\r\n      <th>{{translate(\'problemName\')}}</th>\r\n      <th>{{translate(\'created\')}}</th>\r\n      <th>{{translate(\'lang\')}}</th>\r\n      <th>{{translate(\'status\')}}</th>\r\n    </thead>\r\n    <tbody>\r\n      <tr ng-repeat="solution in solutions" ui-sref="^.solution({id: solution.solutionId})" ng-class="{\'green\': solution.status==\'ok\', \'yellow\': solution.status==\'waiting\', \'red\': (solution.status!=\'ok\'&&solution.status!=\'waiting\')}">\r\n        <td>{{solution.solutionId}}</td>\r\n        <td ng-click="prevent($event);">{{solution.userName}}</td>\r\n        <td ng-click="prevent($event);" ui-sref="cabinet.problem({id: solution.problemId})">{{solution.problemName}}</td>\r\n        <td>{{dateFormat(solution.created)}}</td>\r\n        <td>{{translate(solution.lang)}}</td>\r\n        <td>\r\n          <span ng-if="solution.status!=\'waiting\'">{{solution.status}}</span>\r\n          <span ng-if="solution.status==\'waiting\'">\r\n            <span ng-if="+solution.testPassed">{{translate(\'proceedOnTest\') + " " + solution.testPassed+"/"+solution.testCount}}</span>\r\n            <span ng-if="!+solution.testPassed">{{solution.status}}</span>\r\n          </span>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n\r\n  <p ng-if="!solutions.length && !$root.preloader">{{translate(\'noSolutions\')}} <a ui-sref="^.problems" class="blue">\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0437\u0430\u0434\u0430\u0447</a></p>\r\n</div>\r\n');
}]);
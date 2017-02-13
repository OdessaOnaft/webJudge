angular.module('notifyapp').run(['$templateCache', function($templateCache) {$templateCache.put('/index.html','<!DOCTYPE html>\r\n<html lang="en" ng-app="notifyapp" ng-controller="mainController">\r\n<head>\r\n    <meta charset="UTF-8">\r\n    <title>notify APP</title>\r\n    <base href="/">\r\n    <link rel="stylesheet" href="assets/init.css">\r\n    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">\r\n    <!-- bower:css -->\r\n    <!-- endbower -->\r\n\r\n    <link rel="stylesheet" href="css/index.css">\r\n</head>\r\n<body>\r\n\r\n    <header class="main-header" ng-include="\'/html/header.html\'"></header>\r\n    <div class="ui-view main-container"></div>\r\n    <footer class="main-footer" ng-include="\'/html/footer.html\'"></footer>\r\n\r\n    <!-- bower:js -->\r\n    <!-- endbower -->\r\n    \r\n    <script src="scripts/vendor.js"></script>\r\n    <script src="index.js"></script>\r\n    \r\n    \r\n    <!-- inject:js -->\r\n    <!-- endinject -->\r\n</body>\r\n</html>');
$templateCache.put('/html/404.html','<div>\r\n\t404\r\n</div>');
$templateCache.put('/html/add_problem.html','<div class="add-problem">\r\n  <h2 style="margin-bottom: 20px;">{{translate("addProblem")}}</h2>\r\n  <div class="form"  check-form="problem.isSubmitted" on-validation-ok=\'addProblem\' >\r\n    <h2 >\u0420\u0443\u0441\u0441\u043A\u0438\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442</h2>\r\n    <table>\r\n      <tr>\r\n        <td>{{translate("problemName")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="problem.name[0].value" placeholder="{{translate(\'problemNamePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("problemDescription")}}:</td>\r\n        <td>\r\n          <textarea ng-model="problem.description[0].value" placeholder="{{translate(\'problemDescriptionPlaceholder\')}}"></textarea>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n\r\n    <h2>\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442</h2>\r\n    <table>\r\n      <tr>\r\n        <td>{{translate("problemName")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="problem.name[1].value" placeholder="{{translate(\'problemNamePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("problemDescription")}}:</td>\r\n        <td>\r\n          <textarea ng-model="problem.description[1].value" placeholder="{{translate(\'problemDescriptionPlaceholder\')}}"></textarea>\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("timeLimit")}}:</td>\r\n        <td>\r\n          <input type="number" ng-model="problem.timeLimit" placeholder="{{translate(\'timelimitPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("memoryLimit")}}:</td>\r\n        <td>\r\n          <input type="number" ng-model="problem.memoryLimit" placeholder="{{translate(\'memoryLimitPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n\r\n      <tr>\r\n        <td>{{translate("tests")}}:</td>\r\n        <td>\r\n          <input type="file" multiple ng-file-model="problem.samples">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("solution")}}:</td>\r\n        <td>\r\n          <input type="file" multiple ng-file-model="problem.outputSourceFile">\r\n          <textarea  ng-model="problem.outputSource"></textarea>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n\r\n\r\n    <button ng-click="submitAddProblem()" class="default">\r\n      <span ng-if="!user.addProblemPreloader">{{translate("save")}}</span>\r\n      <span ng-if="user.addProblemPreloader" class="button-preloader"></span>\r\n    </button>\r\n    <p class="error" ng-if="user.error" style="margin-top: 10px;">{{user.error}}</p>\r\n  </div>\r\n</div>');
$templateCache.put('/html/admin.html','<div class="admin">\r\n  <ul class="links">\r\n    <li ng-class="{\'active\': state.type==\'news\'}"><a ui-sref="cabinet.admin.child({type:\'news\'})">\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u0438</a></li>\r\n    <li ng-class="{\'active\': state.type==\'addNews\'}"><a ui-sref="cabinet.admin.child({type:\'addNews\'})">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0441\u0442\u044C</a></li>\r\n    <li ng-class="{\'active\': state.type==\'users\'}"><a ui-sref="cabinet.admin.child({type:\'users\'})">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438</a></li>\r\n  </ul>\r\n\r\n  <div class="admin-content">\r\n    <div class="news" ng-if="state.type==\'news\'"></div>\r\n\r\n    <div class="add-news" ng-if="state.type==\'addNews\'"></div>\r\n\r\n    <div class="users" ng-if="state.type==\'users\'">\r\n      <table class="default">\r\n        <thead>\r\n          <th>{{translate(\'userId\')}}</th>\r\n          <th>{{translate(\'name\')}}</th>\r\n          <th>{{translate(\'scope\')}}</th>\r\n          <th>{{translate(\'modifiedScope\')}}</th>\r\n        </thead>\r\n        <tbody>\r\n          <tr ng-repeat="user in users">\r\n            <td>{{user.userId}}</td>\r\n            <td>{{user.name}} ({{user.email}})</td>\r\n            <td>{{translate(user.scope)}}</td>\r\n            <td>\r\n              <p ng-if="user.modifiedScope">\r\n                <span style="display: inline-block;margin-right: 10px;">{{translate(user.modifiedScope)}}</span>\r\n                <button class="default" ng-click="acceptUserScope(user.userId)">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C</button>\r\n                <button class="default" ng-click="acceptUserScope(user.userId)">\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C</button>\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n    </div>\r\n  </div>\r\n</div>');
$templateCache.put('/html/cabinet.html','<div class="wrapper cabinet">\r\n  <div class="left-menu">\r\n    <ul>\r\n      <li ui-sref=".profile" ng-if="!$root.isGuest"><a>{{translate(\'myProfile\')}}</a></li>\r\n      <li ui-sref=".solutionsQueue"><a>{{translate(\'queue\')}}</a></li>\r\n      <li ui-sref=".news"><a>{{translate(\'news\')}}</a></li>\r\n      <li ui-sref=".problems"><a>{{translate(\'tasks\')}}</a></li>\r\n      <li ui-sref=".solutions" ng-if="!$root.isGuest"><a>{{translate(\'mySolutions\')}}</a></li>\r\n      <li ui-sref=".groups" ng-if="!$root.isGuest"><a>{{translate(\'myGroups\')}}</a></li>\r\n      <li ui-sref=".admin" ng-if="user.scope==\'admin\'"><a>{{translate(\'administration\')}}</a></li>\r\n    </ul>\r\n  </div><!--\r\n  --><div class="cabinet-inner" ui-view></div>\r\n</div>');
$templateCache.put('/html/footer.html','<div class="wrapper">\r\n  <img src="assets/img/js.png" width="50" height="50" alt="js">\r\n  \r\n</div>');
$templateCache.put('/html/groups.html','<div class="groups"></div>');
$templateCache.put('/html/header.html','<div class="wrapper">\r\n  <img src="assets/img/js.png" width="50" height="50" alt="js">\r\n  <img src="assets/img/menu.svg" alt="" id="menu-img" ng-click="showMenu =! showMenu">\r\n  <ul class="links">\r\n    <li ng-if="$root.isGuest"><a ui-sref="login">{{translate("logIn")}}</a></li>\r\n    <li ng-if="$root.isGuest"><a ui-sref="register">{{translate("register")}}</a></li>\r\n    <li><a ng-click="setLang(\'ru\')">Ru</a></li>\r\n    <li><a ng-click="setLang(\'en\')">En</a></li>\r\n    <li ng-if="!$root.isGuest"><a ng-click="logout()">{{translate("logout")}}</a></li>\r\n  </ul>\r\n  <ul class="links-mobile" ng-show="showMenu" ng-click="showMenu = false">\r\n    <li ui-sref="login" ng-if="$root.isGuest"><a>{{translate("logIn")}}</a></li>\r\n    <li ui-sref="register" ng-if="$root.isGuest"><a>{{translate("register")}}</a></li>\r\n    <li ng-click="setLang(\'ru\')"><a>Ru</a></li>\r\n    <li ng-click="setLang(\'en\')"><a>En</a></li>\r\n    <li ng-click="logout()" ng-if="!$root.isGuest"><a>{{translate("logout")}}</a></li>\r\n  </ul>\r\n</div>');
$templateCache.put('/html/index.html','\r\n<div class="wrapper">\r\n  <h1>Hello site!</h1>\r\n</div>\r\n');
$templateCache.put('/html/login.html','<div class="wrapper">\r\n  <ul class="breadcrumb">\r\n    <li class="breadcrumb-item"><a href="" ui-sref="main">{{translate("homePage")}}</a></li>\r\n  </ul>\r\n  <h2>\u0412\u0445\u043E\u0434</h2>\r\n  <div class="form"  check-form="user.isSubmitted" on-validation-ok=\'register\' >\r\n    <table>\r\n      \r\n      <tr>\r\n        <td>{{translate("email")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}" on-enter-press="login()">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("password")}}:</td>\r\n        <td>\r\n          <input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}" on-enter-press="login()">\r\n        </td>\r\n      </tr>\r\n    </table>\r\n    <p class="error" ng-if="user.error">\u0412\u044B \u0443\u043A\u0430\u0437\u0430\u043B\u0438 \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C</p>\r\n    <button ng-click="login()" class="default">\u0412\u043E\u0439\u0442\u0438</button>\r\n  </div>\r\n</div>');
$templateCache.put('/html/news.html','<div class="news"></div>');
$templateCache.put('/html/problem.html','<div class="problem" ng-show="!$root.preloader">\r\n  \r\n  <button class="default" ui-sref="^.addProblem({id: solve.problemId})" ng-if="user.scope==\'admin\'">{{translate(\'editProblem\')}}</button>\r\n\r\n  <h1>{{problem.name}}</h1>\r\n  <div ng-bind-html="problem.description"></div>\r\n\r\n\r\n  <div class="wrapper-problem">\r\n    <div class="samples">\r\n      <table>\r\n        <tr ng-repeat="sample in problem.samples">\r\n          <td>\r\n            <p>\r\n              {{sample.input}}\r\n            </p>\r\n          </td>\r\n          <td>\r\n            <p >\r\n                {{sample.output}}\r\n              </p>\r\n          </td>\r\n        </tr>\r\n      </table>\r\n\r\n    </div>\r\n    <a ng-click="showAllSamples()" class="blue show-tests">{{translate(\'showAllTests\')}}</a>\r\n    <div class="solve">\r\n      <input type="file" ng-file-model="solve.sourceFile" style="margin-bottom: 10px;">\r\n      <textarea placeholder="\u0418\u0441\u0445\u043E\u0434\u043D\u044B\u0439 \u043A\u043E\u0434 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u044B \u0432\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0441\u044E\u0434\u0430" ng-model="solve.source"></textarea>\r\n      \r\n      <div class="processing">\r\n        <button class="default" ng-click="submit()">\r\n          <span ng-if="!solve.profileSubmitPreloader">{{translate("submit")}}</span>\r\n          <span ng-if="solve.profileSubmitPreloader" class="button-preloader"></span>\r\n        </button>\r\n        <p class="progress">submiting....</p>\r\n      </div>\r\n    </div>\r\n    <div class="solutions" ng-if="solutions.length">\r\n      <table class="default">\r\n        <thead>\r\n          <th>{{translate(\'solutionId\')}}</th>\r\n          <th>{{translate(\'created\')}}</th>\r\n          <th>{{translate(\'lang\')}}</th>\r\n          <th>{{translate(\'status\')}}</th>\r\n        </thead>\r\n        <tbody>\r\n          <tr ng-repeat="solution in solutions" ui-sref="^.solution({id: solution.solutionId})" ng-class="{\'green\': solution.status==\'ok\', \'yellow\': solution.status==\'waiting\', \'red\': (solution.status!=\'ok\'&&solution.status!=\'waiting\')}">\r\n            <td>{{solution.solutionId}}</td>\r\n            <td>{{dateFormat(solution.created)}}</td>\r\n            <td>{{translate(solution.lang)}}</td>\r\n            <td>\r\n              <span ng-if="solution.status!=\'waiting\'">{{solution.status}}</span>\r\n              <span ng-if="solution.status==\'waiting\'">\r\n                <span ng-if="+solution.testPassed">{{translate(\'proceedOnTest\') + " " + solution.testPassed+"/"+solution.testCount}}</span>\r\n                <span ng-if="!+solution.testPassed">{{solution.status}}</span>\r\n              </span>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n  </div>\r\n</div>');
$templateCache.put('/html/problems.html','<div class="problems">\r\n  <button class="default" ui-sref="^.addProblem" ng-if="user.scope==\'admin\' || user.scope==\'teacher\'">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443</button>\r\n  <table class="problems-table">\r\n    <thead>\r\n      <th>ID</th>\r\n      <th>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435</th>\r\n      <th>\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C</th>\r\n      <th>\u0410\u0432\u0442\u043E\u0440</th>\r\n    </thead>\r\n    <tbody>\r\n      <tr ng-repeat="problem in problems" ui-sref="cabinet.problem({id: problem.problemId})">\r\n        <td>{{problem.problemId}}</td>\r\n        <td>{{problem.name}}</td>\r\n        <td><img src="assets/img/muscles.png" alt="" width="14" height="13" ng-repeat="el in nTimes(problem.difficulty)"></td>\r\n        <td>{{problem.author}}</td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n</div>');
$templateCache.put('/html/profile.html','<div class="profile">\r\n  <h2>{{translate("profile")}}</h2>\r\n  <div class="form"  check-form="user.isSubmitted" on-validation-ok=\'editProfile\' >\r\n    <table>\r\n      <tr>\r\n        <td>{{translate("name")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.name" is-required validator placeholder="{{translate(\'namePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n<!--       <tr>\r\n        <td>{{translate("email")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}">\r\n        </td>\r\n      </tr> -->\r\n     <!--  <tr>\r\n        <td>{{translate("password")}}:</td>\r\n        <td>\r\n          <input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}">\r\n        </td>\r\n      </tr> -->\r\n      <tr>\r\n        <td>{{translate("phone")}}:</td>\r\n        <td>\r\n          <input type="tel" ng-model="user.phone" is-required validator="phoneNumber" placeholder="{{translate(\'phonePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("birthday")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.birthday" ui-date="dateOptions" is-required validator placeholder="{{translate(\'birthdayPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>\r\n          <p>\u0420\u043E\u043B\u044C:</p>\r\n          <p>({{translate(user.scope)}})</p>\r\n        </td>\r\n        <td>\r\n           <div class="input-wrapper"><input type="radio" id="1" ng-model="user.modifiedScope" value="student"><label for="1">{{translate(\'student\')}} <span class="light" ng-if="user.modifiedScopeStart == \'student\'">({{translate(\'on_moderation\')}})</span></label></div>\r\n           <div class="input-wrapper"><input type="radio" id="2" ng-model="user.modifiedScope" value="teacher"><label for="2">{{translate(\'teacher\')}} <span class="light" ng-if="user.modifiedScopeStart == \'teacher\'">({{translate(\'on_moderation\')}})</span></label></div>\r\n           <div class="input-wrapper"><input type="radio" id="3" ng-model="user.modifiedScope" value="admin"><label for="3">{{translate(\'admin\')}} <span class="light" ng-if="user.modifiedScopeStart == \'admin\'">({{translate(\'on_moderation\')}})</span></label></div>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n    <button ng-click="submitProfile()" class="default">\r\n      <span ng-if="!user.profileSubmitPreloader">{{translate("save")}}</span>\r\n      <span ng-if="user.profileSubmitPreloader" class="button-preloader"></span>\r\n    </button>\r\n    <p class="error" ng-if="user.error" style="margin-top: 10px;">{{user.error}}</p>\r\n  </div>\r\n</div>');
$templateCache.put('/html/register.html','<div class="wrapper">\r\n  <ul class="breadcrumb">\r\n    <li class="breadcrumb-item"><a href="" ui-sref="main">{{translate("homePage")}}</a></li>\r\n  </ul>\r\n  <h2>{{translate("register")}}</h2>\r\n  <div class="form"  check-form="user.isSubmitted" on-validation-ok=\'register\' >\r\n    <table>\r\n     <!--  <tr>\r\n        <td>{{translate("name")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.name" is-required validator placeholder="{{translate(\'namePlaceholder\')}}">\r\n        </td>\r\n      </tr> -->\r\n      <tr>\r\n        <td>{{translate("email")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.email" is-required validator="email" placeholder="{{translate(\'emailPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("password")}}:</td>\r\n        <td>\r\n          <input type="password" ng-model="user.password" is-required validator placeholder="{{translate(\'passwordPlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n     <!--  <tr>\r\n        <td>{{translate("phone")}}:</td>\r\n        <td>\r\n          <input type="tel" ng-model="user.phone" is-required validator="phoneNumber" placeholder="{{translate(\'phonePlaceholder\')}}">\r\n        </td>\r\n      </tr>\r\n      <tr>\r\n        <td>{{translate("birthday")}}:</td>\r\n        <td>\r\n          <input type="text" ng-model="user.date" ui-date="dateOptions" is-required validator placeholder="{{translate(\'birthdayPlaceholder\')}}">\r\n        </td>\r\n      </tr> -->\r\n    </table>\r\n    <button ng-click="submitRegister()" class="default">{{translate("register")}}</button>\r\n  </div>\r\n</div>');
$templateCache.put('/html/solution.html','<div class="solution" ng-show="!$root.preloader">\r\n  <div class="form">\r\n    <table class="border default">\r\n      <thead>\r\n        <th>{{translate(\'testId\')}}</th>\r\n        <th>{{translate(\'status\')}}</th>\r\n        <th>{{translate(\'execTime\')}}</th>\r\n        <th>{{translate(\'execMemory\')}}</th>\r\n      </thead>\r\n      <tbody>\r\n        <tr ng-repeat="test in solution.tests track by $index" ui-sref="^.solution({solutionId: solution.solutionId})">\r\n          <td><span style="width: 25px;display: inline-block;">{{$index+1}}</span> <img src="assets/img/tick.png"  alt="" ng-if="test.status==\'ok\'" width="13" height="13" ></td>\r\n          <td>{{test.status}}</td>\r\n          <td>{{test.execTime}} ms</td>\r\n          <td>{{floor(test.execMemory/1024)}} kb</td>\r\n        </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n</div>');
$templateCache.put('/html/solutions.html','<div class="solutions" ng-show="!$root.preloader || true">\r\n  <table ng-if="solutions.length" class="default">\r\n    <thead>\r\n      <th>{{translate(\'solutionId\')}}</th>\r\n      <th>{{translate(\'problemId\')}}</th>\r\n      <th>{{translate(\'problemName\')}}</th>\r\n      <th>{{translate(\'created\')}}</th>\r\n      <th>{{translate(\'lang\')}}</th>\r\n      <th>{{translate(\'status\')}}</th>\r\n    </thead>\r\n    <tbody>\r\n      <tr ng-repeat="solution in solutions" ui-sref="^.solution({id: solution.solutionId})" ng-class="{\'green\': solution.status==\'ok\', \'yellow\': solution.status==\'waiting\', \'red\': (solution.status!=\'ok\'&&solution.status!=\'waiting\')}">\r\n        <td>{{solution.solutionId}}</td>\r\n        <td ng-click="prevent($event);" ui-sref="cabinet.problem({id: solution.problemId})">{{solution.problemId}}</td>\r\n        <td ng-click="prevent($event);" ui-sref="cabinet.problem({id: solution.problemId})">{{solution.problemName}}</td>\r\n        <td>{{dateFormat(solution.created)}}</td>\r\n        <td>{{translate(solution.lang)}}</td>\r\n        <td>\r\n          <span ng-if="solution.status!=\'waiting\'">{{solution.status}}</span>\r\n          <span ng-if="solution.status==\'waiting\'">\r\n            <span ng-if="+solution.testPassed">{{translate(\'proceedOnTest\') + " " + solution.testPassed+"/"+solution.testCount}}</span>\r\n            <span ng-if="!+solution.testPassed">{{solution.status}}</span>\r\n          </span>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n\r\n  <p ng-if="!solutions.length && !$root.preloader">{{translate(\'noSolutions\')}} <a ui-sref="^.problems" class="blue">\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0437\u0430\u0434\u0430\u0447</a></p>\r\n</div>\r\n');
$templateCache.put('/html/solutions_queue.html','<div class="solutions" ng-show="!$root.preloader || true">\r\n  <table ng-if="solutions.length" class="default">\r\n    <thead>\r\n      <th>{{translate(\'solutionId\')}}</th>\r\n      <th>{{translate(\'user\')}}</th>\r\n      <th>{{translate(\'problemName\')}}</th>\r\n      <th>{{translate(\'created\')}}</th>\r\n      <th>{{translate(\'lang\')}}</th>\r\n      <th>{{translate(\'status\')}}</th>\r\n    </thead>\r\n    <tbody>\r\n      <tr ng-repeat="solution in solutions" ui-sref="^.solution({id: solution.solutionId})" ng-class="{\'green\': solution.status==\'ok\', \'yellow\': solution.status==\'waiting\', \'red\': (solution.status!=\'ok\'&&solution.status!=\'waiting\')}">\r\n        <td>{{solution.solutionId}}</td>\r\n        <td ng-click="prevent($event);">{{solution.userName}}</td>\r\n        <td ng-click="prevent($event);" ui-sref="cabinet.problem({id: solution.problemId})">{{solution.problemName}}</td>\r\n        <td>{{dateFormat(solution.created)}}</td>\r\n        <td>{{translate(solution.lang)}}</td>\r\n        <td>\r\n          <span ng-if="solution.status!=\'waiting\'">{{solution.status}}</span>\r\n          <span ng-if="solution.status==\'waiting\'">\r\n            <span ng-if="+solution.testPassed">{{translate(\'proceedOnTest\') + " " + solution.testPassed+"/"+solution.testCount}}</span>\r\n            <span ng-if="!+solution.testPassed">{{solution.status}}</span>\r\n          </span>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n  </table>\r\n\r\n  <p ng-if="!solutions.length && !$root.preloader">{{translate(\'noSolutions\')}} <a ui-sref="^.problems" class="blue">\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0437\u0430\u0434\u0430\u0447</a></p>\r\n</div>\r\n');}]);
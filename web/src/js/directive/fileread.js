angular.module("notifyapp")
    .directive('ngFileModel', ['$parse','$http', '$window', function ($parse, $http, $window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.ngFileModel);
                var isMultiple = attrs.multiple;
                var modelSetter = model.assign;
                element.bind('change', function () {
                    var values = [];
                    angular.forEach(element[0].files, function (item) {
                        var value = {
                            url: URL.createObjectURL(item),
                        };
                        $http({
                            method: 'GET',
                            url: value.url
                        })
                        .then(function successCallback(response) {
                            value.base64 = $window.btoa(response.data)
                        }, function errorCallback(response) {

                        });
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
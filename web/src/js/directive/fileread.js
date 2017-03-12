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
                        if(attrs.isPhoto!==undefined) {

                            var reader = new FileReader()
                            reader.onload = (event)=>{

                                values.push(event.target.result)
                                scope.$apply(function () {
                                    if (isMultiple) {
                                        modelSetter(scope, values);
                                    } else {
                                        modelSetter(scope, values[0]);
                                    }
                                });
                            }
                            reader.readAsDataURL(item)
                        } else {
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
                        }
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
    }])
    .directive('triggerClick', ($parse, $http, $window, $timeout)=>{
        return (scope, element, attrs)=>{
            element.on('click', ()=>{
                $("#"+attrs.triggerClick).click()
            })
            
        }
    })
    .directive('dragndropPhoto', ($parse, $http, $window, $timeout)=>{
        return {
            restrict: 'A',
            link: (scope, element, attrs)=>{
                $("html").on("dragover", function(event) {
                    event.preventDefault();  
                    event.stopPropagation();
                    $(this).addClass('dragging');
                });

                $("html").on("dragleave", function(event) {
                    event.preventDefault();  
                    event.stopPropagation();
                    $(this).removeClass('dragging');
                });
                var model = $parse(attrs.dragndropPhoto);
                var isMultiple = attrs.multiple;
                var modelSetter = model.assign;
                $(element).on("drop", function(event) {
                    event.preventDefault()
                    event.stopPropagation()
                    var reader = new FileReader()
                    reader.onload = (event)=>{
                        scope.$apply(()=>{
                            modelSetter(scope, event.target.result)
                        })
                    }
                    reader.readAsDataURL(event.originalEvent.dataTransfer.files[0])
                    
                    
                });
            }
        }
    });
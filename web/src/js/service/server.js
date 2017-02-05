angular.module("notifyapp")
  .factory('$server', ($state)=>{
    var api = {}
    var methods = [
      'register',
      'login',
      'checkSession',
      'editProfile',
      'getProfile'
    ]
    var addMethod = (methodName)=>{
      api[methodName] = (data, callback)=>{
        var domain = "localhost"
        if(localStorage.token){
          data.cookies = {
            sessionId: localStorage.token
          }
        }
        var request = $.ajax({
          url: 'https://'+domain+'/call/client/'+methodName,
          method: 'POST',
          contentType: "application/json;charset=utf-8",
          headers: {
            'sessionidcors': localStorage.token
          },
          data: JSON.stringify(data),
          dataType: 'json'
        })
        request.done((data)=>{
          if(data.err && data.err.message == "Invalid session"){
            delete localStorage.token
            $state.go('main')
          };
          callback(data.err, data.data)
        })

        request.fail((xhr)=>{
          callback(xhr.responseJSON)
        })
      }
    }

    for(var method in methods) {
      addMethod(methods[method])
    }
    return api;
  })
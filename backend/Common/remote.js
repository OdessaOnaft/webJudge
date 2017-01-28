module.exports = function(_, request){
    return function(baseUrl, secret){
        return function(method){
            return function(data, callback){
                var req = {
                    uri : baseUrl + method,
                    method : 'post',
                    json: data,
                    headers: {
                        Authorization: secret
                    }
                };
                var callbackCalled = false;
                request(req, function(err, data, body){
                    if(callbackCalled) return;
                    callbackCalled = true;
                    if(err) {
                        if(_.isFunction(callback)) callback(err);
                        return
                    }
                    data = body;
                    if(_.isFunction(callback)) callback(data.err, data.data);
                });
            };
        };
    };
};
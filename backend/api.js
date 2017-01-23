module.exports = function(_, restoreSession, apiConfig, validatorsConfig){
    return {
        guestMethods: new Set(Object.keys(apiConfig.guest)),
        call: function(sessionId, method, data, callback){
            var startTime = _.now();
            restoreSession(sessionId, function(err, session){
                if(err || !_.isObject(session)){
                    callback({
                        message: 'Invalid session',
                        error_from_database: err,
                        code: 22
                    });
                    return;
                }
                if(_.isObject(apiConfig[session.userPriviledge]) && _.isFunction(apiConfig[session.userPriviledge][method])){
                    var validCbCalled = false;
                    var validCb = function(err){
                        if(validCbCalled){
                            console.log({
                                err: {
                                    message: 'Validator callback was already called'
                                },
                                stack: (new Error()).stack
                            })
                        }
                        validCbCalled = true;
                        if(err){
                            if(_.isUndefined(err.code)){
                                err.code = 21;
                            }
                            callback(err);
                        } else {
                            apiConfig[session.userPriviledge][method](session, data, function(err, result, newAuthData, warning){
                                callback(err, result, newAuthData, warning);
                                console.log(session.userPriviledge, method, (_.now() - startTime), 'ms');
                            });
                        }
                    };
                    if(_.isObject(validatorsConfig[session.userPriviledge]) && _.isFunction(validatorsConfig[session.userPriviledge][method])){
                        validatorsConfig[session.userPriviledge][method](session, data, validCb);
                    } else {
                        validCb(null);
                    }
                } else {
                    callback({
                        message: 'Access denied'
                    });
                }
            });
        }
    }
};
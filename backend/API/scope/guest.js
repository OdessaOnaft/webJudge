module.exports = function(_, conf, Database){
    function ok(callback){
        return function(err, data){
            if(err){
                callback(err);
            } else {
                callback(null);
            }
        }
    }

    return {
        register: function(session, data, callback){
            Database.register(data, ok(callback));
        },
        login: function(session, data, callback){
            Database.login(data, ok(callback));
        },
        checkSession: function(session, data, callback){
            Database.restoreSession(data, ok(callback));
        }
    }
};
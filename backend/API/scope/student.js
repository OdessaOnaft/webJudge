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
        getProfile: function(session, data, callback){
            Database.getProfile({
                userId: session.userId
            }, ok(callback));
        },
        submitProfile: function(session, data, callback){
            data.userId = session.userId;
            Database.submitProfile(data, ok(callback));
        },
        logout: function(session, data, callback){
            Database.logout(_.pick(session, ['userId']), ok(callback));
        }
    }
};
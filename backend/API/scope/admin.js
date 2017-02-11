module.exports = function(_, conf, Database){
    function ok(callback){
        return function(err, data){
            if(err){
                callback(err, null);
            } else {
                callback(null, data);
            }
        }
    }

    return {
        acceptUserScope: (session, data, callback)=>{
            Database.acceptUserScope(data, ok(callback));
        },
        rejectUserScope: (session, data, callback)=>{
            Database.rejectUserScope(data, ok(callback));
        },
        addNews: (session, data, callback)=>{
            data.userId = session.userId;
            Database.addNews(data, ok(callback));
        },
        editNews: (session, data, callback)=>{
            data.userId = session.userId;
            Database.editNews(data, ok(callback));
        },
        getUsers: (session, data, callback)=>{
            Database.getUsers(data, ok(callback));
        }
    }
};
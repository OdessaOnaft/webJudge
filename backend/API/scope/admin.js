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
        }
    }
};
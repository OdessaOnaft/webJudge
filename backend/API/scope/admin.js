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
        getNews: (session, data, callback)=>{
            Database.getNews(data, ok(callback));
        },
        getNewsById: (session, data, callback)=>{
            Database.getNewsById(data, ok(callback));
        }
    }
};
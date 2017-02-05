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
        addProblem: (session, data, callback)=>{
            data.userId = session.userId;
            Database.addProblem(data, ok(callback));
        },
        editProblem: (session, data, callback)=>{
            data.userId = session.userId;
            Database.editProblem(data, ok(callback));
        }
    }
};
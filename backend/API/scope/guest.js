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
        register: (session, data, callback)=>{
            Database.register(data, ok(callback));
        },
        login: (session, data, callback)=>{
            Database.login(data, ok(callback));
        },
        checkSession: (session, data, callback)=>{
            console.log(data.cookies.sessionId);
            Database.restoreSession(data.cookies.sessionId, ok(callback));
        },
        getProblem: (session, data, callback)=>{
            data.scope = session.userPriviledge;
            data.userId = session.userId;
            Database.getProblem(data, ok(callback));
        },
        getProblems: (session, data, callback)=>{
            Database.getProblems(data, ok(callback));
        },
        getSolution: (session, data, callback)=>{
            data.scope = session.userPriviledge;
            data.userId = session.userId;
            Database.getSolution(data, ok(callback));
        },
        getSolutionsQueue: (session, data, callback)=>{
            Database.getSolutionsQueue(data, ok(callback));
        }
    }
};
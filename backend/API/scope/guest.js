module.exports = function(_, conf, Database, fs){
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
            data.userId = session.userId;
            Database.getProblems(data, ok(callback));
        },
        getSolution: (session, data, callback)=>{
            data.scope = session.userPriviledge;
            data.userId = session.userId;
            Database.getSolution(data, ok(callback));
        },
        getSolutionsQueue: (session, data, callback)=>{
            Database.getSolutionsQueue(data, ok(callback));
        },
        getNews: (session, data, callback)=>{
            Database.getNews(data, ok(callback));
        },
        getNewsById: (session, data, callback)=>{
            Database.getNewsById(data, ok(callback));
        },
        getGroups: (session, data, callback)=>{
            data.userId = session.userId;
            Database.getGroups(data, ok(callback));
        },
        getGroupById: (session, data, callback)=>{
            data.userId = session.userId;
            Database.getGroupById(data, ok(callback));
        },
        getUserById: (session, data, callback)=>{
            Database.getUserById(data, (err, resData)=>{
                if (err){
                    callback(err, null);
                } else {
                    var dir = `Storage/`;
                    var start = `user${data.userId}.`;
                    var files = fs.readdirSync(dir);
                    _.each(files, (f)=>{
                        if (f.startsWith(start)){
                            resData.photo = f;
                        }
                    });
                    callback(null, resData);
                }
            });
        }
    }
};
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
        getProfile: (session, data, callback)=>{
            Database.getProfile(_.pick(session, ['userId']), (err, data)=>{
                if (err){
                    callback(err, null);
                } else {
                    var dir = `Storage/`;
                    var start = `user${session.userId}.`;
                    var files = fs.readdirSync(dir);
                    _.each(files, (f)=>{
                        if (f.startsWith(start)){
                            data.photo = f;
                        }
                    });
                    callback(null, data);
                }
            });
        },
        submitProfile: (session, data, callback)=>{
            data.userId = session.userId;
            Database.submitProfile(data, (err, resData)=>{
                if (err){
                    callback(err, null);
                } else {
                    if (data.base64){
                        var ext = data.base64.substring(data.base64.indexOf('/')+1, data.base64.indexOf(';'));
                        var file = data.base64.split(';base64,')[1];
                        file = new Buffer(file, 'base64');
                        fs.writeFileSync(`Storage/user${session.userId}.${ext}`, file);
                        resData.base64 = data.base64;
                    }
                    callback(null, resData);
                }
            });
        },
        logout: (session, data, callback)=>{
            Database.logout(_.pick(session, ['userId']), ok(callback));
        },
        submitSolution: (session, data, callback)=>{
            data.userId = session.userId;
            Database.submitSolution(data, ok(callback));
        },
        getMySolutions: (session, data, callback)=>{
            data.userId = session.userId;
            Database.getMySolutions(data, ok(callback));
        },
        getSolutionsByProblemId: (session, data, callback)=>{
            data.userId = session.userId;
            Database.getSolutionsByProblemId(data, ok(callback));
        },
        addProblemComment: (session, data, callback)=>{
            data.userId = session.userId;
            Database.addProblemComment(data, ok(callback));
        },
        sendPrivateMessage: (session, data, callback)=>{
            data.myUserId = session.userId;
            Database.sendPrivateMessage(data, ok(callback));
        },
        getChatsList: (session, data, callback)=>{
            data.userId = session.userId;
            Database.getChatsList(data, ok(callback));
        },
        getChat: (session, data, callback)=>{
            data.myUserId = session.userId;
            Database.getChat(data, ok(callback));
        },
        seenChat: (session, data, callback)=>{
            data.myUserId = session.userId;
            Database.seenChat(data, ok(callback));
        }
    }
};
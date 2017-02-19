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
        getProfile: (session, data, callback)=>{
            Database.getProfile(_.pick(session, ['userId']), ok(callback));
        },
        submitProfile: (session, data, callback)=>{
            data.userId = session.userId;
            Database.submitProfile(data, ok(callback));
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
        }
    }
};
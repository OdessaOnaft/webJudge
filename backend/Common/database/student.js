module.exports = function(_, remote){
    var restoreSession = remote('restoreSession');
    var api = {
        restoreSession: function(sessionId, callback){
            if(_.isUndefined(sessionId) || _.isNull(sessionId)){
                callback(null, {
                    sessionId: sessionId,
                    adminId: null,
                    userPriviledge: 'guest'
                });
            } else {
                restoreSession({token: sessionId}, function(err, session){
                    if(err){
                        callback(err);
                    } else {
                        session.userPriviledge = session.scope;
                        callback(err, session);
                    }
                });
            }
        }
    };

    var remoteAPI = {};

    [
        'getProfile',
        'submitProfile',
        'logout',
        'submitSolution',
        'getMySolutions',
        'getSolutionsByProblemId',
        'addProblemComment',
        'sendPrivateMessage',
        'getChatsList',
        'getChat',
        'seenChat'
    ].forEach(function(name){
        remoteAPI[name] = remote(name);
    });

    api = _.extend(api, remoteAPI);

    return api;
};
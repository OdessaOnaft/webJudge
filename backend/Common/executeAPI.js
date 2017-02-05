module.exports = function(_, remote){
    var api = {};
    var remoteAPI = {};

    [
        'generateOutFilesForProblem'
    ].forEach(function(name){
        remoteAPI[name] = remote(name);
    });
    api = _.extend(api, remoteAPI);
    return api;
};
module.exports = function(_, remote){
    var api = {

    };

    var remoteAPI = {};

    [
        'getProblem',
        'getSolution',
        'getSolutionsQueue',
        'setSolutionTestResult',
        'setSolutionResult'
    ].forEach(function(name){
        remoteAPI[name] = remote(name);
    });

    api = _.extend(api, remoteAPI);

    return api;
};
module.exports = function(_){
    var student = {

    };

    var validators = {
        guest: {
            register: function(sessionId, data, callback){
                callback(null);
            },
            login: function(sessionId, data, callback){
                callback(null);
            }
        },
        student: student
    };
    return validators;
};
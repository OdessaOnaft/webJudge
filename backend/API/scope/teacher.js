module.exports = function(_, conf, Database){
    function ok(callback){
        return function(err, data){
            if(err){
                callback(err);
            } else {
                callback(null);
            }
        }
    }

    return {

    }
};
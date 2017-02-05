module.exports = function(_, mainPg){
    return {
        acceptUserScope: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId
                    ];
                    return mainPg('SELECT * FROM admin_accept_scope($1);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        rejectUserScope: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId
                    ];
                    return mainPg('SELECT * FROM admin_reject_scope($1);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        }
    }
};
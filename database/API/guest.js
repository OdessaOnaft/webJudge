module.exports = function(_, mainPg){
    return {
        restoreSession: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.token
                    ];
                    return mainPg('SELECT * FROM guest_restore_session($1);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    resultData.sessionId = data.token;
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        register: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.password,
                        inputData.email
                    ];
                    return mainPg('SELECT * FROM guest_register($1,$2);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        login: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.email,
                        inputData.password
                    ];
                    return mainPg('SELECT * FROM guest_login($1,$2);', args);
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
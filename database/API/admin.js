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
        },
        addNews: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId,
                        _.map(inputData.title,(v)=>JSON.stringify(v)),
                        _.map(inputData.body,(v)=>JSON.stringify(v))
                    ];
                    return mainPg('SELECT * FROM admin_add_news($1,$2,$3);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        editNews: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId,
                        inputData.newsId,
                        _.map(inputData.title,(v)=>JSON.stringify(v)),
                        _.map(inputData.body,(v)=>JSON.stringify(v))
                    ];
                    return mainPg('SELECT * FROM admin_edit_news($1,$2,$3,$4);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getNewsByIdFull: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.newsId
                    ];
                    return mainPg('SELECT * FROM admin_get_news_full($1);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    resultData.title = _.map(resultData.title, (v)=>JSON.stringify(v));
                    resultData.body = _.map(resultData.body, (v)=>JSON.stringify(v));
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getUsers: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.skip || 0,
                        inputData.limit || 100000
                    ];
                    return mainPg('SELECT * FROM admin_get_users($1,$2);', args);
                })
                .then(resultData=>{
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        }
    }
};
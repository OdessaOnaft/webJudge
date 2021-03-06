module.exports = function(_, mainPg, fs){
    return {
        logout: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId
                    ];
                    return mainPg('SELECT * FROM student_logout($1);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getProfile: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId
                    ];
                    return mainPg('SELECT * FROM student_get_profile($1);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        submitProfile: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId,
                        inputData.name,
                        inputData.birthday,
                        inputData.phone,
                        inputData.note,
                        inputData.modifiedScope
                    ];
                    return mainPg('SELECT * FROM student_submit_profile($1,$2,$3,$4,$5,$6);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        submitSolution: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId,
                        inputData.problemId,
                        inputData.lang || 'cpp'
                    ];
                    return mainPg('SELECT * FROM student_submit_solution($1,$2,$3);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    fs.writeFileSync(`./solutions/${resultData.solutionId}.sol`, data.source);
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });

        },
        getMySolutions: function (data, callback) {
            var result = {
                result: [],
                count: 0
            }
            var args = [
                data.userId,
                data.skip || 0,
                data.limit || 100000,
                data.lang
            ];
            Promise.resolve(data)
                .then(inputData=>{
                    return mainPg('SELECT * FROM student_get_my_solutions($1,$2,$3,$4);', args);
                })
                .then(resultData=>{
                    result.result = resultData;
                    return mainPg('SELECT * FROM student_count_my_solutions($1,$2,$3,$4);', args);
                })
                .then(resultData=>{
                    result.count = resultData[0].count;
                    callback(null, result);
                })
                .catch(err=>{
                    callback(err, null);
                });

        },
        getSolutionsByProblemId: function (data, callback) {
            var result = {
                result: [],
                count: 0
            }
            var args = [
                data.userId,
                data.problemId,
                data.skip || 0,
                data.limit || 100000,
                data.lang
            ];
            Promise.resolve(data)
                .then(inputData=>{
                    return mainPg('SELECT * FROM student_get_solutions_by_problem_id($1,$2,$3,$4,$5);', args);
                })
                .then(resultData=>{
                    result.result = resultData;
                    return mainPg('SELECT * FROM student_count_solutions_by_problem_id($1,$2,$3,$4,$5);', args);
                })
                .then(resultData=>{
                    result.count = resultData[0].count;
                    callback(null, result);
                })
                .catch(err=>{
                    callback(err, null);
                });

        },
        addProblemComment: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.problemId,
                        inputData.userId,
                        inputData.message
                    ];
                    return mainPg('SELECT * FROM student_add_problem_comment($1,$2,$3);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });

        },
        sendPrivateMessage: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.myUserId,
                        inputData.userId,
                        inputData.message
                    ];
                    return mainPg('SELECT * FROM student_send_private_message($1,$2,$3);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });

        },
        getChatsList: function (data, callback) {
            var result = {
                result: [],
                count: 0
            };
            var args = [
                data.userId,
                data.skip || 0,
                data.limit || 100000
            ];
            Promise.resolve(data)
                .then(inputData=>{
                    return mainPg('SELECT * FROM student_get_chats($1,$2,$3);', args);
                })
                .then(resultData=>{
                    result.result = resultData;
                    return mainPg('SELECT * FROM student_count_chats($1,$2,$3);', args);
                })
                .then(resultData=>{
                    result.count = resultData[0].count;
                    callback(null, result);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getChat: function (data, callback) {
            var result = {
                result: [],
                count: 0
            };
            var args = [
                data.myUserId,
                data.userId,
                data.skip || 0,
                data.limit || 100000
            ];
            Promise.resolve(data)
                .then(inputData=>{
                    return mainPg('SELECT * FROM student_get_chat($1,$2,$3,$4);', args);
                })
                .then(resultData=>{
                    result.result = _.map(resultData, (v)=>{
                        v.lastMessage = JSON.parse(v.lastMessage);
                        return v;
                    });
                    return mainPg('SELECT * FROM student_count_chat($1,$2,$3,$4);', args);
                })
                .then(resultData=>{
                    result.count = resultData[0].count;
                    callback(null, result);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        seenChat: function (data, callback) {
            var args = [
                data.myUserId,
                data.userId
            ];
            Promise.resolve(data)
                .then(inputData=>{
                    return mainPg('SELECT * FROM student_seen_chat($1,$2);', args);
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
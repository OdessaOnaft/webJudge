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
                        inputData.lang
                    ];
                    return mainPg('SELECT * FROM student_submit_solution($1,$2,$3);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    fs.writeFileSync(`./solutions/${resultData.solutionId}.sol`, data.solution);
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });

        },
        getMySolutions: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId,
                        inputData.skip || 0,
                        inputData.limit || 100000
                    ];
                    return mainPg('SELECT * FROM student_get_my_solutions($1,$2,$3);', args);
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
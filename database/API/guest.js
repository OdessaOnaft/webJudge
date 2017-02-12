module.exports = function(_, mainPg, fs){
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
        },
        getProblem: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.problemId,
                        inputData.lang || 'en'
                    ];
                    return mainPg('SELECT * FROM guest_get_problem($1, $2);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    resultData.samples = JSON.parse(resultData.samples);
                    if (data.scope != 'student' && data.scope != 'guest'){
                        if (data.scope != 'teacher' || resultData.userId == data.userId) {
                            var tasks = fs.readFileSync(`./problems/${resultData.problemId}.prb`);
                            resultData.samples = JSON.parse(tasks);
                            resultData.samples = _.map(resultData.samples, (v)=>{
                                v = {
                                    input: new Buffer(v.input, 'base64').toString(),
                                    output: new Buffer(v.output, 'base64').toString()
                                };
                                if (v.input.length > 256)
                                    v.input = v.input.substr(0, 253) + '...';
                                if (v.output.length > 256)
                                    v.output = v.output.substr(0, 253) + '...';
                                return {
                                    input: new Buffer(v.input).toString('base64'),
                                    output: new Buffer(v.output).toString('base64')
                                };
                            });
                            resultData.outputSource = fs.readFileSync(`./problems_prog/${data.problemId}.dat`).toString();
                        }
                    }
                    delete resultData.userId;
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getProblems: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.skip || 0,
                        inputData.limit || 100000,
                        inputData.lang || 'en'
                    ];
                    return mainPg('SELECT * FROM guest_get_problems($1, $2, $3);', args);
                })
                .then(resultData=>{
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getSolution: function (data, callback) {
            var result = null;
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.solutionId
                    ];
                    return mainPg('SELECT * FROM guest_get_solution($1);', args);
                })
                .then(inputData=>{
                    result = inputData[0];
                    var args = [
                        data.solutionId
                    ];
                    return mainPg('SELECT * FROM guest_get_solution_tests($1);', args);
                })
                .then(resultData=>{
                    result.tests = resultData;
                    if (data.scope != 'guest' && data.userId == result.userId){
                        result.solution = fs.readFileSync(`./solutions/${result.solutionId}.sol`).toString();
                    }
                    callback(null, result);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getSolutionsQueue: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.skip || 0,
                        inputData.limit || 100000,
                        inputData.lang
                    ];
                    return mainPg('SELECT * FROM guest_get_solutions_queue($1,$2,$3);', args);
                })
                .then(resultData=>{
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getNews: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.skip || 0,
                        inputData.limit || 100000,
                        inputData.lang
                    ];
                    return mainPg('SELECT * FROM guest_get_news_list($1,$2,$3);', args);
                })
                .then(resultData=>{
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getNewsById: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.newsId,
                        inputData.lang
                    ];
                    return mainPg('SELECT * FROM guest_get_news($1,$2);', args);
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
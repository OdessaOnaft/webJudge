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
            var result;
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.problemId,
                        inputData.lang || 'en'
                    ];
                    return mainPg('SELECT * FROM guest_get_problem($1, $2);', args);
                })
                .then(resultData=>{
                    result = resultData[0];
                    var args = [
                        data.problemId
                    ];
                    return mainPg('SELECT * FROM guest_get_problem_comments($1);', args);
                })
                .then(resultData=>{
                    result.comments = resultData;
                    result.samples = JSON.parse(result.samples);
                    if (data.scope != 'student' && data.scope != 'guest'){
                        if (data.scope != 'teacher' || resultData.userId == data.userId) {
                            var tasks = fs.readFileSync(`./problems/${result.problemId}.prb`);
                            result.samples = JSON.parse(tasks);
                            result.samples = _.map(result.samples, (v)=>{
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
                            result.outputSource = fs.readFileSync(`./problems_prog/${data.problemId}.dat`).toString();
                        }
                    }
                    delete result.userId;
                    callback(null, result);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getProblems: function (data, callback) {
            var result = {
                result: [],
                count: 0
            }
            var args = [
                data.skip || 0,
                data.limit || 100000,
                data.lang || 'en',
                data.userId || null
            ];
            Promise.resolve(data)
                .then(inputData=>{
                    return mainPg('SELECT * FROM guest_get_problems($1, $2, $3, $4);', args);
                })
                .then(resultData=>{
                    result.result = resultData;
                    return mainPg('SELECT * FROM guest_count_problems($1, $2, $3, $4);', args);
                })
                .then(resultData=>{
                    result.count = resultData[0].count;
                    callback(null, result);
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
            var result = {
                result: [],
                count: 0
            }
            var args = [
                data.skip || 0,
                data.limit || 100000,
                data.lang
            ];
            Promise.resolve(data)
                .then(inputData=>{
                    return mainPg('SELECT * FROM guest_get_solutions_queue($1,$2,$3);', args);
                })
                .then(resultData=>{
                    result.result = resultData;
                    return mainPg('SELECT * FROM guest_count_solutions_queue($1,$2,$3);', args);
                })
                .then(resultData=>{
                    result.count = resultData[0].count;
                    callback(null, result);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getNews: function (data, callback) {
            var result = {
                result: [],
                count: 0
            }
            var args = [
                data.skip || 0,
                data.limit || 100000,
                data.lang
            ];
            Promise.resolve(data)
                .then(inputData=>{
                    return mainPg('SELECT * FROM guest_get_news_list($1,$2,$3);', args);
                })
                .then(resultData=>{
                    result.result = resultData;
                    return mainPg('SELECT * FROM guest_count_news_list($1,$2,$3);', args);
                })
                .then(resultData=>{
                    result.count = resultData[0].count;
                    callback(null, result);
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
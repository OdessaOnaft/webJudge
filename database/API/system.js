module.exports = function(_, mainPg, fs){
    return {
        getProblem: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.problemId
                    ];
                    return mainPg('SELECT * FROM system_get_problem($1);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    var tasks = fs.readFileSync(`./problems/${resultData.problemId}.prb`);
                    resultData.tasks = JSON.parse(tasks);
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
                    return mainPg('SELECT * FROM system_get_solution($1);', args);
                })
                .then(resultData=>{
                    result = resultData[0];
                    result.solution = fs.readFileSync(`./solutions/${result.solutionId}.sol`).toString();
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
                        inputData.skip || 0
                    ];
                    return mainPg('SELECT * FROM system_get_solutions_for_queue($1);', args);
                })
                .then(resultData=>{
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        setSolutionTestResult: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.solutionId,
                        inputData.testNumber,
                        inputData.status,
                        inputData.execTime,
                        inputData.execMemory,
                        inputData.message
                    ];
                    return mainPg('SELECT * FROM system_set_solution_test_result($1,$2,$3,$4,$5,$6);', args);
                })
                .then(resultData=>{
                    callback(null, resultData[0]);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        setSolutionResult: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.solutionId,
                        inputData.status,
                        inputData.message
                    ];
                    return mainPg('SELECT * FROM system_set_solution_result($1,$2,$3);', args);
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
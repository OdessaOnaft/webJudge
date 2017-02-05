module.exports = function(_, mainPg, fs){
    return {
        addProblem: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId,
                        _.map(inputData.name,(v)=>JSON.stringify(v)),
                        inputData.timeLimit || 1000,
                        inputData.memoryLimit || 67108864,
                        _.map(inputData.description,(v)=>JSON.stringify(v)),
                        inputData.tests,
                        inputData.outputType || 'file',
                        inputData.tasks.length
                    ];
                    return mainPg('SELECT * FROM teacher_add_problem($1, $2, $3, $4, $5, $6, $7, $8);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    data.tasks = _.map(data.tasks, (v, k)=>{
                        v.num = +k+1;
                        return v;
                    });
                    var writeProblem = JSON.stringify(data.tasks);
                    fs.writeFileSync(`./problems/${resultData.problemId}.prb`, writeProblem);
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        editProblem: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId,
                        inputData.problemId,
                        _.map(inputData.name,(v)=>JSON.stringify(v)),
                        inputData.timeLimit || 1000,
                        inputData.memoryLimit || 67108864,
                        _.map(inputData.description,(v)=>JSON.stringify(v)),
                        inputData.tests,
                        inputData.outputType || 'file',
                        inputData.tasks.length
                    ];
                    return mainPg('SELECT * FROM teacher_edit_problem($1, $2, $3, $4, $5, $6, $7, $8, $9);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    data.tasks = _.map(data.tasks, (v, k)=>{
                        v.num = +k+1;
                        return v;
                    });
                    var writeProblem = JSON.stringify(data.tasks);
                    fs.writeFileSync(`./problems/${data.problemId}.prb`, writeProblem);
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        }
    }
};
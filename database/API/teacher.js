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
                        JSON.stringify(inputData.samples.slice(0, inputData.publicCount)),
                        inputData.outputType || 'file',
                        inputData.samples.length,
                        inputData.input || '',
                        inputData.output || ''
                    ];
                    return mainPg('SELECT * FROM teacher_add_problem($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    data.samples = _.map(data.samples, (v, k)=>{
                        v.num = +k+1;
                        return v;
                    });
                    var writeProblem = JSON.stringify(data.samples);
                    fs.writeFileSync(`./problems/${resultData.problemId}.prb`, writeProblem);
                    fs.writeFileSync(`./problems_prog/${resultData.problemId}.dat`, data.outputSource);
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
                        JSON.stringify(inputData.samples.slice(0, inputData.publicCount)),
                        inputData.outputType || 'program',
                        inputData.samples.length,
                        inputData.input || '',
                        inputData.output || ''
                    ];
                    return mainPg('SELECT * FROM teacher_edit_problem($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    data.samples = _.map(data.samples, (v, k)=>{
                        v.num = +k+1;
                        return v;
                    });
                    var writeProblem = JSON.stringify(data.samples);
                    fs.writeFileSync(`./problems/${data.problemId}.prb`, writeProblem);
                    fs.writeFileSync(`./problems_prog/${data.problemId}.dat`, data.outputSource);
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        getProblemFull: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.problemId,
                        inputData.userId
                    ];
                    return mainPg('SELECT * FROM teacher_get_problem_full($1, $2);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    resultData.name = _.map(resultData.name, (v)=>JSON.parse(v.split('\n').join('\\n')));
                    resultData.description = _.map(resultData.description, (v)=>JSON.parse(v.split('\n').join('\\n')));
                    resultData.samples = JSON.parse(resultData.samples);
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
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        makeGroup: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.userId,
                        inputData.name,
                        inputData.description
                    ];
                    return mainPg('SELECT * FROM teacher_make_group($1, $2, $3);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        editGroup: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.groupId,
                        inputData.userId,
                        inputData.name,
                        inputData.description
                    ];
                    return mainPg('SELECT * FROM teacher_edit_group($1, $2, $3, $4);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        addGroupUser: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.myUserId,
                        inputData.groupId,
                        inputData.userEmail
                    ];
                    return mainPg('SELECT * FROM teacher_add_group_user($1, $2, $3);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        },
        removeGroupUser: function (data, callback) {
            Promise.resolve(data)
                .then(inputData=>{
                    var args = [
                        inputData.myUserId,
                        inputData.groupId,
                        inputData.userId
                    ];
                    return mainPg('SELECT * FROM teacher_remove_group_user($1, $2, $3);', args);
                })
                .then(resultData=>{
                    resultData = resultData[0];
                    callback(null, resultData);
                })
                .catch(err=>{
                    callback(err, null);
                });
        }
    }
};
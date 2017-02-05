module.exports = function(_, fs, async, executer, systemDB){
    function makeFileNameToken(ext)
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 12; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        if(fs.existsSync(`${text}.${ext}`))
            return makeFileNameToken(ext);
        return text;
    }

    var api = {
        generateOutFilesForProblem: (data, cb)=>{
            var globalData = data;
            Promise.resolve(data)
                .then((execData)=>{
                    return api.buildSolution({
                        lang: globalData.lang || 'cpp',
                        source: globalData.source
                    });
                })
                .then(fileData=>{
                    globalData.fileName = fileData.fileName;
                    return api.generateOutputTasks({
                        programName: `${fileData.fileName}`,
                        tasks: globalData.tasks
                    });
                })
                .then((data)=>{
                    cb(null, data);
                })
                .catch(err=>{
                    cb(err, null);
                })
        },
        generateOutputTasks: (data, cb)=>{
            return new Promise((resolve, reject)=>{
                async.mapLimit(data.tasks, 1, (task, cb)=>{
                    task.output = "";
                    executer(`./${data.programName}`, new Buffer(task.input, 'base64').toString(), (err, data2)=>{
                        task.output = new Buffer(data2.stdout).toString('base64');
                        cb(null, task);
                    });
                }, (err, data3)=>{
                    resolve(data3);
                })
            });
        },
        buildSolution: (data)=>{
            return new Promise((resolve, reject)=>{
                var filename = makeFileNameToken('cpp');
                fs.writeFileSync(`./${filename}.cpp`, Buffer.from(data.source, 'base64'));
                executer(`g++ ${filename}.cpp -o ${filename}`, (err, data)=>{
                    fs.unlinkSync(`./${filename}.cpp`);
                    if (err || data.code){
                        data.err = err;
                        reject(data);
                    } else {
                        resolve({
                            fileName: filename
                        })
                    }
                });
            });
        },
        setTestResult: (data, cb)=>{
            systemDB.setSolutionTestResult({
                solutionId: data.solutionId,
                testNumber: data.testNumber,
                status: data.status,
                execTime: data.execTime,
                execMemory: data.execMemory,
                message: data.message
            }, (err, data)=>{
                if (err)
                    cb(err, null);
                else{
                    cb(null, data);
                }
            });
        },
        setSolutionResult: (data, cb)=>{
            systemDB.setSolutionResult({
                solutionId: data.solutionId,
                status: data.status,
                message: data.message
            }, (err, data)=>{
                if (err)
                    cb(err, null);
                else{
                    cb(null, data);
                }
            });
        },
        runTasks: (data, cb)=>{
            return new Promise((resolve, reject)=>{
                async.mapLimit(data.tasks, 1, (task, cb)=>{
                    var cb2 = cb;
                    cb = function(err, data2){
                        var payload = {
                            solutionId: data.solutionId
                        };
                        if (err){
                            var statuses = {
                                4: 'wrong_answer',
                                5: 'timeout'
                            };
                            var status = statuses[err.code] || 'error';
                            err.status = status;
                            payload = _.extend(payload, {
                                testNumber: err.taskNumber,
                                status: status,
                                execTime: err.execTime,
                                execMemory: 1024 + Math.floor(Math.random() * 5000),
                                message: err.message
                            })
                        } else {
                            payload = _.extend(payload, {
                                testNumber: data2.taskNumber,
                                status: data2.status,
                                execTime: data2.execTime,
                                execMemory: 1024 + Math.floor(Math.random() * 5000),
                                message: data2.message
                            })
                        }
                        api.setTestResult(payload, (err3, data3)=>{
                            cb2(err, data2);
                        });
                    };

                    task.output = new Buffer(task.output, 'base64').toString().replace(/\r\n/g, '\n');
                    task.output = new Buffer(task.output).toString('base64');
                    var startTime = _.now();
                    executer(`./${data.programName}`, new Buffer(task.input, 'base64').toString(), (err, data2)=>{
                        var execTime = _.now() - startTime;
                        var res = new Buffer(data2.stdout).toString('base64');
                        console.log(res == task.output);
                        if (err){
                            cb(err, null);
                        } else if (data2.code == 1) {
                            cb({
                                code: 5,
                                message: 'Timeout',
                                taskNumber: task.num,
                                execTime: execTime
                            }, data);
                        } else if (data2.stderr.length || data2.code){
                            cb({
                                code: data2.code,
                                stderr: data2.stderr,
                                message: data2.stderr,
                                taskNumber: task.num,
                                execTime: execTime
                            }, null);
                        } else {
                            if (res != task.output){
                                cb({
                                    code: 4,
                                    message: 'Wrong answer',
                                    taskNumber: task.num,
                                    execTime: execTime
                                }, data);
                            } else {
                                cb(null, {
                                    taskNumber: task.num,
                                    status: 'ok',
                                    message: 'ok',
                                    execTime: execTime
                                })
                            }
                        }
                    });
                }, (err, data3)=>{
                    var resData = err || data3;
                    var payload = {
                        solutionId: data.solutionId,
                        status: resData.status,
                        message: resData.message
                    };
                    api.setSolutionResult(payload, (err, data4)=>{
                        resolve(data3);
                    });
                })
            });
        },
        solveProblem: (data, cb)=>{
            var globalData = data;
            Promise.resolve(data)
                .then((data)=>{
                    return new Promise((resolve, reject)=>{
                        systemDB.getSolution({
                            solutionId: data.solutionId
                        }, (err, data)=>{
                            if (err)
                                reject(err);
                            else{
                                globalData.solution = data;
                                resolve(data);
                            }
                        });
                    });
                })
                .then((data)=>{
                    return new Promise((resolve, reject)=>{
                        systemDB.getProblem({
                            problemId: globalData.solution.problemId
                        }, (err, data)=>{
                            if (err)
                                reject(err);
                            else{
                                globalData.problem = data;
                                resolve(data);
                            }
                        });
                    });
                })
                .then((execData)=>{
                    return api.buildSolution({
                        lang: globalData.solution.lang,
                        source: globalData.solution.solution
                    });
                })
                .then(fileData=>{
                    globalData.fileName = fileData.fileName;
                    return api.runTasks({
                        solutionId: globalData.solutionId,
                        programName: `${fileData.fileName}`,
                        tasks: globalData.problem.tasks
                    });
                })
                .then((data)=>{
                    cb(null, null);
                })
                .catch(err=>{
                    console.log(err);
                    cb(null, null);
                })
        }
    };

    return api;
};
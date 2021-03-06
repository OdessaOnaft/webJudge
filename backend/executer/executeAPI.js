module.exports = function(_, fs, async, executer, systemDB, spawn){
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
                fs.writeFileSync(`./${filename}.cpp`, Buffer.from(data.source, 'base64').toString());
                executer(`g++ ${filename}.cpp -o ${filename}`, (err, data)=>{
                    fs.unlinkSync(`./${filename}.cpp`);
                    if (err || data.code){
                        data.err = err;
                        if (err)
                            data.err = err;
                        if (data.code)
                            data.err = data.stderr;
                        reject({
                            status: 'build error',
                            message: data.stderr
                        });
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
                console.log(err, data);
                if (err)
                    cb(err, null);
                else{
                    cb(null, data);
                }
            });
        },
        runTasks: (data)=>{
            var startData = data;
            return new Promise((resolve, reject)=>{
                var tasksCount = data.tasks.length;
                var currentTask = 1;
                data.tasks = _.map(data.tasks, (v)=>{
                    v.output = new Buffer(v.output, 'base64').toString().replace(/\r\n/g, '\n');
                    v.output = new Buffer(v.output).toString('base64');
                    return v;
                });
                var callbackIsAlreadyCalled = false;
                var child = spawn('./executer.exe');
                child.stdout.on('data', (data) => {
                    currentTask++;
                    var testResult = data.toString().split(' ');
                    var testNumber = +testResult[0];
                    var execTime = +testResult[1];
                    var totalMem = +testResult[2];
                    var status = testResult[3];
                    var message = new Buffer(testResult[4], 'base64').toString();
                    var payload = {
                        solutionId: startData.solutionId,
                        testNumber: testNumber,
                        status: status,
                        message: message,
                        execTime: execTime,
                        execMemory: totalMem
                    };
                    api.setTestResult(payload, (err3, data3)=>{});
                    if (payload.status != 'ok'){
                        api.setSolutionResult(payload, (err, data4)=>{
                            if (!callbackIsAlreadyCalled) {
                                callbackIsAlreadyCalled = true;
                                resolve(startData);
                            }
                        });
                        return;
                    }
                    if (currentTask == tasksCount){
                        api.setSolutionResult(payload, (err, data4)=>{
                            if (!callbackIsAlreadyCalled) {
                                callbackIsAlreadyCalled = true;
                                resolve(startData);
                            }
                        });
                    }
                });
                child.on('close', (code, signal) => {
                    if (!callbackIsAlreadyCalled) {
                        callbackIsAlreadyCalled = true;
                        resolve(startData);
                    }
                });
                child.stdin.write(startData.programName + "\n");
                child.stdin.write(startData.timeLimit + "\n");
                child.stdin.write(startData.memoryLimit + "\n");
                child.stdin.write(tasksCount + "\n");
                _.each(startData.tasks, (v)=>{
                    child.stdin.write(v.input + "\n");
                    child.stdin.write(v.output + "\n");
                });
                child.stdin.write("\n");
                child.stdin.end();
            });
        },

        runTasks2: (data)=>{
            var startData = data;
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
                    executer(`./${data.programName}`, new Buffer(task.input, 'base64').toString(), data.timeLimit, (err, data2)=>{
                        var execTime = data2.time;
                        var res = new Buffer(data2.stdout).toString('base64');
                        if (err){
                            cb(err, null);
                        } else if (data2.code == 666) {
                            cb({
                                code: 5,
                                message: 'Timeout',
                                taskNumber: task.num,
                                status: 'timeout',
                                execTime: execTime
                            }, data);
                        } else if (data2.stderr.length || data2.code){
                            cb({
                                code: data2.code,
                                stderr: data2.stderr,
                                message: data2.stderr,
                                status: 'error',
                                taskNumber: task.num,
                                execTime: execTime
                            }, null);
                        } else {
                            if (res != task.output){
                                cb({
                                    code: 4,
                                    message: 'Wrong answer',
                                    status: 'wrong_answer',
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
                    var payload = {
                        solutionId: data.solutionId
                    };
                    if (err){
                        payload.status = err.status;
                        payload.message = err.message;
                    } else {
                        payload.status = 'ok';
                        payload.message = 'ok';
                    }
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
                                if (data.status == 'ok'){
                                    reject({
                                        break: true
                                    });
                                } else {
                                    globalData.solution = data;
                                    resolve(data);
                                }
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
                    return api.runTasks2({
                        solutionId: globalData.solutionId,
                        programName: fileData.fileName,
                        tasks: globalData.problem.tasks,
                        timeLimit: globalData.problem.timeLimit,
                        memoryLimit: globalData.problem.memoryLimit
                    });
                })
                .then((data)=>{
                    if (fs.existsSync(`./${globalData.fileName}`))
                        fs.unlinkSync(`./${globalData.fileName}`);
                    cb(null, null);
                })
                .catch(err=>{
                    if (fs.existsSync(`./${globalData.fileName}`))
                        fs.unlinkSync(`./${globalData.fileName}`);
                    if (err.break){
                        cb(null, null);
                    } else {
                        var payload = {
                            solutionId: globalData.solutionId,
                            status: err.status || 'error',
                            message: err.message || err.stdout
                        };
                        console.log(err);
                        api.setSolutionResult(payload, (err, data4)=>{
                            cb(null, null);
                        });
                    }
                })
        }
    };

    return api;
};
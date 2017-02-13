module.exports = function(spawn, exec){
    return function(cmd, stdin, timeLimit, callback){
        var callbackIsAlreadyCalled = false;
        if (typeof stdin == 'function')
            callback = stdin;
        if (typeof stdin == 'number')
            timeLimit = stdin;
        if (typeof timeLimit == 'function')
            callback = timeLimit;
        var run = cmd.split(' ')[0];
        cmd = cmd.split(' ').slice(1);
        var res = {
            stdout: '',
            stderr: ''
        };
        var child = spawn(run, cmd);
        child.stdout.on('data', (data) => {
            res.stdout+=data;
        });
        child.stderr.on('data', (data) => {
            res.stderr+=data;
        });
        var start = +(new Date());
        child.on('close', (code, signal) => {
            if (!callbackIsAlreadyCalled) {
                callbackIsAlreadyCalled = true;
                res.code = code;
                if (signal == 'SIGUSR1'){
                    res.code = 666;
                }
                var end = +(new Date());
                res.time = end - start;
                callback(null, res);
            }
        });
        if (timeLimit && typeof timeLimit != 'function'){
            setTimeout(()=>{
                child.kill('SIGUSR1');
            }, timeLimit);
        }
        if (typeof stdin != 'function'){
            child.stdin.write(stdin);
            child.stdin.end();
        }
    };
};
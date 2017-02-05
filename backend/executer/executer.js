module.exports = function(spawn, exec){
    return function(cmd, stdin, timeLimit, callback){
        if (typeof stdin == 'function')
            callback = stdin;
        if (typeof stdin == 'number')
            timeLimit = stdin;
        if (typeof timeLimit == 'function')
            callback = timeLimit;
        var run = cmd.split(' ')[0];
        cmd = cmd.split(' ').slice(1);
        var child = spawn(run, cmd);
        setTimeout(()=>{
            child.kill(55);
        }, timeLimit);
        var res = {
            stdout: '',
            stderr: ''
        };
        child.stdout.on('data', (data) => {
            res.stdout+=data;
        });
        child.stderr.on('data', (data) => {
            res.stderr+=data;
        });
        child.on('close', (code) => {
            res.code = code;
            callback(null, res);
        });
        if (typeof stdin != 'function'){
            child.stdin.write(stdin);
            child.stdin.end();
        }
    };
};
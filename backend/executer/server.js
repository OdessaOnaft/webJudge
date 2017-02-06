var conf = require('../config.js');
var _ = require('underscore'),
    http = require('http'),
    compress = require('compression'),
    domain = require('domain'),
    express= require('express'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    request = require('request'),
    remote = require('../Common/remote.js')(_, request),
    database = {
        guest: require('../Common/database/guest.js')(_, remote(`${conf.database.url}/guest/`, conf.database.secret)),
        student: require('../Common/database/student.js')(_, remote(`${conf.database.url}/student/`, conf.database.secret)),
        teacher: require('../Common/database/teacher.js')(_, remote(`${conf.database.url}/teacher/`, conf.database.secret)),
        admin: require('../Common/database/admin.js')(_, remote(`${conf.database.url}/admin/`, conf.database.secret)),
        system: require('../Common/database/system.js')(_, remote(`${conf.database.url}/system/`, conf.database.secret))
    },
    spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    async = require('async'),
    fs = require('fs'),
    executer = require('./executer.js')(spawn, exec),
    API = require('./executeAPI.js')(_, fs, async, executer, database.system),
    solutionsQueue = require('./solutionsQueue.js')(_, async, database.system, API);



var app = express();
app.use(compress());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({limit: '1gb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(err, req, res, next) {
    if(err){
        res.end(JSON.stringify({
                err: {
                    message: 'Unknown error'
                }
            })+'\n');
    } else {
        res.end(JSON.stringify({
                err: null
            })+'\n');
    }
});

function getHandler(currApi){
    return function(req, res){
        var requestDomain = domain.create();
        requestDomain.on('error', function(err){
            console.log(err.stack);
            res.status(500).json({
                err: {
                    message: 'Internal server error'
                }
            });
        });
        var serverAuthToken = req.header("Authorization");
        if (serverAuthToken !== conf.executer.secret) {
            res.status(400).json({
                err: {
                    message: 'Invalid server auth token'
                }
            });
            return;
        }
        requestDomain.run(function(){
            var methodName = req.url.split('/')[2];
            console.log(methodName);
            currApi[methodName](req.body, function(err, data, warning){
                if(err)
                    console.log(err, err.stack);
                res.status(err?400:200).json({
                    err: err,
                    data: data,
                    warning: warning
                });
            });
        });
    }
}

app.post('/call/*', cors(), getHandler(API));

http.createServer(app).listen(8082);

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.log(err);
    console.log(err.stack);
});
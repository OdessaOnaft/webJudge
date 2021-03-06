var conf = require('../backend/config.js');
var http = require('http'),
    _ = require('underscore'),
    fs = require('fs'),
    domain = require('domain'),
    cors = require('cors'),
    express = require('express'),
    bodyParser = require('body-parser'),
    pg = require('pg'),
    mongojs = require('mongojs'),
    humps = require('humps'),

    errorHandler = require('./errorHandler.js')(_),
    mainPg = require('./pgHandler.js')(_, pg, conf.database.pgConnectionString, humps),
    guest = require('./API/guest.js')(_, mainPg, fs),
    student = require('./API/student.js')(_, mainPg, fs),
    teacher = require('./API/teacher.js')(_, mainPg, fs),
    admin = require('./API/admin.js')(_, mainPg),
    system = require('./API/system.js')(_, mainPg, fs);

/*
    bcrypt = require('bcryptjs'),
    moment = require('moment'),

    mongoDb = mongojs("mongodb://localhost:27017/ordersArchive", ['orders']),
    async = require('async'),
    ordersArchiveController = require('./ordersArchiveController.js')(_, pg, conString, mongoDb, helpers, async, errorHandler)
*/

pg.defaults.poolSize = 80;

var app = express();
app.use(bodyParser.json({limit: '1gb'}));
app.use(cors());
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

function handler(apiName) {
    var api = eval(apiName);
    return function (req, res) {
        try {
            var serverAuthToken = req.header("Authorization");
            var start = _.now();
            if (serverAuthToken !== conf.database.secret) {
                res.status(400).json({
                        err: {
                            message: 'Invalid server auth token'
                        }
                    });
                return;
            }
            var methodName = req.url.split('/')[2];
            if (!_.isObject(req.body)) {
                res.status(400).json({
                        err: {
                            message: 'Invalid package format'
                        }
                    });
                return;
            }
            var data = req.body;
            var killTimer = setTimeout(()=>{
                process.exit();
            }, 300000);
            var requestDomain = domain.create();
            requestDomain.on('error', function(err){
                res.status(500).json({
                    err: {
                        message: 'Internal server error'
                    }
                });
                console.log(err.stack)
            });
            requestDomain.run(function(){
                api[methodName](data, function (err, result) {
                    clearTimeout(killTimer);
                    var end = _.now();
                    console.log(apiName, methodName, _.now(), (end - start) + 'ms');
                    if (err) {
                        err = errorHandler(err);
                        res.send({
                            err: err,
                            data: null
                        });
                    }
                    else {
                        res.send({
                            err: null,
                            data: result
                        });
                    }
                });
            });
        }
        catch (e) {
            console.log(e);
            e.url = req.url;
            res.status(400).json({
                err: e
            });
        }
    }
}


app.post('/guest/*', handler('guest'));
app.post('/student/*', handler('student'));
app.post('/teacher/*', handler('teacher'));
app.post('/admin/*', handler('admin'));
app.post('/system/*', handler('system'));

http.createServer(app).listen(8081);

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.log(err);
    console.log(err.stack);
});
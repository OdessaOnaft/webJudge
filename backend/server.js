var conf = require('./config.js');
var _ = require('underscore'),
    http = require('http'),
    compress = require('compression'),
    domain = require('domain'),
    express= require('express'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    request = require('request'),
    remote = require('./Common/remote.js')(_, request),
    database = {
        guest: require('./Common/database/guest.js')(_, remote(`${conf.database.url}/guest/`, conf.database.secret)),
        student: require('./Common/database/student.js')(_, remote(`${conf.database.url}/student/`, conf.database.secret)),
        teacher: require('./Common/database/teacher.js')(_, remote(`${conf.database.url}/teacher/`, conf.database.secret)),
        admin: require('./Common/database/admin.js')(_, remote(`${conf.database.url}/admin/`, conf.database.secret))
    },

    api = require('./api.js'),
    API = require('./API/index.js')(_, database),
    scopeAPI = api(_, API.restoreSession, API.api, API.validators);




/*
    webSocket = require('./Common/WebSocket.js')(_, remote(conf.WebSocket.url, conf.WebSocket.secret)),
    Locales = require('./Common/Locales/index.js')(_, Logger),
    Notify = require('./Common/Notify.js')(_, push, sms, email, pushDesktop, webSocket, Logger, conf.Notify.baseUrl, Client, Driver, Admin, fs, Locales),
    EventManager = require('./Common/EventManager.js')(_, remote(conf.EventManager.url, conf.EventManager.secret)),
*/


var app = express();
app.use(compress());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(err, req, res) {
    if(err){
        res.status(400).json({
            err: {
                message: 'Unknown error'
            }
        });
    } else {
        res.status(400).json({
            err: null
        });
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
        requestDomain.run(function(){
            var methodName = req.url.split('/')[3];
            if(methodName==='login')
                req.cookies.sessionId = null;
            if(!_.isObject(req.body)){
                res.status(400).json({
                        err: {
                            message: 'Invalid package format'
                        }
                    });
                return;
            }
            currApi.call(req.cookies.sessionId, methodName, req.body, function(err, data, warning){
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

app.post('/call/*', cors(), getHandler(scopeAPI));

http.createServer(app).listen(80);

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.log(err);
    console.log(err.stack);
});
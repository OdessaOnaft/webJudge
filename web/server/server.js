var _ = require('underscore');
var express = require('express');
var compress = require('compression');
var http = require('http');
var fs = require('fs');
var app = express();
app.use(compress());
var staticFiles = express.static(__dirname + '../build/', {maxage: '1h'});
app.use('/', function(req, res, next){
    staticFiles(req, res, next)
});
app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '../build/' });
});
http.createServer(app).listen(80);
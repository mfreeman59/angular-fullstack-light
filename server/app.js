'use strict';

// 実行モード
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// 初期化
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// DBに接続
mongoose.connect(config.mongo.uri, config.mongo.options);

// サーバー起動
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io').listen(server);
// require('./config/socketio')(socketio);
require('./config/express')(app);
require('./route')(app);

// start server
server.listen(config.port, config.ip, function(){
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;


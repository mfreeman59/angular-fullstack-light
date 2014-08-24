'use strict';

var path = require('path');
var _ = require('lodash');

// All configurations will extend these options
var all = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }

};

module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV  + '.js') || {});



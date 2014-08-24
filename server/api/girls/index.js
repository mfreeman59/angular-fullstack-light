'use strict';

var express = require('express');
var controller = require('./girls.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/details/:id', controller.details);

module.exports = router;



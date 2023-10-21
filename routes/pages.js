var express = require('express');
var router = express.Router();
var helpers = require('../helpers');
var controllers = require('../controllers');

/* GET home page. */
helpers.setupPageRoute(router, '/', [], controllers.pages.getHomePage)

module.exports = router;

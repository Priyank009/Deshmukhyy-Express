const express = require('express');
const router = express.Router();
const {setupApiRoute} = require('../../helpers');
const controllers = require('../../controllers');
const middlewares = require('../../middlewares');

setupApiRoute(router, 'post', '/create', [middlewares.user.authenticateUser], controllers.api.request.createRequest)

module.exports = router;
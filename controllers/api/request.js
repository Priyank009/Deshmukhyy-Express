const helpers = require('../../helpers');
const apiHandlers = require('../../api');

const requestController = module.exports;

requestController.createRequest = async (req, res) => {
	helpers.formatApiResponse(200, res, await apiHandlers.request.createRequest(req));
};
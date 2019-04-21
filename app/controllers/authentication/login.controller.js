var router = require('express').Router();
var request = require('request');

var config = require('./../../../_core/config');

/**
 * Get url from client with get method
 * delete lastest user token]
 * and redirect to login page with new viewData
 */
router.get('/', function(req, res, next) {
    // log user out
    delete req.session.token;

    // move success message into local variable so it only appears once (single read)
    var viewData = { success: req.session.success };
    delete req.session.success;

    res.render('login', viewData);
});

/**
 * Get data form client with post method
 * Send data to user.server.js using request method 
 * Get data and render page to client main application
 */
router.post('/', function(req, res, next) {
    // authenticate using api to maintain clean separation between layers
    request.post({
        url: config.client.url + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('login', { error: 'An error occurred' });
        }

        if (!body.token) {
            return res.render('login', { error: body, username: req.body.username });
        }

        // save JWT token in the session to make it available to the angular app
        req.session.token = body.token;

        // redirect to returnUrl
        var returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
        res.redirect(returnUrl);
    });
});

module.exports = router;
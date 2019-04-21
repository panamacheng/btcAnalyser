var router = require('express').Router();
var request = require('request');

var config = require('./../../../_core/config');

/**
 * Get url from client with get method
 * and redirect to register page with new viewData
 */
router.route('/').get(function(req, res, next) {
    res.render('register');
});

/**
 * Get data form client with post method
 * Send data to user.server.js using request method 
 * Get data and render page to login page
 */
router.route('/').post(function(req, res, next) {
    request.post({
        url: config.client.url + '/users/register',
        form: req.body,
        json: true
    }, function(error, response, body) {
        if (error) {
            return res.render('register', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('register', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username
            });
        }

        // return to login page with success message
        req.session.success = 'Registration successful';
        return res.redirect('/login');
    });
});

module.exports = router;
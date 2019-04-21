var express = require('express');
var router = require('express').Router();

/**
 * Get application url from client 
 * if url is not login and there is no session then change url to login
 * else go to client main application
 */
router.use('/', function(req, res, next) {
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
    }

    next();
});

// make JWT token available to angular app
router.get('/token', function(req, res) {
    res.send(req.session.token);
});

// serve angular app files from the '/app' route
router.use('/', express.static('public'));

module.exports = router; 
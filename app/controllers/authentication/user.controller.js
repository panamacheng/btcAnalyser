var router = require('express').Router();

var userService = require('./../../services/user.service');
/**
 * Routes
 */
router.post('/register', RegisterUser);
router.post('/authenticate', AuthenticateUser);
router.get('/current', GetCurrentUser);
router.put('/:_id', UpdateUser);
router.get('/:_id', DeleteUser);
router.post('/change-password', ChangePassword);
router.get('/', GetAllUsers);
router.get('/gettime/:_id', GetDateTime);
router.post('/estimate', GetEstimateData);

module.exports = router;

function RegisterUser(req, res) {
    userService.Create(req)
        .then(function() {
            res.sendStatus(200);
        })
        .catch(function(error) {
            res.status(400).send(error);
        });
}

function AuthenticateUser(req, res) {
    userService.Authenticate(req.body.email, req.body.password)
        .then(function(token) {
            if (token) {
                res.send({ token: token });
            } else {
                res.status(401).send('User Emaiil or password is incorrect');
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function GetCurrentUser(req, res) {
    userService.GetById(req.user.sub)
        .then(function(user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

//  UpdateUser
function UpdateUser(req, res) {
    userService.UpdateUser(req)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function DeleteUser(req, res){
    userService.DeleteUser(req)
    .then(function(){
        res.sendStatus(200);
    })
    .catch(function(err){
        res.status(400).send(err);
    });
}

function ChangePassword(req, res){
    var data = req.body;
    userService.ChangePassword(req, data)
    .then(function(data){
        if(data){
            res.sendStatus(200).send(data);
        }
    })
    .catch(function(error){
        res.status(400).send(error);
    });
}

function GetAllUsers(req, res){
    userService.GetAllUsers()
        .then(function(user) {
            if(user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function GetDateTime(req, res){
    userService.GetDateTime(req)
    .then(function(data){
      
        if(data){ 
            res.send(data);
        }
    })
    .catch(function(error){
        res.status(400).send(error);
    });
}

function GetEstimateData(req, res){
    userService.GetEstimateData(req)
    .then(function(data){
        if(data){
            res.send(data);
        }
    })
    .catch(function(error){
        res.status(400).send(error);
    });
}

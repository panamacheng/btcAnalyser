var Q = require('q');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var config = require('../../_core/config');
var dbConn = require('../../_core/dbConn');

/**
 *  Define services
 */
var service = {};
service.Create = Create;
service.Authenticate = Authenticate;
service.GetById = GetById;
service.UpdateUser = Update;
service.DeleteUser = Delete;
service.ChangePassword = ChangePassword;
service.GetAllUsers = GetAllUsers;
service.GetDateTime = GetDateTime;
service.GetEstimateData = GetEstimateData;


module.exports = service;

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @implements main service function
 * @description Register user with req.body = user to users table in mysql.
 */
function Create(req, res) {
    var deferred = Q.defer();
    var userParam = req.body;
    FindUser(userParam, function(callback) {
        if (callback.length > 0) {
            deferred.reject('Username "' + callback[0].username + '" is already token');
        } else {
            CreateUser(userParam, function(callback) {
                if (callback.insertId > 0) {
                    deferred.resolve();
                } else {
                    deferred.reject('Username "' + userParam.username + '" can not create your account');
                }
            });
        }
    });
    
    return deferred.promise;
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @implements main service function
 * @description Authenticate user iwht his email and password
 */
function Authenticate (email, password) {
    var deferred = Q.defer();
    var userParam = {
        email : email,
        password : password
    };

    FindUser(userParam, function(callback) {
        if (callback.length > 0) {
            if (bcrypt.compareSync(password, callback[0].hash)) {
                deferred.resolve(jwt.sign({ 
                    sub: callback[0].id
                }, config.session.secret));
            } else {
                // authentication failed
                deferred.resolve();
           }
        } else {
            deferred.reject("Authentication failed!");
        }
    });

    return deferred.promise;
}

/**
 * 
 * @param {*} _id 
 * @implement main Service Finction
 * @description get user by id in mysql => return to front app.
 */
function GetById( _id ) {
    var deferred = Q.defer();
    FindByIdUser(_id, function(callback) {
        if (callback.length > 0) {
            deferred.resolve(_.omit(callback[0], 'hash'));
        } else {
            deferred.reject("Authentication Error!, There is no user!");
        }
    });

    return deferred.promise;
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @implements main service function
 * @description Register user with req.body = user to users table in mysql.
 */
function Update(req, res) {
    var deferred = Q.defer();
    var userParam = req.body;
    FindByIdUser(userParam.id, function(callback) {
        if (callback.length < 1) {
            deferred.reject('Username "' + callback[0].username + '" cant find is already token');
        } else {
            UpdateUser(userParam, function(callback) {
                if (callback.affectedRows > 0) {
                    deferred.resolve();
                } else {
                    deferred.reject('Username "' + userParam.username + '" can not create your account');
                }
            });
        }
    });
    return deferred.promise;
}

function UpdateUser(userParam, callback) {
    var deferred = Q.defer(); 
    var UpdateSql = "UPDATE users SET firstName = ?, lastName =?, email =?, username =?, auth=? WHERE id = ?";
    
    dbConn.query(UpdateSql, [userParam.firstName, userParam.lastName, userParam.email, userParam.username, userParam.auth, userParam.id], function(error, results, fields) {
        if(error) {
            deferred.reject(error);
        }
        callback(results);
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @implements main service function
 * @description Register user with req.body = user to users table in mysql.
 */
function Delete(req, res) {
    var deferred = Q.defer();
    var userParam = req.params;
    FindByIdUser(userParam._id, function(callback) {
        if (callback.length < 1) {
            deferred.reject('User cant find ');
        } else {
            DeleteUser(userParam._id, function(callback) {
          
                if (callback.affectedRows > 0) {
                    deferred.resolve();
                } else {
                    deferred.reject('Username "' + userParam.username + '" can not create your account');
                }
            });
        }
    });
    return deferred.promise;
}

function DeleteUser(_id, callback) {
    var deferred = Q.defer(); 
    var DeleteSql = "UPDATE users SET  state = 1 WHERE id = ?";
    dbConn.query(DeleteSql, [_id], function(error, results, fields) {
        if(error){
            deferred.reject(error);
        }
        callback(results);
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} data 
 * @implements Main Function
 * @description change the current users password
 */
function ChangePassword(req, data) {
    var deferred = Q.defer();
    var _id = req.user.sub;

    FindByIdUser(_id, function(callback) {
        if (callback.length > 0) {
            var currHash = callback[0].hash;
            var currPass = data.currPass;
            var newPass = data.newPass;

            if (bcrypt.compareSync(currPass, currHash) == true) {
                var newHash = bcrypt.hashSync(newPass, 10);
                UpdatePassword(_id, newHash, function(callback) {
                    if (callback.serverStatus > 0) {
                        deferred.resolve("Your Password has been changed succussflly!!");
                    } else {
                        deferred.reject("Your password have not changed!");
                    }
                });
            }
        }
    });

    return deferred.promise;
}

function UpdatePassword(_id, hash, callback) {
    var updateSql = 'UPDATE users SET hash = ? WHERE id = ?';
    dbConn.query(updateSql, [hash, _id], function(error, results, fields) {
        if (error) { console.log(error); }
        callback(results);
    });
}

/**
 * 
 * @param {*} req 
 * @param {*} data 
 * @implements Main Function
 * @description Get all users
 */
function GetAllUsers() {
    var deferred = Q.defer();
    FindAllUser(function(callback) {
        if (callback.length > 0) {
            deferred.resolve(_.add(callback));
            
        } else {
            deferred.reject("Find user Error!, There is no user!");
        }
    });
    return deferred.promise;
}

 /**
 * GetEstimateData
 * @param {*} userid, datetime 
 * @param {*} callback
 * @implements Create User on "Users" table in mysql database
 */
function GetEstimateData(req,callback){
    var deferred = Q.defer();
    var userid = req.body.userid;
    var savedatetime = req.body.savedatetime; 
    var isodate = new Date(savedatetime).toISOString();

    var EstimateDataQeury = "SELECT a.close, a.saveDate, b.username, a.time FROM (SELECT * FROM `estimate_tbl` WHERE userid = ? and saveDate = ? ) AS a LEFT JOIN  users AS b ON    a.userid = b.id ORDER BY saveDate";
    dbConn.query(EstimateDataQeury,[userid, isodate], function(error, results, fields) {
        if(error){
            deferred.reject(error);
        }
        deferred.resolve(_.add(results));
    });
    return deferred.promise;
}

/**
 * GetDateTime
 * @param {*} userid, savedatetime 
 * @param {*} res
 * @implements Create User on "Users" table in mysql database
 */
function GetDateTime(req, res){
    var deferred = Q.defer();
    var userid = req.params._id;

    var EstimateDataQeury = "SELECT saveDate FROM estimate_tbl WHERE userid = ? GROUP BY LEFT(saveDate,19)";
    dbConn.query(EstimateDataQeury,[userid], function(error, results, fields) {
        if(error){
            deferred.reject(error);
        }

        deferred.resolve(_.add(results));
        
    });
    return deferred.promise;
}

/**
 * 
 * @param {*} data 
 * @param {*} callbak
 * @implements Find User by ID on users table in mysql database
 */
function FindByIdUser (data, callbak) {
    var deferred = Q.defer();
    var selectSql = 'SELECT * FROM users WHERE id = ?';
    dbConn.query(selectSql, [data], function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callbak(results);
    });
}

/**
 * 
 * @param {*} data 
 * @param {*} callback 
 * @implements Find user by email on users table in mysql database.
 */
function FindUser(data, callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT * FROM users WHERE email = ?';
    dbConn.query(selectSql, [data.email], function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results);
    });
}

/**
 * 
 * @param {*} data 
 * @param {*} callback
 * @implements Create User on "Users" table in mysql database
 */
function CreateUser (data, callback) {
    var deferred = Q.defer();
    var user = _.omit(data, 'password');
    user.hash = bcrypt.hashSync(data.password, 10);
    user.auth = 'user';
    var insertSql = 'INSERT INTO users SET ?';
    dbConn.query(insertSql, [user], function(error, results, fields) {
        if (error) {
            deferred.reject('Username "' + userParam.username + '" can not create your account');
        }

        callback(results);
    });
}

function FindAllUser(callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT * FROM users WHERE state =0';
    dbConn.query(selectSql, function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results);
    });
}


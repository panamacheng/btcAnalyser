var mysql = require('mysql2');
var config = require('./config');

var dbConn = new mysql.createConnection(config.mysql);

dbConn.connect(function(err) { 
    if (err) { 
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    } else {
        console.log("Connection established ID is " + dbConn.threadId);
    }   
});

module.exports = dbConn;
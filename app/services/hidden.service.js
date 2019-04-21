var Q = require('q');
var _ = require('lodash');
var config = require('../../_core/config');
var dbConn = require('../../_core/dbConn');

var service = {};
service.GetLast1MonthHidden = GetLast1MonthHidden;

module.exports = service;

function GetLast1MonthHidden() {
    var deferred = Q.defer();
    GetMaxIsoDate(function(callback) {
        var endTime = callback.max;
        var startTime = new Date(new Date(endTime).getTime() - 2592000000).toISOString();
        
        GetCustomizeData(startTime, endTime, function(callback) {
            deferred.resolve(_.add(callback));
        });
    });

    return deferred.promise;
}

function GetMaxIsoDate(callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT MAX(isoDate) AS max FROM hidden_order_tbl';

    dbConn.query(selectSql, function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results[0]);
    });
}


function GetCustomizeData (startTime, endTime, callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT * FROM hidden_order_tbl WHERE isoDate BETWEEN ? AND ? order by isoDate';
    dbConn.query(selectSql, [startTime, endTime], function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results);
    });
}
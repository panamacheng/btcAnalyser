var Q = require('q');
var _ = require('lodash');
var config = require('../../_core/config');
var dbConn = require('../../_core/dbConn');

/**
 *  Define services
 */
var service = {};
service.GetLast7dayTrade = GetLast7dayTrade;

module.exports = service;

function GetLast7dayTrade() {
    var deferred = Q.defer();
    GetMaxIsoDate(function(callback) {
        var endTime = callback.max;
        var startTime = new Date(new Date(endTime).getTime() - 86400000).toISOString();
        GetCustomizeData(startTime, endTime, function(callback) {
            deferred.resolve(_.add(callback));
        });
    });

    return deferred.promise;
}

function GetMaxIsoDate(callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT MAX(isoDate) AS max FROM volume_tmp';

    dbConn.query(selectSql, function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results[0]);
    });
}

function GetCustomizeData (startTime, endTime, callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT * FROM volume_tmp WHERE isoDate BETWEEN ? AND ?';
    dbConn.query(selectSql, [startTime, endTime], function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results);
    });
}
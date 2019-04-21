var Q = require('q');
var _ = require('lodash');
var config = require('../../_core/config');
var dbConn = require('../../_core/dbConn');

/**
 *  Define services
 */
var service = {};
service.GetLast1MonthPrice = GetLast1MonthPrice;
service.GetCustomizePrice = GetCustomizePrice;

module.exports = service;

function GetLast1MonthPrice() {
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

function GetCustomizePrice(startTime, endTime) {
    var deferred = Q.defer();

    GetCustomizeData(startTime, endTime, function(callback) {
        deferred.resolve(_.add(callback));
    });
    
    return deferred.promise;
}

function GetMaxIsoDate(callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT MAX(isoDate) AS max FROM price_5m_tbl';

    dbConn.query(selectSql, function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results[0]);
    });
}

function GetCustomizeData (startTime, endTime, callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT * FROM price_5m_tbl WHERE isoDate BETWEEN ? AND ?';
    dbConn.query(selectSql, [startTime, endTime], function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results);
    });
}
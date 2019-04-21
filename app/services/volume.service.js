var Q = require('q');
var _ = require('lodash');
var config = require('../../_core/config');
var dbConn = require('../../_core/dbConn');

/**
 *  Define services
 */
var service = {};
service.GetLast1MonthVolume = GetLast1MonthVolume;
service.GetCustomizeVolume = GetCustomizeVolume;

module.exports = service;

var tmpDataArray = [];
function GetLast1MonthVolume() {
    var deferred = Q.defer();
    GetMaxIsoDate(function(callback) {
        var endTime = callback.max;
        var startTime = new Date(new Date(endTime).getTime() - 2592000000).toISOString();
        
        GetCustomizeData(startTime, endTime, function(callback) {
            tmpDataArray.push(callback);
            // for (var obj of callback) {
            //     tmpDataArray.push(obj);
            // }
            GetCutomizePrice (startTime, endTime, function(callback) {
                tmpDataArray.push(callback);
                // for (var obj of callback) {
                //     tmpDataArray.push(obj)
                // }

                deferred.resolve(_.add(tmpDataArray));
                tmpDataArray = [];
            });
        });
    });

    return deferred.promise;
}


function GetCustomizeVolume(startTime, endTime) {
    var deferred = Q.defer();

    GetCustomizeData(startTime, endTime, function(callback) {
        if (callback.length > 0) {
            deferred.resolve(_.add(callback));
        } else {
            deferred.reject('There is null');     
        }
        
    });
    
    return deferred.promise;
}


function GetCutomizePrice(startTime, endTime, callback) {
    var selectSql = 'SELECT * FROM price_5m_tbl WHERE isoDate BETWEEN ? AND ?';

    dbConn.query(selectSql, [startTime, endTime], function(error, results, fields) {
        if (error) { console.log(error); }

        callback(results);
    });
}

function GetMaxIsoDate(callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT MAX(isoDate) AS max FROM volume_5m_tbl';

    dbConn.query(selectSql, function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }

        callback(results[0]);
    });
}

function GetCustomizeData (startTime, endTime, callback) {
    var deferred = Q.defer();
    var selectSql = 'SELECT * FROM volume_5m_tbl WHERE isoDate BETWEEN ? AND ?';
    dbConn.query(selectSql, [startTime, endTime], function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }
        //console.log(results);
        callback(results);
    });
}
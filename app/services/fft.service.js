var Q = require('q');
var _ = require('lodash');
var config = require('../../_core/config');
var dbConn = require('../../_core/dbConn');

/**
 *  Define services
 */
var service = {};
service.GetLast1MonthFFT = GetLast1MonthFFT;
service.GetDataByCandle = GetDataByCandle;
service.GetEstimateFFT = GetEstimateFFT;

module.exports = service;

/**
 * Global values
 */
var arrayEstimate = [];

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function GetLast1MonthFFT(req, res) {
    var deferred = Q.defer();
    GetMaxIsoDate(function(callback) {
        var endTime = callback.max;
        var startTime = new Date(new Date(endTime).getTime() - 2592000000).toISOString();
        var selectSql = 'SELECT * FROM price_5m_tbl WHERE isoDate BETWEEN ? AND ?';

        GetCustomizeData(selectSql, startTime, endTime, function(callback) {
            deferred.resolve(_.add(callback));
        });
    });

    return deferred.promise;
}

function GetDataByCandle(candle, startTime, endTime) {
    var deferred = Q.defer();
    var selectSql = 'SELECT MAX(id) as id, MAX(isoDate) AS isoDate ,symbol, MAX(`open`) as open , MAX(high) as high ,MIN(low) as low, MIN(`close`) as close FROM `price_5m_tbl` WHERE isoDate BETWEEN ? AND ? ';
    var insertSql = 'INSERT INTO candle_tmp SET ?';
    var deleteSql = 'TRUNCATE TABLE candle_tmp';

    dbConn.query(deleteSql, function(error, results, fields) {
        if (error) {console.log(error); }
        switch (parseInt(candle)) {
            case 1: 
                selectSql += 'GROUP BY isoDate  ORDER BY id';
                GetCustomizeData(selectSql, startTime, endTime, function(callback) {
                    deferred.resolve(_.add(callback));
                });
                break;
            case 2:
                selectSql += 'GROUP BY isoDate  ORDER BY id';
                GetCustomizeData(selectSql, startTime, endTime, function(callback) {
                    StoreCandleTempData(callback, insertSql, 2, function(callback) {
                        if (callback > 0) {
                            GetCandleTempData(function(callback) {
                                if (callback.length > 0) {
                                    deferred.resolve(_.add(callback));
                                } else {
                                    deferred.reject("connection error!");
                                }
                            });
                        } else {
                            deferred.reject("connection error!");
                        }
                    });
                });
                break;
            case 3:
                selectSql += 'GROUP BY isoDate ORDER BY id';
                GetCustomizeData(selectSql, startTime, endTime, function(callback) {
                    StoreCandleTempData(callback, insertSql, 6, function(callback) {
                        if (callback > 0) {
                            GetCandleTempData(function(callback) {
                                if (callback.length > 0) {
                                    deferred.resolve(_.add(callback));
                                } else {
                                    deferred.reject("connection error!");
                                }
                            });
                        } else {
                            deferred.reject("connection error!");
                        }
                    });
                });
                break;
            case 4:
                selectSql += 'GROUP BY LEFT(isoDate, 13) ORDER BY id';
                GetCustomizeData(selectSql, startTime, endTime, function(callback) {
                    deferred.resolve(_.add(callback));
                });
                break;
            case 5:
                selectSql += 'GROUP BY LEFT(isoDate, 13) ORDER BY id';
                GetCustomizeData(selectSql, startTime, endTime, function(callback) {
                    StoreCandleTempData(callback, insertSql, 3, function(callback) {
                        if (callback > 0) {
                            GetCandleTempData(function(callback) {
                                if (callback.length > 0) {
                                    deferred.resolve(_.add(callback));
                                } else {
                                    deferred.reject("connection error!");
                                }
                            });
                        } else {
                            deferred.reject("connection error!");
                        }
                    });
                });
                break;
            case 6:
                selectSql += 'GROUP BY LEFT(isoDate, 10) ORDER BY id';
                GetCustomizeData(selectSql, startTime, endTime, function(callback) {
                    deferred.resolve(_.add(callback));
                });
                break;
        }
    });
  
    return deferred.promise;
}

function StoreCandleTempData (data, insertSql, _value, callback) {
    if(data.length > 0) {
        var index = 1;
        var i = 1;
        var temp;
        for (var obj of data) {
            if (index % _value == 0) {
                temp = i++;
            } else {
                temp = i;
            }
            index ++;
            var tmpData = {
                sortid: temp,
                isoDate: obj.isoDate,
                symbol: obj.symbol,
                open: obj.open,
                high: obj.high,
                low: obj.low,
                close: obj.close
            };

            dbConn.query(insertSql, [tmpData], function(error, results, fields) {
                if (error) { console.log(error); }
            });
        }

        callback(1);
    } else {
        callback(0);
    }
}

function GetCandleTempData (callback) {
    var selectSql = 'SELECT  MAX(isoDate) AS isoDate ,symbol, MAX(`open`) as open , MAX(high) as high ,MIN(low) as low, MIN(`close`) as close FROM candle_tmp GROUP BY sortid';

    dbConn.query(selectSql, function(error, results, fields) {
        if (error) {console.log(error);}

        callback(results);
    });
}

//GetCustomizeData
function GetEstimateFFT(data) {
    var deferred = Q.defer();
    GetLastTrade(function(callback) {
        var tmp = callback[0];
        StoreEstimateRows(data, tmp, function(callback) {
            if (callback > 0) {
                GetMaxIsoDate(function(callback) {
                    var endTime = callback.max;
                    var startTime = new Date(new Date(endTime).getTime() - 2592000000).toISOString();
                    Store3HourCandle(startTime, endTime, function(callback) {
                        if(callback > 0) {
                            Get3HourCandle(function(callback) {
                                var tempArrayData = callback;

                                for(var obj of arrayEstimate) {
                                    tempArrayData.push({
                                        isoDate: obj.isoDate,
                                        symbol: 'XBTUSD',
                                        open: obj.open,
                                        high: obj.high,
                                        low: obj.low,
                                        close: obj.close
                                    });
                                }
                                arrayEstimate = [];
                                
                                deferred.resolve(_.add(tempArrayData));
                                tempArrayData = [];
                                
                            });
                        } else {
                            deferred.reject('There is null');      
                        }
                    });
                });
            }
        });
    });
    return deferred.promise;
}

function GetLastTrade(callback) {
    var selectSql= 'SELECT * FROM `price_5m_tbl` ORDER BY isoDate  DESC LIMIT 0 , 1';
    dbConn.query(selectSql, function(error, results, fields) {
        if (error) { console.log(error); }
        callback(results);
    });
}

function StoreEstimateRows(data, tmp, callback) {
    var tmpIsoDate = tmp.isoDate;
    var tmpPrice = tmp.close;
    var insertSql = "INSERT INTO `estimate_tbl` SET ?";
    var tempArrayData = data.tmpArray;

    for (var i = 0; i< tempArrayData.length; i++) {
        var delta = 0;
        var tmpOpen = 0;
        var tmpLow = 0;
        //var tmpIsoDate;
        if( i == 0 ) {
            delta = Math.abs((parseFloat(tempArrayData[i].price) - parseFloat(tmpPrice))/2);
            tmpIsoDate = new Date( new Date(new Date(tmpIsoDate)).getTime() + 1000*60*tempArrayData[i].time);
        }
        else {
            delta = Math.abs((parseFloat(tempArrayData[i].price) - parseFloat(tmpPrice))/2);
            tmpIsoDate = new Date( new Date(new Date(tmpIsoDate)).getTime() + 1000*60*tempArrayData[i].time);
        }

        tmpOpen = tmpLow = parseFloat(tempArrayData[i].price)- delta;

        var estimateRows = {
            userid: tempArrayData[i]._id,
            isoDate: (new Date(tmpIsoDate)).toISOString(),
            open: tmpOpen,
            high: tempArrayData[i].price,
            low: tmpLow,
            close: tempArrayData[i].price,
            time: tempArrayData[i].time,
            saveDate: (new Date()).toISOString(),
            state: 0
        };

        arrayEstimate.push(estimateRows);

        dbConn.query(insertSql, [estimateRows], function(error, results, fields) {
            if (error) { console.log(error); }
            callback(results.serverStatus);
        });
    }
}

function Store3HourCandle(startTime, endTime, callback) {
    var deleteSql = 'TRUNCATE TABLE estimate_tmp';
    var selectSql = 'SELECT MAX(id) as id, MAX(isoDate) AS isoDate ,symbol, MAX(`open`) as open , MAX(high) as high ,MIN(low) as low, MIN(`close`) as close FROM `price_5m_tbl` WHERE isoDate BETWEEN ? AND ?  GROUP BY LEFT(isoDate,13)  order by id ';
    var insertSql = 'INSERT INTO estimate_tmp SET ?';

    dbConn.query(deleteSql, function(error, results, fields) {
        if (error) {console.log(error); }

        dbConn.query(selectSql, [startTime, endTime], function(error, results, fields) {
            if (error) { console.log(error); }
            if(results.length > 0) {
                var index = 1;
                var i = 1;
                var temp;
                for (var obj of results) {
                    if (index % 3 == 0) {
                        temp = i++;
                    } else {
                        temp = i;
                    }
                    index ++;
                    var tmpData = {
                        sortid: temp,
                        isoDate: obj.isoDate,
                        symbol: obj.symbol,
                        open: obj.open,
                        high: obj.high,
                        low: obj.low,
                        close: obj.close
                    };

                    dbConn.query(insertSql, [tmpData], function(error, results, fields) {
                        if (error) { console.log(error); }
                    });
                }
    
                callback(1);
            } else {
                callback(0);
            }
        });
    });
}

function Get3HourCandle(callback) {
    var get3HourCandleSql = 'SELECT  MAX(isoDate) AS isoDate ,symbol, MAX(`open`) as open , MAX(high) as high ,MIN(low) as low, MIN(`close`) as close FROM estimate_tmp GROUP BY sortid';

    dbConn.query(get3HourCandleSql, function(error, results, fields) {
        if (error) {console.log(error); }
        callback(results);
    });
}

function GetMaxIsoDate(callback) {
    var selectSql = 'SELECT MAX(isoDate) AS max FROM price_5m_tbl';

    dbConn.query(selectSql, function(error, results, fields) {
        if (error) {            
            console.log(error);
        }

        callback(results[0]);
    });
}

function GetCustomizeData (selectSql, startTime, endTime, callback) {
    dbConn.query(selectSql, [startTime, endTime], function(error, results, fields) {
        if (error) {            
            deferred.reject("Error!");
        }
        callback(results);
    });
}
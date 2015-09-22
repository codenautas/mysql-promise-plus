"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var mysqlPromisePlus = {};

var Promises = require('promise-plus');
var mysql = require('mysql');

mysqlPromisePlus.Motor = function MysqlMotor(){};
mysqlPromisePlus.Motor.motorName = 'MysqlPromisePlus';
mysqlPromisePlus.Motor.defaultPort = 3306;

mysqlPromisePlus.Motor.connect = function connect(connectParameters){
    return Promises.make(function(resolve, reject){
        //connectParameters.debug = true;
        var con = mysql.createConnection(connectParameters);
        con.connect(function(err) {
           if(err) {
               reject(err);
           } else {
               resolve(con);
           }
        });
    });
};

mysqlPromisePlus.Motor.done = function done(internal){
    return Promises.start(function(){
        internal.end();
        return internal.done();
    });
};

mysqlPromisePlus.Motor.prepare = function prepare(internal, sqlSentence){
    return Promises.make(function(resolve, reject) {
        resolve({conn:internal, sql:sqlSentence});
    });
};

mysqlPromisePlus.Motor.query = function query(internal, data){
    return Promises.start(function() {
       return {
            conn:internal.conn,
            sql:internal.sql,
            data:data
        };
    });
};

mysqlPromisePlus.Motor.fetchAll = function fetchAll(internal){
    return Promises.make(function(resolve, reject){
        var options = {sql:internal.sql};
        if(internal.data) { options.values = internal.data; }
        internal.conn.query(options, function (error, results, fields) {
           if(error) {
               reject(error);
           } else {
               resolve({rowCount:results.length||1, rows:results});
           }
        });
    });
};

mysqlPromisePlus.Motor.fetchRowByRow = function fetchRowByRow(internal, functions){
    var options = {sql:internal.sql};
    if(internal.data) { options.values = internal.data; }
    var q= internal.conn.query(options);
    q.on('error', functions.onError);
    q.on('result', functions.onRow);
    q.on('end', functions.onEnd);
};

mysqlPromisePlus.Motor.placeHolder = function placeHolder(n){
    return '?';
};

module.exports = mysqlPromisePlus;

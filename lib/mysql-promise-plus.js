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
        var options = {};
        options.sql = internal.sql;
        if(internal.data) {
            options.values = internal.data;
        }
        internal.conn.query(options, function (error, results, fields) {
           if(error) {
               reject(error);
           } else {
               resolve({rowCount:results.length||1, rows:results});
           }
        });
    });
};

mysqlPromisePlus.Motor.fetchRowByRow = function fetchAll(internal, functions){
    return Promises.make(function(resolve, reject){
        internal.stmt.each(internal.data || [],
            function(err, row) {
                if(err){
                    reject(err);
                }else{
                    functions.onRow(row);
                }
            },
            function(err, numRows) {
                if(err) { reject(err); }
                functions.onEnd();
                resolve({rowCount:numRows});
            }
        );
    });
};

mysqlPromisePlus.Motor.placeHolder = function placeHolder(n){
    return '?';
};

module.exports = mysqlPromisePlus;

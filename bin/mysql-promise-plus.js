"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */

var mysqlPromisePlus = {};

var Promises = require('best-promise');
var sqlPromise = require('sql-promise');
var mysql = require('mysql');

function MysqlConnection(params) {
    this.conn = mysql.createConnection(params);
    this.connect = function() {
        con.connect(function(err) {
            if(err) { throw err; }
        });
    };
};

function MysqlPreparedQuery(conn, sql) {
    this.conn = conn.conn;
    this.sql = sql;
};

function MysqlResult(rows, fields) {
    this.rows = rows;
    this.rowCount = rows.length;
    this.fields = fields;
};

function MysqlQuery(preparedQuery, data) {
    this.conn = preparedQuery.conn;
    this.sql = preparedQuery.sql;
    this.data = data;
};

mysqlPromisePlus.Motor = function MysqlMotor() {
    this.connect=function connect(params) {
        if(! params) {
            return Promises.reject("MysqlMotor: null params");
        }
        return Promises.make(function(resolve, reject){
            var con = new MysqlConnection(params);
            con.conn.connect();
            resolve(con);
        });
    };
    this.prepare=function prepare(con, sql) {
        return Promises.make(function(resolve, reject){
            resolve(new MysqlPreparedQuery(con, sql));
        });
    };
    this.query=function query(preparedQuery, data) {
        return Promises.make(function(resolve, reject){
            resolve(new MysqlQuery(preparedQuery, data));
        });
    };
  
    function promiseQuery(obj, queryFunc) {
        return function(sql, data){
            var This = obj;
            return new Promises.Promise(function(resolve, reject){
                function pFunc(err, rows, fields){
                    if(err){
                        reject(err);
                    }else{
                        resolve(new MysqlResult(rows, fields));
                    }
                };
                queryFunc.call(This, sql, data, pFunc);
            });
        }
    }
    
    this.fetchAll=function(q) {
        var runQ = promiseQuery(q.conn, q.conn.query);
        return runQ(q.sql, q.data);
    };
    
    this.close=function close(con) {
        con.conn.end();
    }
};

module.exports = mysqlPromisePlus;

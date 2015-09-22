"use strict";

var Path = require('path');
var winOS = Path.sep==='\\';

var MotorMysql = require('..').Motor;

var defaultConnOpts = {
  host       : 'localhost',
  user       : 'node',
  password   : 'edon',
  database   : 'nodepru'
};
if(! winOS) {
    defaultConnOpts['socketPath']= '/var/run/mysql/mysql.sock';
}

function prepareConnection(){
    var dbFile = defaultConnOpts.file;
    return fs.unlink(dbFile).catch(function(err){
        if(err.code!=='ENOENT'){ throw err; }
    }).then(function(){
        MotorSqlite.connect(defaultConnOpts);
    });
}

tester(MotorSqlite, {
    connOpts: defaultConnOpts, 
    badConnOpts: 'inexis_file.db', 
    prepare:prepareConnection
});

/*
var mysqlPMS = require('..');

var motor = new mysqlPMS.Motor;
var conn=null;
motor.connect(defaultConnOpts).then(function(con) {
    // console.log("******************* con", con);
    //return motor.prepare(con, "CREATE table t1(id integer, name varchar);");
    conn = con;
    return motor.prepare(con, "SELECT * from t1");
}).then(function(prepared) {
    // console.log("******************* prepared", prepared);
    return motor.query(prepared, "");
}).then(function(query) {
    //console.log("******************* query", query.conn);
    return motor.fetchAll(query);
}).then(function(result) {
    console.log("******************* result", result);
    motor.close(conn);
}).catch(function(err) {
    console.log("******************* err", err.stack);
});
*/
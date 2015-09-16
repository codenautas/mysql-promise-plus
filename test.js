"use strict";

var Path = require('path');
var winOS = Path.sep==='\\';

var params = {
  host       : 'localhost',
  user       : 'node',
  password   : 'edon',
  database   : 'nodepru'
};
if(! winOS) {
    params['socketPath']= '/var/run/mysql/mysql.sock';
}

var mysqlPMS = require('./mysql-pms.js');

var motor = new mysqlPMS.Motor;
var conn=null;
motor.connect(params).then(function(con) {
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

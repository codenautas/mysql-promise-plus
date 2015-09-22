"use strict";

var Promises = require('promise-plus');
var tester=require('sql-promise-tester');
var Path = require('path');
var winOS = Path.sep==='\\';

var MotorMysql = require('..').Motor;

var defaultConnOpts = {
  motor      :'test',
  host       : 'localhost',
  user       : 'node',
  password   : 'edon',
  database   : 'nodepru',
  port       : MotorMysql.defaultPort
};
if(! winOS) {
    defaultConnOpts['socketPath']= '/var/run/mysql/mysql.sock';
}

function prepareConnection(){
    var conn;
    return MotorMysql.connect(defaultConnOpts).then(function(con) {
        conn = con;
        // esto por ahora no funciona si no existe la base de datos
        // tal vez haya que conectar inicialmente con mysql y luego borrar y crear la base
        return MotorMysql.prepare(con, "DROP DATABASE IF EXISTS "+defaultConnOpts.database);
    }).then(function(query) {
        return MotorMysql.query(query);
    }).then(function(query) {
        //console.log("prepareConnection", result);
        return MotorMysql.fetchAll(query);
    }).then(function(res) {
        return MotorMysql.prepare(conn, "CREATE DATABASE "+defaultConnOpts.database);
    }).then(function(prep) {
        return MotorMysql.query(prep);
    }).then(function(query) {
        return MotorMysql.fetchAll(query);
    }).then(function(res) {
    }).then(function() {
        MotorMysql.done(conn);
    });
}

var badConnOpts = {
  motor      :'test',
  host       : 'localhost', // si el localhost, no es necesario en sql-promise-tester (no hay look-up)
  user       : 'nodeja',
  password   : 'edonista',
  database   : 'nodeprumal'
};

tester(MotorMysql, {
    connOpts: defaultConnOpts, 
    badConnOpts: badConnOpts, 
    prepare:prepareConnection
});

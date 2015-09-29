"use strict";

var Promises = require('promise-plus');
var tester=require('sql-promise-tester');
var Path = require('path');
var winOS = Path.sep==='\\';
var _ = require('lodash');

var MotorMysql = require('..').Motor;

var defaultConnOpts = {
  motor      :'test',
  host       : 'localhost',
  user       : 'test_user',
  password   : 'test_pass',
  database   : 'test_db',
  port       : MotorMysql.defaultPort
};
if(! winOS) {
    defaultConnOpts['socketPath']= '/var/run/mysql/mysql.sock';
}

function prepareConnection(){
    var conn;
    var conOpts = _.clone(defaultConnOpts);
    // conectamos con esta base para poder hacer el drop database!!
    conOpts.database = 'information_schema';
    return MotorMysql.connect(conOpts).then(function(con) {
        conn = con;
        return MotorMysql.prepare(con, "DROP DATABASE IF EXISTS "+defaultConnOpts.database);
    }).then(function(query) {
        return MotorMysql.query(query);
    }).then(function(query) {
        return MotorMysql.fetchAll(query);
    }).then(function(res) {
        return MotorMysql.prepare(conn, "CREATE DATABASE "+defaultConnOpts.database);
    }).then(function(prep) {
        return MotorMysql.query(prep);
    }).then(function(query) {
        return MotorMysql.fetchAll(query);
    }).then(function(res) {
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

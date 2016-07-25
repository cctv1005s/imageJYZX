var mysql = require('./db');
var sql = "";


exports.getUserByName = function(username,callback){
    console.log('---------getUserByName---------');
    sql = "select * from user where username = ?";
    mysql.query(sql,[username],callback);
}

exports.insertUser = function(userInfo,callback){
    console.log('---------InsertUser---------');
    var user = [userInfo.username,userInfo.password,userInfo.name,userInfo.logindate,userInfo.onlinetime,userInfo.logintimes];
    sql = "insert into user (username,password,name,logindate,onlinetime,logintimes) values (?,?,?,?,?,?)";
    mysql.query(sql,user,callback);
}
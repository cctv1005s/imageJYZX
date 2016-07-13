var mysql = require('./db');
var sql = "";


exports.getUserByName = function(username,callback){
    console.log('---------getUserByName---------');
    sql = "select * from user where username = ?";
    mysql.query(sql,[username],callback);
}

var mysql = require('mysql');
var config = require('../config/dbconfig');

var connection = mysql.createConnection(config);

connection.connect();
connection.query('use imageJYZX',function(err,result){
});

 module.exports = connection; 
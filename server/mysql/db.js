var mysql = require('mysql');
var config = require('../config/dbconfig');



var connection =  mysql.createPool(config);

module.exports = connection; 
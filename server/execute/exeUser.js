var model = require('../model'),
    user_model = model.user;

var mysql = require('../mysql'),
    user_mysql = mysql.user

var _ =require('lodash');


/*
* -用来获取用户的个人信息的,
* -option{
*  username:,
*  password:,
*  jar:
* }
*/
exports.exeUserInfo = function(option,callback){
    //爬到学生的信息并将其存到数据库中
    user_model.synUser(option.jar,function(err,result){
        if(err){
            return callback(err);
        }
        result.username = option.username,
        result.password = option.password;
        
        user_mysql.insertUser(result,function(err,result){
            if(err){
                return callback(err);
            }
            return callback(null,result);
        });

    })
}
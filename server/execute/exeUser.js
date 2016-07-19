var model = require('../model'),
    user = model.user;


/**
* 将login封装如exeUser中，
* 输入值 option{username:,password:}
*/
exports.login = function(option,callback){
    return user.synLogin(option,callback);
}


/*
* -用来获取用户的个人信息的,
* -option{
*  username:,
*  password:,
*  jar   
* }
*/
exports.exeUserInfo = function(option,callback){
    
}
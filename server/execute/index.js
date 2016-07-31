var exeUser = require('./exeUser'),
    exeCourse = require('./exeCourse'),
    eventproxy = require('eventproxy');

/**
* 将一个用户的所有信息读取进入数据库
* 先登录，登录之后获取cookie,接着再获取用户信息
*/
/**
* option{
*   username:
*   password:
*   jar:    
* }
*/

exports.exeNewUser = function(option,callback){
    var ep = new eventproxy();

    exeUser.exeUserInfo(option,function(){});//获取用户的个人信息
    
    exeCourse.exeCourse(option,function(err,result){
        err?callback(err):callback(null,null);
    });    
    
}
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

    exeUser.exeUserInfo(option,ep.done('user'));//获取用户的个人信息

    ep.emit('tips',null);
    
    try{
    exeCourse.exeCourse(option,ep.done('course'));    
    }
    catch(e){
        console.log(e);
    }
    
    //对应数据库的表
    ep.all('user','tips','course',function(user,tips,course){
        return callback(null,null);
    });
    
    ep.fail(callback);
}
var exeUser = require('./exeUser'),
    eventproxy = require('eventproxy');

/**
* 将一个用户的所有信息读取进入数据库
* 先登录，登录之后获取cookie,接着再获取用户信息
*/
exports.exeNewUser = function(option,callback){
    var ep = new eventproxy();

    exeUser.login(option,function(err,result){
        if(err){
            //登录失败
            console.log(err);
            return callback(err);
        }
        else{
            exeUser.exeUserInfo(result,function(err,result){});//获取用户的个人信息
        }
    });
}
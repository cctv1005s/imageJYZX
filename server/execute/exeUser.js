var model = require('model'),
    user = model.user;
/*
用来获取用户的个人信息的
*/
exports.exeUser = function(option,callback){
    user.synLogin(option,function(err,result){
        
    });
}
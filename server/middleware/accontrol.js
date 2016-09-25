var User = require('../model/user')
exports.userRequire = function(req,res,next){
    if(req.session.user == null){
        return res.json("请先登录"); 
    }
 // overdue(req,res,next);
    next();
}

//过期处理,5分钟重登录一遍
var overdue = function(req,res,next){
    var user = req.session.user;
    var date = user.logindate,
        username = user.username,
        password = user.password;
    var option = {username:username,password:password};
    var now_time = new Date().getTime();

    if(now_time - date >= 5*60){
        //重登录，获取新的cookie
        User.synLogin(option,function(err,result){
            //重写登录jar和登录时间
            user.jar = result.jar;
            user.logindate = new Date().getTime();
        }); 
    }
    next();
}

exports.adminRequire = function(req,res,next){
    if(req.session.user.isAdmin == null){
        return res.json("不是管理员"); 
    }
    next();
}
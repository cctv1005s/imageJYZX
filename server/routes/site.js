var model = require('../model'),
    user = model.user;
exports.index = function(req,res,next){
    res.render('index',{
        // userinfo:userinfo
    });
}


//用户留言
exports.bookmark = function(req,res,next){
    res.render('bookmark');
}

//关于
exports.about = function(req,res,next){
    res.render('about');    
}
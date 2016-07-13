
exports.userRequire = function(req,res,next){
    if(req.session.user == null){
        return res.json("请先登录"); 
    }
    next();
}

exports.adminRequire = function(req,res,next){
    if(req.session.user.isAdmin == null){
        return res.json("不是管理员"); 
    }
    next();
}
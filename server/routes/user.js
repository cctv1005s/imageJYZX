var model = require('../model'),
    user = model.user;

exports.getUserinfo = function(req,res,next){
    var jar = req.session.user.jar,
        savecheck = req.session.user.savecheck;
    try{
    if(savecheck == 'true' ){
        user.user(req.session.user.username,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                    valid:false,
                    error:err
                });
            }
            res.json({
                valid:true,
                userinfo:result
            });
        });
    }
    else{
        user.synUser(jar,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                    valid:false,
                    error:err
                });
            }

            res.json({
                valid:true,
                userinfo:result
            });
        });
    }
    }
    catch(e){
        console.log(e);
    }
}

exports.getTips = function(req,res,next){
    try{
    var jar = req.session.user.jar;  
    user.synTips(jar,function(err,result){
        if(err){
            console.log(err);
            return res.json({
                valid:false,
                error:err
            });
        }
        res.json({
            valid:true,
            tips:result
        });
    });
    }
    catch(e){
        console.log(e);
    }
}

exports.view = function(req,res,next){
    res.render('course');
}


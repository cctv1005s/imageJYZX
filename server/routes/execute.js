var execute = require('../execute');

exports.newUser = function(req,res,next){
    var option = {
      username:req.body.username,
      password:req.body.password
    };
    excute.exeNewUser(option,function(err,result){
        if(err){
            res.json({
                valid:false,
                err:err
            });
        }   
        else{
            res.json({
                valid:true,
                result:result
            });
        }
    });
}
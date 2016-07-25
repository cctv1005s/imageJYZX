var execute = require('../execute');

exports.newUser = function(req,res,next){
    var option = req.session.user;
    try{
    execute.exeNewUser(option,function(err,result){
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
    catch(e){
        console.log(e);
    }
}
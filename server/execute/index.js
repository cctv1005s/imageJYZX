var exeUser = require('exeUser');

exports.exeNewUser = function(option,callback){
    exeUser.login(option,function(err,result){
        if(err){
            console.log(err);
            return callback(err);
        }
        else{
            
        }
    });
}
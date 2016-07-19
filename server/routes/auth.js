var model = require('../model')
    user = model.user;

var eventproxy = require('eventproxy'),
    ep = new eventproxy();

var execute = require('../execute');

exports.login = function(req,res,next){
    res.render('login');
}

exports.postLogin = function(req,res,next){
    var option = {
      username:req.body.username,
      password:req.body.password
    };
    var ep = new eventproxy();
   //保存密码模式
   if(req.body.savecheck == 'true' ){
      user.login(option,function(err,result){
          if(err){
            if(err == '数据库中找不到'){
            return res.json({valid:false,err:err});
            }
            if(err == '账号或密码不正确')
            return res.json({valid:false,err:err});
          }
          else{            
            // req.session.user = {
            //   username:result.username,
            //   cookie:result.cookie,
            //   savecheck:req.body.savecheck
            // };
            //这里还得在讨论
            return res.json({valid:true});
          }      
      });
   }
   else{
      //获取cookie
      try{
      user.synLogin(option,function(err,result){
          if(err){
            console.log(err);
            return res.json({valid:false,err:err});
          }
          else{     
            req.session.user = {
              username:result.username,
              password:result.password,
              jar:result.jar,
              savecheck:req.body.savecheck
            };
            return res.json({valid:true});
          }
      });
      }
      catch(e){
        console.log(e);
      }
   }
}
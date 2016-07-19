var request = require('request'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    tools = require('./tools');

var mysql = require('../mysql'),
    User = mysql.user;//

var indexurl = "http://222.30.60.9/meol/homepage/common/";

'use strict'

//返回用户名和cookiejar()
/*
@params option object
@params option.username
@params option.password
*/

exports.synLogin = function(option,callback){
    var jar = request.jar();
    var myrequest = request.defaults({jar:jar});
    myrequest(indexurl,function(err,req,body){
        //读取logintoken
        try{
          var $ = cheerio.load(body);
          var logintoken = $('[name=\"logintoken\"]').val();
        }
        catch(e){
            console.log(e);
            return callback(e);
        }
        //发送表单
        myrequest.post('http://222.30.60.9/meol/homepage/common/login.jsp',function(err,req,body){
            if(body.match('alert')){
                return callback('用户名或密码不正确');
            }
            return callback(null,{
                    username:option.username,
                    password:option.password,
                    jar:jar
                    }
                    );
        }).form({
            'logintoken':logintoken,
            'IPT_LOGINUSERNAME':option.username,
            'IPT_LOGINPASSWORD':option.password
        })
    });
}

exports.login = function(option,callback){
    User.getUserByName(option.username,function(err,result){
        if(err){
            return callback(err);
        }
        if(result.length == 0){
            return callback("数据库中找不到");
        }
        var password = result[0].password;
        if(password == option.password){
            return callback(null,{username:option.username,cookie:null});
        }
        else{
            return callback('账号或密码不正确');
        }
    });
}

/*
获取用户的信息
输入，用户的cookie
输出，用户的信息
    --例如：
    姓名：杨立
    登录时间：2016-06-19 00:18
    在线总时长： 204小时40分
    登录次数：308
*/
exports.synUser = function(jar,callback){
    var request = tools.getMyrequest(jar);
    request('http://222.30.60.9/meol/welcomepage/student/index.jsp',{encoding: "binary"},function(err,req,body){
        //转换为gbk编码
        var body = iconv.decode(new Buffer(body, 'binary'),'gbk');
        var $ = cheerio.load(body),
            userinfo = $('.userinfobody ul li');
        var student = {
            name:$(userinfo[0]).text(),
            logindate:$(userinfo[1]).text(),
            onlinetime:$(userinfo[2]).text(),
            logintimes:$(userinfo[3]).text()
        }
        return callback(null,student);
    });
}

exports.user = function(username,callback){
    User.getUserByName(username,function(err,result){
        if(err){
            callback(err);
        }
        result = result[0];
        var student = {
            name:result.name,
            logindate:result.logindate,
            onlinetime:result.onlinetime,
            logintimes:result.logintimes
        }
        return callback(null,student); 
    });
}


exports.synTips = function(jar,callback){
    var request = tools.getMyrequest(jar);
    var tipurl = 'http://222.30.60.9/meol/welcomepage/student/interaction_reminder.jsp';
    request(tipurl,{encoding: "binary"},function(err,req,body){
        if(err){console.log(err);return callback(err);}
        var body = tools.getGBK(body),
            tips = [];
        try{
        var $ = tools.load(body);
        //抓取未读消息的内容
        $('#reminder>li ul li').each(function(index,el){
            var tipItem = {};
            tipItem.content = $(el).text();
            tipItem.courseId = tools.getCourseId($(el).find('a').attr('href'));
            tips.push(tipItem);
        });
        return callback(null,tips);
        }  
        catch(e){
            console.log(e);
        }
    })
}


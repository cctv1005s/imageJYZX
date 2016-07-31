var mysql = require('./db');
var sql = "";
var fs = require('fs');
    eventproxy = require('eventproxy'),
    path = require('path');
/**
* 获取某一个学生选到的课的课程列表
*/
exports.getCourseList = function(username,callback){
    console.log("------getCourseList------");
    sql = "select * from usercourseview where username = ?";
    mysql.query(sql,[username],callback);
}

/**
*获取某一个门课的具体信息
*/
exports.getCourse = function(courseId,callback){
    console.log("------getCourse------");
    sql = "select * from course where id = ?";
    mysql.query(sql,[courseId],function(err,result){
        result[0].profile = fs.readFileSync(result[0].profile,'utf-8');
        result[0].courseintro = fs.readFileSync(result[0].courseintro,'utf-8');
        result[0].coursesylla = fs.readFileSync(result[0].coursesylla,'utf-8');
        return callback(err,result);
    });
}

/**
* 根据courseId选出这门课的所有作业
*/
exports.getCourseTask = function(courseId,callback){
    console.log("------getCourseTask------");
    sql = "select * from task where courseid = ?";
    mysql.query(sql,[courseId],callback);
}

/**
* 根据taskId选出这个课的信息
*/
exports.getTask = function(taskId,callback){
    console.log("------getTask----");
    sql = "selct * from task where taskid = ?";
    mysql.query(sql,[taskId],callback);
}


/**
* 根据courseId选出这一门的所有通知
*/
exports.getCourseNotice = function(courseId,callback){
    console.log("------getNotice------");
    sql = "select * from notice where courseId = ?";
    mysql.query(sql,[courseId],callback);
}

//在数据库中插入一行课程的基本信息
exports.insertBaseInfo = function(option,callback){
    console.log("------insertBaseInfo------");
    ep = new eventproxy();

    sql = "select * from course where id = "+option.id;
    
    mysql.query(sql,function(err,result){
        if(result && result.length == 0){
            //将老师个人介绍存成html
            saveAsFile(option.profile,'profile',ep.done('profile'));
            saveAsFile(option.courseintro,'courseintro',ep.done('courseintro'));
            saveAsFile(option.coursesylla,'coursesylla',ep.done('coursesylla'));

            ep.all('profile','courseintro','coursesylla',function(profile,courseintro,coursesylla){
                var baseInfo = [option.id,option.coursename,option.college,option.teacher,option.image,option.email,option.url,profile,courseintro,coursesylla];

                sql = "insert into course (id,coursename,college,teacher,image,email,url,profile,courseintro,coursesylla) values (?,?,?,?,?,?,?,?,?,?)";
                mysql.query(sql,baseInfo,callback);
            });
            ep.fail(callback);
        }
        else{
            return callback(null,null);
        }
    });
}

exports.insertNews = function(option,callback){
    var news = [];
    sql = "insert into notice (noticeid,publishtime,title,content,courseid) values (?,?,?,?,?)";
    mysql.query(sql,news,callback);
}


exports.insertTask = function(option,callback){
    console.log("-------insertTask------");
    saveAsFile(option.content,function(err,filename){
        if(err){
            console.log(err);
            return callback(err);
        }
        else{
            var task = [option.taskid,
                        option.courseid,
                        option.title,
                        option.publishtime,
                        option.deadline,
                        option.method,
                        filename
                       ];
            sql = "insert into task (taskid,courseid,title,publishtime,deadline,method,content) values (?,?,?,?,?,?,?)";
            mysql.query(sql,task,function(err,result){
                if(err)
                    console.log(err);

                return callback(err,result);
            });         
        }
    });
}

exports.insertAnswer = function(option,callback){
    console.log("-------insertAnswer------");
    saveAsFile(option.answer,function(err,filename){
        if(err){
            console.log(err);
            return callback(err);
        }
        else{
            var answer = [
                        option.taskid,
                        option.username,
                        filename,
                        option.result,
                        option.comment,
                        option.score
                       ];
            console.log('i am taskid',option.taskid);
            sql = "insert into answer (taskid,username,answer,result,comment,score) values (?,?,?,?,?,?)"
            mysql.query(sql,answer,function(err,result){
                if(err)
                    console.log(err);

                return callback(err,result);
            });         
        }
    });
}




exports.newLink = function(username,courseId){
    console.log("------newLink------");
    link = [username,courseId];
    sql = "insert into usercourse (username,courseid) values (?,?)";
    mysql.query(sql,link,function(err,result){
        if(err){
            console.log('出错的课程的ID是:',courseId);
            console.log(err);
        }
    });
} 


var saveAsFile = function(data,type,callback){
    if(typeof type == 'function'){
        callback = type;
        type = "";
    }

    var filename = path.join(__dirname+"/files/",type + new Date().getTime() + ".html");
    fs.writeFile(filename,data,function(err,result){
        if(err){
            return callback(err);
        }
        else{
            return callback(null,filename)
        }
    });
}









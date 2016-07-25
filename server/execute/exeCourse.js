var model = require('../model'),
    course_model = model.course;

var mysql = require('../mysql'),
    course_mysql = mysql.course;

var eventproxy = require('eventproxy');
var _ = require('lodash');

/**
* option{
*  username:
*  password:
*  jar:
*  savecheck:   
* }
*/

/**
先获取课程列表，获取课程列表之后再根据课程id，用一个for循环读取所有的课程的课程介绍，教师信息，教学大纲，课程作业，教学资源，最新动态
*/

exports.exeCourse = function(option,callback){
    course_model.synCourseList(option.jar,function(err,result){
        if(err){
            return callback(err);
        }
        else{
            //遍历
            var courseList = result;
            
            for(var i = 0;i < courseList.length;i++){
                var ep = new eventproxy();
                //抓取课程的基本信息
                getBaseInfo(courseList[i],option.jar,function(err,result){
                    if(err){
                        console.log(err);
                        return ;
                    }
                    course_mysql.insertBaseInfo(result,function(err,result){
                        ep.emit('insertBaseInfo');                  
                    });
                });

                //抓取课程的最新通知
                //courseNews先搁置

                //抓取课程的课程作业
                course_model.synOneTask(courseList[i].id,option.jar,function(err,result){
                    //存作业内容
                    var rtask = result.task,
                        ranswer = result.answer;

                    var task = {
                        taskid:rtask.taskid,
                        courseid:rtask.courseid,
                        title:rtask.title,
                        publisher:rtask.publisher,
                        deadline:rtask.deadline,
                        method:rtask.method,
                        content:rtask.content
                    }
                    course_mysql.insertTask(task,ep.done('task'));
                    var answer = {
                        taskid:rtask.taskid,
                        username:option.username,
                        answer:ranswer.answer,
                        result:ranswer.result,
                        comment:ranswer.comment,
                        score:ranswer.score
                    }
                    //存答案内容
                    course_mysql.insertAnswer(answer,ep.done('answer'));
                });

                //抓取课程的课程答案

                //抓取课程的教学资源
            }

            ep.after('insertBaseInfo',courseList.length,function(data){
                for(var i = 0;i < courseList.length;i++){
                    course_mysql.newLink(option.username,courseList[i].id);
                }
                ep.emit('get_baseInfo',{});
            });

            ep.after('task',courseList.length,function(data){
                ep.emit('get_task',{});
            });

            ep.after('answer',courseList.length,function(data){
                ep.emit('get_answer',{});
            });

            ep.all('get_baseInfo','get_task','get_answer',function(a,b,c){
                callback(null,{});
            });
        }
    });
}


//option这里是就是courseInfo
var getBaseInfo = function(option,jar,callback){
    var ep = new eventproxy();
    var courseId = option.id;
    course_model.synTeacherInfo(courseId,jar,ep.done('teacher'));//抓取教师信息
    course_model.synCourseIntro(courseId,jar,ep.done('courseintro'));//抓取课程介绍
    course_model.synCourseSylla(courseId,jar,ep.done('coursesylla'));//抓取课程大纲
    ep.all('teacher','courseintro','coursesylla',function(teacher,courseintro,coursesylla){
        _.extend(option,{
            image : teacher.image,
            email : teacher.email,
            url : teacher.url,
            profile : teacher.profile||"",
            courseintro : courseintro.courseCont,
            coursesylla : coursesylla.courseSylla    
        });    
        return callback(null,option);
    });
    ep.fail(callback);
}

exports.exeCourseNews = function(option,callback){


}
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
    //就算错误了也没有办法避免，不如就不返回错误好了
    course_model.synCourseList(option.jar,function(err,result){
        if(err){
            return callback(err);
        }

        //遍历
        var courseList = result;
        var ep = new eventproxy();
        
        for(var i = 0;i < courseList.length;i++){
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

            //抓取课程作业
            getTask(courseList[i].id,option.jar);
            //下载这门课的所有课程作业

        }

        ep.after('insertBaseInfo',courseList.length,function(data){
            for(var i = 0;i < courseList.length;i++){
                course_mysql.newLink(option.username,courseList[i].id);
            }
            callback(null,{});
        });

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


var getTask = function(courseid,jar){
//抓取课程的最新通知
//courseNews先搁置
course_model.synCourseNews(courseid,jar,function(err,CourseNews){

    for(var j = 0;j < CourseNews.length;j++){
        if(CourseNews[j].newsType == '作业'){
            // //抓取课程的课程作业
            var courseId = CourseNews[j].courseId;
            course_model.synOneTask(CourseNews[j].contId,jar,function(err,result){
                //存作业内容
                var rtask = result.task,
                    ranswer = result.answer;

                var task = {
                    taskid:rtask.taskid,
                    courseid:courseId,
                    title:rtask.title,
                    publisher:rtask.publisher,
                    deadline:rtask.deadline,
                    method:rtask.method,
                    content:rtask.content
                }

                //在数据库中插入课程
                course_mysql.insertTask(task,function(err,result){
                    if(err){
                        console.log(err);
                    }
                    else{

                    //插入之后还要下载附件里面的文件并且修改内容

                        var answer = {
                            taskid:rtask.taskid,
                            username:option.username,
                            answer:ranswer.answer,
                            result:ranswer.result,
                            comment:ranswer.comment,
                            score:ranswer.score
                        }

                        course_mysql.insertAnswer(answer,function(err,result){
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                });
            });
        }
    }
});

}
var model = require('../model'),
    course = model.course,
    user = model.user;

//获取课程列表
exports.getCourse = function(req,res,next){
    
    var jar = req.session.user.jar,
        savecheck = req.session.user.savecheck,
        username = req.session.user.username,
        password = req.session.user.password;

    

    if(savecheck == 'true'){
        course.courseList(username,function(err,result){
           if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                        });
            }
            res.json({
                valid:true,
                courselist:result
                }
                ); 
        });
    }
    else{
        course.synCourseList(jar,function(err,result){
            if(err){
                console.log(err);
                if(err == "页面访问出错"){
                    //在访问一遍
                }
                return res.json({
                        valid:false,
                        error:err
                        });
            }
            res.json({
                valid:true,
                courselist:result
                }
                );
        });
    }
}


exports.getCourseIntro = function(req,res,next){
    var courseId = req.query.courseid,
        savecheck = req.session.user.savecheck,
        jar = req.session.user.jar;

    if(savecheck == 'true'){
        course.courseIntro(courseId,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                courseIntro:result
            });
        });
    }
    else{
        course.synCourseIntro(courseId,jar,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                courseIntro:result
            });
        });
    }
}


exports.getTeacherInfo = function(req,res,next){
    var courseId = req.query.courseid,
        savecheck = req.session.user.savecheck,
        jar = req.session.user.jar;
    if(savecheck == 'true'){
        course.teacherInfo(courseId,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                teacherInfo:result
            });
        });
    }
    else{
        course.synTeacherInfo(courseId,jar,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                teacherInfo:result
            });
        });   
    }
}

/**
* 获取教学大纲
*/
exports.getCourseSylla = function(req,res,next){
    var courseId = req.query.courseid,
        savecheck = req.session.user.savecheck,
        jar = req.session.user.jar;   

    if(savecheck == 'true'){
        course.courseSylla(courseId,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                courseSylla:result
            });
        });
    }
    else{
        try{
        course.synCourseSylla(courseId,jar,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                courseSylla:result
            });
        });
        }
        catch(e){
            console.log(e);
        }
    }
}


/**
* 获取最新动态
*/
exports.getCourseNews = function(req,res,next){
    var courseId = req.query.courseid,
        savecheck = req.session.user.savecheck,
        jar = req.session.user.jar;   

    if(savecheck == 'true'){
        course.courseNews(courseId,function(err,result){
            if(err){
                console.log("i have a error");
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }

            res.json({
                valid:true,
                courseNews:result
            });

        });
    }
    else{
        course.synCourseNews(courseId,jar,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                courseNews:result
            });
        });
    }
}



exports.getCourseTask = function(req,res,next){
    var courseId = req.query.courseid,
        savecheck = req.session.user.savecheck,
        jar = req.session.user.jar;   

    if(savecheck == 'true'){
        course.courseTask(courseId,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                courseTask:result
            });
        });
    }
    else{
        try{
        course.synCourseTask(courseId,jar,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                courseTask:result
            });
        });
        }
        catch(e){
            console.log(e);
        }
    }
}

exports.getOneTask = function(req,res,next){
    var taskId = req.query.taskid,
        savecheck = req.session.user.savecheck,
        jar = req.session.user.jar;   

    if(savecheck == 'true'){
        course.oneTask(taskId,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                taskInfo:result
            });
        });
    }
    else{
        try{
        course.synOneTask(taskId,jar,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                taskInfo:result
            });
        });
        }
        catch(e){
            console.log(e);
        }
    }
}


exports.getCourseFolder = function(req,res,next){
    var folderId = req.query.folderid,
        courseId = req.query.courseid,
        savecheck = req.session.user.savecheck,
        jar = req.session.user.jar;   

    if(savecheck == 'true'){
        course.courseFolder({folderId:folderId,courseId:courseId},function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                folderInfo:result
            });
        });
    }
    else{
        try{
        course.synCourseFolder({folderId:folderId,courseId:courseId},jar,function(err,result){
            if(err){
                console.log(err);
                return res.json({
                        valid:false,
                        error:err
                       });
            }
            res.json({
                valid:true,
                folderInfo:result
            });
        });
        }
        catch(e){
            console.log(e);
        }
    }   
}

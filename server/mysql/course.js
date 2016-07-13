var mysql = require('./db');
var sql = "";
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
    mysql.query(sql,[courseId],callback);
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








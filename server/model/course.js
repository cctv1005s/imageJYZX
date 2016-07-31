var request = require('request'),
    tools = require('./tools'),
    util = require('util'),
    eventproxy = require('eventproxy');

var ep = new eventproxy(),
    url = require('url'),
    qs = require('querystring');

var mysql = require('../mysql'),
    Course = mysql.course;//

var fs = require('fs');
var _ = require('lodash');

/**
 * 根据cookie获取课程列表
 * Callback:
 * - err, 数据库异常
 * - result, 课程列表:
 * -- coursename, 课程名字
 * -- id, 课程id
 * -- college, 课程所属学院
 * -- teacher, 上课老师
 * @param {Object} cookie 用户的cookie
 * @param {Function} callback 回调函数
 */
exports.synCourseList = function(jar,callback){
    var listurl = "http://222.30.60.9/meol/lesson/blen.student.lesson.list.jsp";
    var request = tools.getMyrequest(jar);
    request(listurl,{encoding: "binary"},function(err,req,body){
        //转换为gbk编码
        if(err){
            console.log(err);
        }
        //判断返回的是不是202并且判断返回的内容是不是有课程列表
        var body = tools.getGBK(body);
        //发现不是课程列表的界面，说明访问出错    
        if(!body.match('课程列表')){
            return callback('页面访问出错');
        }
        //载入body
        var $ = tools.load(body);
        //保存课程的信息
        var courselist = [];
        $('.valuelist tr').each(function(index, el) {
            //第0个是表头
            if(index != 0){
                var item = $(el).find('td');
                var courseitem = {};
                item.each(function(indexx,ell){
                    switch(indexx){
                        case 0:
                        courseitem.coursename = $(ell).text();//课程的名字
                        courseitem.id = tools.getCourseId(($(ell).find('a')).attr('href'));
                        break;
                        case 1:
                        courseitem.college = $(ell).text();
                        break;
                        case 2:
                        courseitem.teacher = $(ell).text();
                        break;
                    };
                });
                courselist.push(courseitem);
            }
        });

        //消除重复，比较坑爹，用_.uniq来消除id不行
        var list = [];
        for(var i = 0;i < courselist.length ;i++ ){
            if(list.length == 0){
                list.push(courselist[i]);
            }
            var found = 0;
            for(var j = 0;j < list.length ;j ++){
                if(list[j].id == courselist[i].id){
                    found = 1;
                    break;
                }
            }
            if(found == 0)
                list.push(courselist[i]);
        }
        //消除重复结束
        return callback(null,list);
    });
}

exports.courseList = function(username,callback){
    if(!username){
        return callback('用户名无效');
    }
    Course.getCourseList(username,callback);
}


/**
* 获取课程的介绍
*/
exports.synCourseIntro = function(courseId,jar,callback){
    
    var listurl = util.format("http://222.30.60.9/meol/lesson/coursesum.jsp?tagbug=client&lid=%s",courseId);
    var request = tools.getMyrequest(jar);
    request(listurl,{encoding: "binary"},function(err,req,body){
        //转换为gbk编码
        if(err){
            console.log(err);
        }
        
        var body = tools.getGBK(body);
        //发现不是课程列表的界面，说明访问出错  
        try{
        var $ = tools.load(body);
        var courseName = $('.title').text(),
            courseCont = $('input').val()||""
        }
        catch(e){
            callback(e);
        }
        
        return callback(null,{ 
                        courseName:courseName,
                        courseCont:courseCont
                        });
    });
}


exports.courseIntro = function(courseId,callback){
    Course.getCourse(courseId,function(err,result){
        if(err){
            return callback(err);
        }
        callback(null,{
                 courseName:result[0].coursename,
                 courseCont:result[0].courseintro
                });
    })
}

/**
 * 根据cookie获取课程列表
 * Callback:
 * - err, 数据库异常
 * - result, 教师信息:
 * -- name, 教师名字
 * -- image, 教师头像
 * -- email, 教师邮箱
 * -- url, 教师地址
 * -- profile, 教师个人介绍
 * @param {Object} cookie 用户的cookie
 * @param {Function} callback 回调函数
 */

exports.synTeacherInfo = function(courseId,jar,callback){
    var listurl = util.format("http://222.30.60.9/meol/lesson/teacher_info.jsp?tagbug=client&lid=%s&strStyle=new06",courseId);
    var request = tools.getMyrequest(jar);
    request(listurl,{encoding: "binary"},function(err,req,body){
        //转换为gbk编码
        if(err){
            console.log(err);
        }
        
        var body = tools.getGBK(body);
        //发现不是教师信息的界面，说明访问出错
        try{
        var $ = tools.load(body),
            infoItem = $('.infotable tr');
        var teacherInfo = {
            name : $(infoItem[1]).find('td').text(),
            image : "http://222.30.60.9" + $(infoItem[2]).find('td img').attr('src'),
            email : $(infoItem[3]).find('td').text(),
            url : $(infoItem[4]).find('td').text(),
            profile : $(infoItem[5]).find('td input').val()
            }
        }
        catch(e){
            callback(e);
        }
        return callback(null,teacherInfo);
    });   
}

exports.teacherInfo = function(courseId,callback){
    Course.getCourse(courseId,function(err,result){
        if(err){
            return callback(err);
        }
        callback(null,{
                 name : result[0].teacher,
                 image : result[0].image,
                 email : result[0].email,
                 url : result[0].url,
                 profile : result[0].profile
                });
    });
}

/**
 * 根据cookie获取教学大纲
 * Callback:
 * - err, 数据库异常
 * - result, 教师信息:
 * -- courseName,课程名字
 * -- courseSylla,课程大纲
 * @param {Object} cookie 用户的cookie
 * @param {Function} callback 回调函数
 */

 exports.synCourseSylla = function(courseId,jar,callback){
    var listurl = util.format("http://222.30.60.9/meol/lesson/extrasum1.jsp?tagbug=client&lid=%s&strStyle=new06",courseId);
    var request = tools.getMyrequest(jar);
    request(listurl,{encoding: "binary"},function(err,req,body){
        //转换为gbk编码
        if(err){
            console.log(err);
        }
        
        var body = tools.getGBK(body);
        try{
        var $ = tools.load(body),
            courseSylla = {
                courseName:$('.title').text(),
                courseSylla:$('.text input').val()||""
            };
        }
        catch(e){
            callback(e);
        }
        return callback(null,courseSylla);
    });
 }

exports.courseSylla = function(courseId,callback){
    Course.getCourse(courseId,function(err,result){
        if(err){
            return callback(err);
        }
        callback(null,{
                 courseName:result[0].coursename,
                 courseSylla : result[0].coursesylla
                });
    });
}

/**
获取最新动态
返回的result的值是
newsCont:消息内容
newsType:消息类别（是作业还是通知公告）
contId:对应消息的id
*/
exports.synCourseNews = function(courseId,jar,callback){
    var listurl = util.format("http://222.30.60.9/meol/jpk/course/layout/newpage/default_demonstrate.jsp?courseId=%s",courseId);

    var request = tools.getMyrequest(jar);
    request(listurl,{encoding: "binary"},function(err,req,body){
        //转换为gbk编码
        if(err){
            console.log(err);
            return callback(e);
        }

        var body = tools.getGBK(body);
        try{
            var $ = tools.load(body),
                newsList = [];

            $('.body2 li').each(function(index,el){
                 var newsItem = {};
                 newsItem.newsCont = $(el).text(),
                 newsItem.newsType = $(el).text().match('新的作业')?'作业':'通知',
                 newsItem.contId = tools.getCourseId($(($(el).find('a'))[1]).attr('href')),
                 newsItem.courseId = courseId;
                 newsList.push(newsItem);
            })
            
            callback(null,newsList);
        }
        catch(e){
            callback(e);
        }
    });
}

exports.courseNews = function(courseId,callback){
    Course.getCourseTask(courseId,function(err,task){
        if(err){
            console.log(err);
            return callback(err);
        }
        var newsList = [];
        for(var i = 0;i < task.length;i++){
            var newsItem={
                contId:task[i].taskid,
                newsCont:task[i].title,
                newsType:"作业"
            }
            newsList.push(newsItem);
        }
        callback(null,newsList);
    });

    // Course.getCourseNotice(courseId,function(err,result){
    //     if(err){
    //         console.log(err);
    //         return callback("选取课程作业出错");
    //     }
    //     ep.emit('notice',result); 
    // });
    
    // ep.all('task','notice',function(task,notice){
        
    //     var newsList = [];
    //     for(var i = 0;i < task.length;i++){
    //         var newsItem={
    //             contId:task[i].taskid,
    //             newsCont:task[i].title,
    //             newsType:"作业"
    //         }
    //         newsList.push(newsItem);
    //     }

    //     for(var i = 0;i < notice.length;i++){
    //         var newsItem={
    //             contId:notice[i].noticeid,
    //             newsCont:notice[i].title,
    //             newsType:"通知"
    //         }
    //         newsList.push(newsItem);
    //     }
    //       callback(null,newsList);
    // });
    
}


/**
* 获取作业列表
* 最坑的地方就是这里，如果看我源码的同学看到了这里，就必须要吐槽一下，如果你想抓取课程列表的话，实际上
* 你访问的那个地址，需要先post一个id,表明你访问了哪一个页面，但是你要提交那个id，它的那个地址是加密的
* 当然也有可能不是加密的，但反正是要生成的，谁他妈有空去看你怎么生成，怎么在后端注册的呀！然后在作业列
* 表里面的url不带参数，不带学生id的参数，虽然你这样更安全了，诶，不对，更安全你个屁啊！不吐槽了，先写
* 码吧,总之最后是采用了曲线救国的办法——2016年7月5日00:26:45 杨立
*/

/**
* 数据结构是
*/


/**
* 这里要做的是把课程的信息给选出来不包括答案内容？
* 这里要读取的是这一门作业的所有内容，这一个用户的所有内容
*/
/**
* 返回的内容要求的是把所有的内容都给放进去
* -callback返回内容
*   标题-title
*   发布时间-publishtime
*   
*/
exports.synOneTask = function(taskId,jar,callback){
    var answerUrl = util.format("http://222.30.60.9/meol/common/hw/student/taskanswer.jsp?hwtid=%s",taskId),
        taskUrl = util.format("http://222.30.60.9/meol/common/hw/student/hwtask.view.jsp?hwtid=%s",taskId),
        baseUrl = "http://222.30.60.9/";
    
    var myep = new eventproxy();
    
    var request = tools.getMyrequest(jar);
    
    request(taskUrl,{encoding: "binary"},function(err,req,body){
        var body = tools.getGBK(body),
            $ = tools.load(body);
        var content = $('input').val();
        
        $(content).find('a').each(function(index,el){
            var href =   $(el).attr('href');
            content = content.replace(href,baseUrl+href);
        });

        var taskItem = {
            taskid:taskId,
            title:$($('td')[0]).text(),
            publishtime:$($('td')[1]).text(),
            deadline:$($('td')[2]).text(),
            method:$($('td')[3]).text(),
            content:content
        }
        myep.emit('task',taskItem);
    });
    
    request(answerUrl,{encoding: "binary"},function(err,req,body){
        var body = tools.getGBK(body),
            $ = tools.load(body);
        var answerItem = {
            score:$($('td')[3]).text(),
            answer:$($('input')[1]).val(),
            result:$($('td')[6]).text(),
            comment:$($('td')[7]).text()
        };
        myep.emit('answer',answerItem);
    });

    myep.all('task','answer',function(task,answer){
        callback(null,{task:task,answer:answer});
    });
}

// exports.oneTask = function(taskId,)

/**
* 抓取一个文件夹下面的东西，把这个文件夹下面的类封装起来，然后传到气短
* callback(err,result)
* -err 错误类型
* -result Array 保存这个文件夹下面的文件类型
* --两种文件类型
* {
*   fileId:
*   courseId:
*   fileType:'file'|'folder'
*   title:
*   visitTimes:
*   downloadTimes:
*   resourceType:
*   href:
*   beforeId:  
* }
*/

exports.synCourseFolder = function(option,jar,callback){
    var folderUrl = util.format("http://222.30.60.9/meol/common/script/listview.jsp?groupid=4&lid=%s&folderid=%s",option.courseId,option.folderId),
        baseUrl = "http://222.30.60.9/meol/common/script/";
    var request = tools.getMyrequest(jar);
    
    var folderList = [];//保存这个folder下面的所有文件信息
    request(folderUrl,{encoding: "binary"},function(err,req,body){
        var $ = tools.load(tools.getGBK(body)),
            itemLength = $('tr').length - 1;

        for(var i = 1;i < itemLength+1;i++){
           try{
           var itemHref = $($($('tr')[i]).find('td a')[0]).attr('href');
           var query = qs.parse(url.parse(itemHref).query);
           }
           catch(e){
            
            console.log(e);
           }

           if(itemHref.match('folderid')){
            //如果是文件夹的话
                var folderItem = {
                fileId:query.folderid||null,
                courseId:option.courseId,
                fileType:'folder',
                title:$($($('tr')[i]).find('td a')[0]).text(),
                visitTimes:null,
                downloadTimes:null,
                resourceType:null,
                href:baseUrl + itemHref,
                beforeId:option.folderId
                }
                folderList.push(folderItem);
           }
           else if(itemHref.match('fileid')){
            //如果是文件的话
                var tdItem = $($('tr')[i]).find('td');
                var fileHref = util.format("http://222.30.60.9/meol/common/script/download.jsp?fileid=%s&resid=%s&lid=%s",query.fileid,query.resid,option.courseId); 

                var fileItem = {
                fileId:query.fileid||null,
                courseId:option.courseId,
                fileType:'file',
                title:$(tdItem[0]).text(),
                visitTimes:$(tdItem[1]).text(),
                downloadTimes:$(tdItem[2]).text(),
                resourceType:$(tdItem[3]).text(),
                href:fileHref,
                beforeId:option.courseId
                }
                folderList.push(fileItem);
           }
           else{
                return callback("url分析错误");
           }
        }
        return callback(null,folderList);
    });
}
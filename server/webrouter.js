var express = require('express');
var router = express.Router();
var site = require('./routes/site'),
    auth = require('./routes/auth'),
    course = require('./routes/course'),
    user = require('./routes/user'),
    execute = require('./routes/execute');


var middleware = require('./middleware'),
    accontrol =  middleware.accontrol//权限控制的插件

/* GET home page. */
router.get('/',site.index);


/*登录*/
router.get('/login',auth.login);
router.post('/login',auth.postLogin);

/*课程信息*/
router.get('/course',accontrol.userRequire,course.getCourse);//获取课程列表
router.get('/courseintro',accontrol.userRequire,course.getCourseIntro);//获取课程简介
router.get('/teacherinfo',accontrol.userRequire,course.getTeacherInfo);//获取上课老师的个人信息
router.get('/coursesylla',accontrol.userRequire,course.getCourseSylla);//获取教学大纲
router.get('/coursenews',accontrol.userRequire,course.getCourseNews);//抓取最新动态
router.get('/coursetask',accontrol.userRequire,course.getCourseTask);//抓取课程作业列表
router.get('/onetask',accontrol.userRequire,course.getOneTask);//抓取课程详情
router.get('/coursefolder',accontrol.userRequire,course.getCourseFolder);//抓取课程文件夹


/*获取用户信息*/
router.get('/user',accontrol.userRequire,user.getUserinfo);
/*获取用户的未读消息*/
router.get('/tips',accontrol.userRequire,user.getTips);

router.get('/view',user.view);

//留言
router.get('/bookmark',site.bookmark);

//关于
router.get('/about',site.about);


//execute
router.post('/exenewuser',execute.newUser);//在数据库中新建一个用户

module.exports = router;
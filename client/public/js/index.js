var getHomeworkUrl = function(html){
    $('.teacherinfo').find('a').each(function(index,el){
        var href = $(el).attr('href');
        var filename = $(el).text();
        
        href = '/homework?homeworkurl='+encodeURIComponent(href)
               +'&filename='+encodeURIComponent(filename);
        $(el).attr('href',href);
        $(el).attr('target','_blank');
    });
}


var getResourceUrl = function(html){
    $('.file a').each(function(index,el){
        var href = $(el).attr('href');
        href = '/resource?resourceurl='+encodeURIComponent(href);
        $(el).attr('href',href);
        $(el).attr('target','_blank');
    });
}

var Folder = React.createClass({
    getInitialState:function(){
        return {
            fileList:[],
            folderId:0//任何课程的初始id都是0
        }
    }
    ,
    componentWillReceiveProps:function(){
        var courseId = $('.course-list .active').attr('data-id'),
            folderId = 0,
            self = this;
        
        $.get("/coursefolder?courseid="+courseId+"&folderid="+folderId,function(result){
            if(result.valid == true){
                self.setState({
                    fileList:result.folderInfo
                });
            }
            else{
                //报错
            }
        });       
    }
    ,
    componentDidMount:function(){
        //初始化组件
        var courseId = this.props.courseId,
            folderId = this.state.folderId,
            self = this;
        $.get("/coursefolder?courseid="+courseId+"&folderid="+folderId,function(result){
            
            if(result.valid == true){
                self.setState({
                    fileList:result.folderInfo
                });
            }
            else{
                //报错
            }
        });
    }
    ,
    onFolder:function(e){
        var courseId = this.props.courseId,
            folderId = $(e.currentTarget).attr('data-id');
            self = this;
        $.get("/coursefolder?courseid="+courseId+"&folderid="+folderId,function(result){
            if(result.valid == true){
                self.setState({
                    fileList:result.folderInfo
                });
            }
            else{
                //报错
            }
        });
    }
    ,
    componentDidUpdate:function(){
        getResourceUrl();
    }
    ,
    render:function(){
        var view = [],
            fileList = this.state.fileList;

        for(var i = 0 ;i < fileList.length;i++){
            switch(fileList[i].fileType){
                case 'folder':
                view.push(
    <tr>
        <td onClick={this.onFolder} data-id={fileList[i].fileId}><span><i className="fa fa-folder-o file-icon"></i>{fileList[i].title}</span></td>
    </tr>
               );
                break;
                case 'file':
                view.push(
    <tr>
        <td><a target="_blank" href={fileList[i].href}><span><i className="fa fa-file-word-o file-icon"></i>{fileList[i].title}</span></a></td>
        <td><span><i className="fa fa-eye"></i>{fileList[i].visitTimes}</span></td>
        <td><span><i className="fa fa-cloud-download"></i>{fileList[i].downloadTimes}</span></td>
        <td><span><i className="fa fa-file"></i>{fileList[i].resourceType}</span></td>
    </tr>
                );
                break;
                default:
                //出现错误的情况，报错
                break;
            }
        }

//         var folder = (
// <tr>
//     <td><span><i className="fa fa-folder-o file-icon"></i>教育在线</span></td>
// </tr> 
//                     );

//         var file = (
// <tr>
//     <td><span><a href="/"><i className="fa fa-file-word-o file-icon"></i>第一次作业</span></a></td>
//     <td><span><i className="fa fa-eye"></i>100</span></td>
//     <td><span><i className="fa fa-cloud-download"></i>100</span></td>
//     <td><span><i className="fa fa-file"></i>课件</span></td>
// </tr>
//                     );
//   <span className="right"><button className="btn btn-info">返回上一层</button></span>
           
        return (
    <div className="file commonpane col-md-8 col-md-offset-1">
            <div className="course-title file-title">
                <span>
                    教学资源
                </span>
            </div>
            <div className="file-list">
                <table className="table table-hover">
                    <tbody>
                    {view}
                    </tbody>
                </table>
            </div>        
    </div>
        );
    }
});

var News = React.createClass({
    getInitialState:function(){
        return {
            newsList:[],
            loading:true
        }
    }
    ,
    componentWillReceiveProps:function(){
        var self = this;
        var courseId = $('.course-list .active').attr('data-id');
        this.setState({loading:true});

        $.get('/coursenews?courseid='+courseId,function(result){
            console.log(result);
            if(result.valid == true){
                self.setState({
                    newsList:result.courseNews,
                    loading:false
                });
            }
            else{
                //加载失败的话
            }  
        });
    }
    ,
    render:function(){    
    var view = [],
        newsList = this.state.newsList;

    if(this.state.loading == true){
        view =(<p><i className="fa fa-spinner fa-spin"></i>加载中，请稍候</p>);
    }

    if(newsList.length == 0){
        view =(<p>无内容</p>);
    }

    for(var i = 0 ;i < newsList.length;i++){
        view.push(
        <div className="news-item clearfix">
            <p className="left" data-id={newsList[i].contId}>{newsList[i].newsCont}</p>
        </div>
        )
    }

    return (
    <div className="news commonpane col-md-8 col-md-offset-1">
            <div className="course-title">
                <span>
                    最新动态
                </span>
            </div>
            <div className="news-list">
            {view}
            </div>
    </div>
        );
    }
});


var Task = React.createClass({
    getInitialState:function(){
        return {
            taskList:[],
            loading:true
        }
    }
    ,
    componentWillReceiveProps:function(){
        var self = this;
        var courseId = $('.course-list .active').attr('data-id');
        self.setState({taskList:[]});
        this.setState({loading:true});

        $.get('/coursenews?courseid='+courseId,function(result){
            if(result.valid == true){
                var courseNews = result.courseNews;
                if(courseNews.length == 0){
                   self.setState({loading:false}); 
                }
                for(var i = 0;i < courseNews.length && courseNews[i].newsType=='作业';i++){
                    self.setState({loading:false});
                    $.get('/onetask?taskid='+courseNews[i].contId,function(result){
                        if(result.taskInfo.task.content != 'Bug Report'){
                            var taskList = self.state.taskList;
                            taskList.push(result.taskInfo);
                            self.setState({
                                taskList:taskList
                            })
                        }
                    });
                }
            }
            else{
                //加载失败的话
            }
        }); 
    }
    ,
    componentDidMount:function(){
        var self = this;
        var courseId = $('.course-list .active').attr('data-id');
        self.setState({taskList:[]});
        this.setState({loading:true});

        $.get('/coursenews?courseid='+courseId,function(result){
            if(result.valid == true){
                var courseNews = result.courseNews;
                if(courseNews.length == 0){
                   self.setState({loading:false}); 
                }
                for(var i = 0;i < courseNews.length && courseNews[i].newsType=='作业';i++){
                    self.setState({loading:false});
                    $.get('/onetask?taskid='+courseNews[i].contId,function(result){
                        if(result.taskInfo.task.content != 'Bug Report'){
                            var taskList = self.state.taskList;
                            taskList.push(result.taskInfo);
                            self.setState({
                                taskList:taskList
                            })
                        }
                    });
                }
            }
            else{
                //加载失败的话
            }
        }); 
    }
    ,
    onTitle:function(e){
        var taskNo = $(e.currentTarget).attr('data-id'),
            taskList = this.state.taskList;
        var taskItem = taskList[taskNo],
            task = taskItem.task,
            publishtime = task.publishtime,
            deadline = task.deadline,
            method = task.method,
            content = task.content;

        var html ='<div class="teacherinfo">'+
        '<div>发布时间：'+publishtime+'</div>'+
        '<div>截止时间：'+deadline+'</div>'+
        '<div>打分制:'+method+'</div>'+
        '<div>内容：'+content+'</div>'+            
        '</div>';
 
        mymodal.init(taskItem.task.title,html);
        mymodal.open();
        getHomeworkUrl(html);
    }
    ,
    onAnswer:function(e){
        var taskNo = $(e.currentTarget).attr('data-id'),
            taskList = this.state.taskList;
        
        var taskItem = taskList[taskNo],
            task = taskItem.task,
            publishtime = task.publishtime,
            deadline = task.deadline,
            method = task.method,
            content = task.content;

        var myanswer = taskItem.answer,
            answer = myanswer.answer,
            comment = myanswer.comment,
            result = myanswer.result,
            score = myanswer.score;

        var html ='<div class="teacherinfo">'+
        '<div>发布时间：'+publishtime+'</div>'+
        '<div>截止时间：'+deadline+'</div>'+
        '<div>打分制:'+method+'</div>'+
        '<div>内容：'+content+'</div>'+
        '<div>提交的答案：'+answer+'</div>'+
        '<div>评论：'+comment+'</div>'+
        '<div>结果:'+result+'</div>'+
        '<div>分数：'+score+'</div>'+            
        '</div>';
 
        mymodal.init(taskItem.task.title,html);
        mymodal.open();
    }
    ,
    onSubmit:function(){
        mymodal.init("未完成","为什么没有能完成呢？因为现在还没有作业发布，没法尝试");
        mymodal.open();   
    }
    ,
    onStat:function(){
        mymodal.init("未完成","为什么没有能完成呢？我觉得这个其实是最不重要的一个地方，我打算把它放在最后完成");
        mymodal.open();
    }
    ,
    render:function(){
    var taskList = this.state.taskList;
    var view = [];

    if(taskList.length == 0){
        view =(<p>无内容</p>);
    }
    
    if(this.state.loading == true){
       view =(<p><i className="fa fa-spinner fa-spin"></i>加载中，请稍候</p>); 
    }

    for(var i = 0;i < taskList.length;i++){
        view.push(
<div className="homework-item">
    <div className="homework-title" data-id={i} onClick={this.onTitle}>
        <span className="title-size">{taskList[i].task.title}</span>
    </div>
    
    <div className="homework-info clearfix">
        <p className="left" ><span className="glyphicon glyphicon-time"></span>{taskList[i].task.deadline}</p>
        <p className="col-md-2"><span>{taskList[i].task.method}</span></p>
        
        <p className="col-md-3 homeworkop">
            <span className="label label-success" data-id={i} onClick={this.onSubmit}>提交</span>
            <span className="label label-primary" data-id={i} onClick={this.onStat} >统计信息</span>
            <span className="label label-warning" data-id={i} onClick={this.onAnswer}>查看结果</span>
        </p>
    </div>
    <div className="homework-breif">
        <p>{$(taskList[i].task.content).text().substr(0,40)}</p>
    </div>
</div>
      );
    }

        return (
    <div className="homework commonpane col-md-8 col-md-offset-1">
            <div className="course-title">
                <span>
                    课程作业
                </span>
            </div>
            <div className="homework-list">
            {view}
            </div>
    </div>
);
    }
});

var CoursePane = React.createClass({
    getInitialState:function(){       
        return {
            courseId:"",
            viewType:"news"
        }
    },
    componentDidMount:function(){
        this.setState({
            courseId:this.props.courseId
        });
    }
    ,
    onCourse:function(e){
        mymodal.init("课程介绍","加载中....");
        mymodal.open();
        $.get('/courseintro?courseid='+this.props.courseId,function(result){
            if(result.valid == true){
                mymodal.init(result.courseIntro.courseName,result.courseIntro.courseCont==0?'无内容':result.courseIntro.courseCont);
            }
            else{

            }
        });
    },
    teacherInfo:function(e){
        //教师信息
        mymodal.init("教师信息","加载中....");
        mymodal.open();

        $.get('/teacherinfo?courseid='+this.props.courseId,function(result){
            if(result.valid == true){
                //加载成功
                var teacherInfo = result.teacherInfo,
                    email = teacherInfo.email,
                    image = teacherInfo.image=="http://222.30.60.9/meol/lifelong/social/styles/image/default_person.jpg"?'../img/default_teacher_head.png':teacherInfo.image,
                    name = teacherInfo.name||"",
                    profile = teacherInfo.profile||"",
                    url = teacherInfo.url||"";

                var html ='<div class="teacherinfo">'+
                '<div>邮箱：'+email+'</div>'+
                '<div>个人地址：'+url+'</div>'+
                '<div>头像：<img src="'+image+'" class="img-circle" style="height:3em;width:3em;"/></div>'+
                '<div>个人简介：'+profile+'</div>'+            
                '</div>';
                
                mymodal.init(name,html);
            }
            else{
            }
        });  
    }
    ,
    onSylla:function(e){
        //教学大纲
        mymodal.init("教学大纲","加载中....");
        mymodal.open();

        $.get('/coursesylla?courseid='+this.props.courseId,function(result){
           mymodal.init(result.courseSylla.courseName,result.courseSylla.courseSylla==0?'无内容':result.courseSylla.courseSylla);
        });
    }
    ,
    onCourseNews:function(e){
        //最新动态
        this.setState({viewType:"news"});
    }
    ,
    onCourseTask:function(e){
        this.setState({viewType:"task"});
    }
    ,
    onFiles:function(e){
        this.setState({viewType:"file"});
    }
    ,
    render:function(){
    
    var style ={'margin-top':'10%'};
    var view ;
    switch(this.state.viewType){
        case 'news':
            view = (<News courseId = {this.props.courseId}/>);
        break;
        case 'task':
            view = (<Task courseId = {this.props.courseId}/>);
        break;
        case 'file':
            view = (<Folder courseId = {this.props.courseId}/>);
        break;
    }

        return(
<div className="right-body col-lg-9 col-xs-12 col-sm-7">
    <div className="userpane row col-lg-12 textcenter">
        <div className="col-md-12">
            <div className="gap col-lg-2"></div>
            <div className="userpane-item col-lg-2 col-xs-6">
                
                    <img className="hvr-wobble-vertical" src="img/icon/courseinfo.gif" onClick={this.onCourse} ></img>
                    <p>课程介绍</p>
                
            </div>
            <div className="userpane-item teacherinfo col-lg-2 col-xs-6">
                
                    <img className="hvr-wobble-vertical" src="img/icon/teacherinfo.gif" onClick={this.teacherInfo}></img>
                    <p>教师信息</p>
               
            </div>

            <div className="userpane-item broadcast col-lg-2 col-xs-6">
                
                    <img className="hvr-wobble-vertical" src="img/icon/courseprogram.gif" onClick = {this.onSylla}></img>
                    <p>教学大纲</p>
                
            </div>
        </div>

        <div className="col-md-12" style={style}>
            <div className="gap col-lg-2"></div>
            <div className="userpane-item broadcast col-lg-2 col-xs-6">
                
                    <img className="hvr-wobble-vertical" src="img/icon/homework.gif" onClick={this.onCourseTask}></img>
                    <p>课程作业</p>
               
            </div>

            <div className="userpane-item broadcast col-lg-2 col-xs-6">
                <img className="hvr-wobble-vertical" src="img/icon/source.gif" onClick={this.onFiles}></img>
                <p>教学资源</p>
            </div>

            <div className="userpane-item broadcast col-lg-2 col-xs-6">
                <img className="hvr-wobble-vertical" src="img/icon/information.gif" onClick={this.onCourseNews}></img>
                <p>最新动态</p>
            </div>
        </div>
    </div>
{view}
</div>
)
    }
});


var LoginBox = React.createClass({
    getInitialState:function(){
        return {
            username:"",
            password:"",
            savecheck:false,
        }
    },
    usernameChange: function(event) {
        //用户名改变时提出提示
        this.setState({username: event.target.value});
    },
    passwordChange:function(event){
        //用户名改变时提出提示，密码
        this.setState({password: event.target.value});
    }
    ,
    checkChange:function(event){
        //用户名改变时提出提示
        this.setState({savecheck: !this.state.savecheck});
    }
    ,
    postForm:function(event){
       var self = this;
       $.ajax({
        url:'/login',
        type:'Post',
        data:{
            username:this.state.username,
            password:this.state.password,
            savecheck:this.state.savecheck
        },
        success:function(result){
          if(result.valid == true){
             //成功登陆
             //swal('成功登陆');
             self.props.childChange(true);
          }
          else{
            if(result.err == '数据库中找不到'){
               swal('加载中');
               $.ajax({
                url:'/exenewuser',
                type:'Post',
                data:{
                    username:self.state.username,
                    password:self.state.password,
                    savecheck:self.state.savecheck
                },
                success:function(result){
                console.log(' iam result');
                  console.log(result);
                  if(result.valid == true){
                     swal('加载成功');
                     self.props.childChange(true);
                  }
                  else{
                     swal(result.err);
                  }
                }
               });
            }
            else{
                swal(result.err);
            }
          }
        }
        });
    }
    ,
    render:function(){
    var username = this.state.username,
        password = this.state.password,
        savecheck = this.state.savecheck,
        postForm = this.postForm;

        return <div className="login-box">
    <div className="login-title">
        <span>登录</span>
    </div>
    
    <div className="input-group">
        <div className="input-group-item">
            <span className="input-icon"><span className="glyphicon glyphicon-user"></span></span>
            <input type="text"  value={username} name="username" className="username input-item" placeholder="学号" onChange={this.usernameChange} ></input>
        </div>
        <div className="input-group-item">
            <span className="input-icon"><span className="glyphicon glyphicon-lock"></span></span>
            <input type="password" value={password} name="password" className="password input-item" placeholder="密码" onChange={this.passwordChange} ></input>
        </div>
    </div>

    <div className="input-botton poscenter">
        <a href="#" className="btn btn-1 login-botton" onClick={postForm}>
            <svg>
                <rect x="0" y="0" fill="none" width="100%" height="100%" />
            </svg>
            登录
        </a>
        <div className="savecheckbox poscenter">
           <input type="checkbox" name="savepassword" id="savepassword " checked={this.state.savecheck} onClick={this.checkChange} disabled = "disabled">
           <span disabled = "disabled">高阶版</span></input>
           <span className="glyphicon glyphicon-question-sign login-help" data-toggle="tooltip" data-placement="bottom" title="复刻版的介绍在关于里面，还没写完，复刻版会更完善，敬请期待" ></span>
        </div>        
    </div>
</div>;
    }
});


var CourseList = React.createClass({
    getInitialState:function(){
        return {
            courselist:{},
            error:null,
            load:"onload"
        }
    }
    ,
    componentDidMount:function(){
        var self = this;
        this.serverRequest = $.get('/course',function(result){
            //拿到了课程列表
            if(result.valid==true){
               self.setState({
                courselist:result.courselist,
                load:"overload"
               });   
            }
        });
    },
    onCourse:function(e){
        var courseId = $(e.target).attr('data-id');
        $('.course-list .active').toggleClass('active');
        $('.course-list-item[data-id='+courseId+']').addClass('active');
        this.props.childChange(courseId);
    }
    ,
    render:function(){
     var view=[],
         courselist = this.state.courselist;
     if(this.state.load == 'onload'){

     }
     else{
         if(this.state.error){
            view = <div></div>;
         }
         else{
            for(var i = 0;i < courselist.length;i++){
                view.push (
                    <div className="course-list-item" data-id={courselist[i].id}>
                        <p className="course-list-item-name" data-id={courselist[i].id} onClick={this.onCourse} >{courselist[i].coursename}</p>
                        <a href="#" data-id={courselist[i].id} className="courseList-teacherName"><p><span className="glyphicon glyphicon-user teachericon"></span>{courselist[i].teacher}</p></a>
                    </div>);
            }
         }
     }

     return <div className="left-frame col-lg-2 col-xs-11 col-sm-4 course commonpane course-hidden">
                <div className="course-title">
                    <span>课程列表</span>
                </div>

                <div className="course-list"> 
                    {view}
                </div>
            </div>;       
    }
});


var UserPane = React.createClass({
    getInitialState:function(){
        return {
            unReadNum:""
        }
    }  
    ,
    onUserinfo:function(){
        
        //个人信息
        var self = this;
        //抓取个人信息

        $.get('/user',function(result){
             console.log('result',result);
             //这里还要讨论是否成功读取的可能

             var html = "<div class='userinfo'>";
             for(var x in result.userinfo){
                html += "<div>"+result.userinfo[x]+"</div>";
             }
             html+="</div>";

             mymodal.init("学生信息",html);
             mymodal.open();
        });
        mymodal.init("学生信息","加载中....");
    },
    onTips:function(){
        //消息提醒
        var self = this;
        $.get('/tips',function(result){
             //这里还要讨论是否成功读取的可能
             if(result.valid == true){
             var tips = result.tips;
             var html = "<div class='userinfo'>";
             for(var i = 0;i < tips.length;i++){
                html += "<p>"+tips[i].content+"</p>";
             }
             html+="</div>";
             mymodal.init("消息提醒",html);
             }
             mymodal.open();
        });
        mymodal.init("消息提醒","加载中....");  
    },
    onNote:function(){
        //通知公告
        swal('缓慢建设中');
    },
    componentDidMount:function(){
        var self = this;
        //获取未读消息的数目
        this.serverRequest = $.get('/tips',function(result){
            if(result.valid == true && result.tips.length != 0){
                self.setState({
                    unReadNum:result.tips.length
                });
            }
        });       
    }
    ,
    render:function(){
        return <div className="userpane col-lg-9 col-xs-12 col-sm-7 textcenter">
                    <div className="gap col-lg-2"></div>
                    <div className="userpane-item userinfo col-lg-2 col-xs-6" onClick={this.onUserinfo}>
                        <a href="#">
                            <img className="hvr-wobble-vertical" src="img/icon/userinfo.gif"></img>
                            <p>个人信息</p>
                        </a>
                    </div>

                     <div className="userpane-item message col-lg-2 col-xs-6" onClick={this.onTips}>
                     <a href="#">
                        <img className="hvr-wobble-vertical" src="img/icon/message.gif"></img>
                        <p>提醒<span className="badge">{this.state.unReadNum}</span></p>
                     </a>
                    </div>

                    <div className="userpane-item broadcast col-lg-2 col-xs-6" onClick={this.onNote}>
                    <a href="#">
                        <img className="hvr-wobble-vertical" src="img/icon/broadcast.gif"></img>
                        <p>系统公告</p>
                    </a>
                    </div>


                    <div className="userpane-item broadcast col-lg-2 col-xs-6" >
                    <a href="/logout">
                        <img className="hvr-wobble-vertical" src="img/icon/logout.gif"></img>
                        <p>退出登录</p>
                    </a>
                    </div>
                </div>;
    }
});

var Index = React.createClass({    
    componentWillMount:function(){
        var self = this;
        $.get('/user',function(result){
                if(result != '请先登录')
                {
                    self.setState({login:true});
                }
            });
    },
    getInitialState:function(){
        return {
            login:false,
            courseId:-1
        }
    },
    onLoginChange:function(login){
        this.setState({
            login:login
        }) 
    }
    ,
    onCourseChange:function(courseId){
        this.setState({courseId:courseId});
    }
    ,
    render:function(){
        var view;
        if(this.state.login == false)
            view = <LoginBox childChange={this.onLoginChange} />;
        else{
            if(this.state.courseId == -1)
            {
                view = ( <div><CourseList childChange={this.onCourseChange}/> < UserPane /></div>);
            }
            else{
                view = ( <div><CourseList childChange={this.onCourseChange}/> <CoursePane courseId={this.state.courseId} /></div>);
            }
        }
        return  view;
    }
});


ReactDOM.render(
<Index/>
,document.getElementById('mainBody')
);


var UserPane = React.createClass({
render:function(){
    return <div className="userpane row col-lg-10 textcenter">
                <div className="gap col-lg-2"></div>
                <div className="userpane-item userinfo col-lg-2">
                    <a href="#">
                        <img src="img/icon/userinfo.gif"></img>
                        <p>个人信息</p>
                    </a>
                </div>
                 <div className="userpane-item message col-lg-2">
                 <a href="#">
                    <img src="img/icon/message.gif"></img>
                    <p>提醒<span className="badge">2</span></p>
                 </a>
                </div>
                <div className="userpane-item broadcast col-lg-2">
                <a href="#">
                    <img src="img/icon/broadcast.gif"></img>
                    <p>系统公告</p>
                </a>
                </div>
            </div>;
                }
});



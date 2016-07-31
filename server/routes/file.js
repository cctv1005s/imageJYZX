var tools = require('../model/tools');
var url = require('url');
var qs = require('querystring');
var util = require('util');

exports.homework = function(req,res,next){
    var request = tools.getMyrequest(req.session.user.jar);
    var homeworkUrl = req.query.homeworkurl;//下载文件的文件地址
    var filename = req.query.filename;//下载文件的文件名

    if(typeof homeworkUrl == 'string'){
        res.writeHead(200, {
          'Content-Type': 'application/force-download',
          'Content-Disposition': "attachment; filename="+encodeURIComponent(filename)//这里要再一次编码，比较坑爹
        });
        request(homeworkUrl).pipe(res);
    }
    else{
        res.send('访问连接出错');
    }  
}


//下载资源比价麻烦，要先去抓取文件名，才能够继续读取流，要不然就坑爹了。
exports.resource = function(req,res,next){
    var resourceUrl = req.query.resourceurl;
    var request = tools.getMyrequest(req.session.user.jar);

    console.log(resourceUrl);

    var previewUrl = getPreviewUrl(resourceUrl);

    getResourceName(previewUrl,request,function(err,filename){
        if(err){
           return res.send(err);
        }

        if(typeof resourceUrl == 'string'){
            res.writeHead(200, {
              'Content-Type': 'application/force-download',
              'Content-Disposition': "attachment; filename="+encodeURIComponent(filename)//这里要再一次编码，比较坑爹
            });
            request(resourceUrl).pipe(res);
        }
        else{
            res.send('访问连接出错');
        }    

    });
}


//抓取预览地址，是为了找到他的文件名
var getPreviewUrl = function(resourceUrl){
    var previewUrl = 'http://222.30.60.9/meol/common/script/preview/download_preview.jsp?fileid=%s&resid=%s&lid=%s';

    var queryUrl = url.parse(resourceUrl).query,
    query = qs.parse(queryUrl);

    var fileid = query.fileid,
        resid = query.resid,
        lid = query.lid;

    return util.format(previewUrl,fileid,resid,lid);
}


var getResourceName = function(previewUrl,request,callback){
    request(previewUrl,{encoding: "binary"},function(err,req,body){
        if(err){
            console.log(err);
            return callback(err);
        }

        var $ = tools.load(body);
        var filename =$($('#dowload-preview .h1-title h2 span')[0]).text();

        return callback(null,filename);
    });
}


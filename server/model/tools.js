var iconv = require('iconv-lite'),
    cheerio = require('cheerio');
var request = require('request');

exports.getCookie = function(cookie){
    if(cookie)
    return cookie.key+"="+cookie.value;
    else
    return "";
}

exports.getCourseId = function(href){
    return href.replace(/[^0-9]/ig,"");
}

exports.getGBK = function(buffer){
    return iconv.decode(new Buffer(buffer, 'binary'),'gbk'); 
}

exports.load = function(buffer){
    return cheerio.load(buffer);
}

exports.getMyrequest = function(jar){
    console.log('------call tools.getMyrequest ------- ');
    var jar = jar._jar.cookies;
    var cookieStr = jar[0].key+'='+jar[0].value;
    var url = jar[0].domain+jar[0].path;
    var myjar = request.jar();
    var cookie = request.cookie(cookieStr);
    myjar.setCookie(cookie,'http://222.30.60.9/meol');
    return request.defaults({jar:myjar}); 
}
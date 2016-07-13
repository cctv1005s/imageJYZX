;(
  function($){
   var mymodal = function(){
        //点击关闭按钮也会关闭
        $('.modal-btn-close').click(function(event) {
            mymodal.close();
        });
        //其他地方点屏幕就会关闭
        $('body').on('click','.mymodal',function(e){
            if($(e.target).hasClass('mymodal')){
                mymodal.close();
            }  
        });
   };
   mymodal.__proto__ = {
    init:function(title,html){
        $('.mymodal-title').text(title);
        $('.mymodal-body').html(html);
    }
    ,
    open:function(){
        $('body').toggleClass('mymodal-open');
        if($('.mymodal').css('display') == 'none'){
        $('.mymodal').fadeIn(400, function() {
            $('.mymodal .mymodal-main').toggleClass('mymodal-main-show');
        });
        }
        else{
         $('.mymodal .mymodal-main').toggleClass('mymodal-main-show');
         $('.mymodal').fadeOut(400, function() {});   
        }
    }
    ,
    close:function(){
        this.open();
    }
   }
   window.mymodal = mymodal;
}
)(jQuery)
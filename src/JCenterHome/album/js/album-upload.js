require.config({
    baseUrl:'../',
    paths: {
        "configurl": "sh/js/configurl"
    }
});
require(['configurl'],function(configpaths){
    /*添加上传插件*/
    configpaths.paths.upload = "base/component/upload/image-js/uploadnew";
    configpaths.paths.webuploader = "base/component/upload/js/webuploader";
    require.config(configpaths);

    require(['jquery','webuploader','upload','layout'],function($,WebUploader,upload,layout){
        //header footer 布局
        layout.header();
        layout.footer();

        $('#al-classname').on('click',function(){
            if( $(this).next().is(':hidden') ){
                $(this).next().show();
            }else{
                $(this).next().hide();
            }
            return false;
        });
        $('#al-classbox').on('click','a',function(){
            $('#al-classname').html($(this).html());
        });
        $('body').on('click',function(){
            $('#al-classbox').hide();
        });
    });
});

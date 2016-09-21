/*
 * 加载配置Url文件
 * */
require.config({
    baseUrl:'../',
    paths: {
        "configurl": "sh/js/configurl"
    }
});
/*
 * 引入配置文件
 * */
require(['configurl'],function(configpaths){
    //引入配置文件的配置对象
    require.config(configpaths);
    //随笔脚本
    require(['jquery','tools','dialog','layout'],function($,tools,dialog,layout){
        //header footer 布局
        layout.header();
        layout.footer();

        var $groupClass = $('#group-class');
        var $groupName = $('#group-name .write-input');
        //实例化编辑器
        var ue = UE.getEditor('editor');

        //标题数量计算
        tools.titleNum($('#essay-title'),$('#new-num'),50);

        //日志分类选择
        $groupName.click(function(){
             if( $groupClass.is(':hidden') ){
                 $groupClass.show();
             }else{
                 $groupClass.hide();
             }
             return false;
        });
        $('body').on('click',function(){
            $groupClass.hide();
        });
        $groupClass.on('click','.select-class',function(){
            $groupName.html($(this).html());
        });










        //获取内容
        $('#btn1').click(function(){

            alert(ue.getContent());
        });
        //写入内容
        $('#btn2').click(function(){
            // UE.getEditor('editor').setContent('欢迎使用ueditor', true);
            ue.setContent('<p>欢迎使用ueditor</p><p>11</p>');
        });
    });
})


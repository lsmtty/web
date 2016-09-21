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


    });
})


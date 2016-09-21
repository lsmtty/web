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
        //生成日期
        dateSearch();
        //隔行变色
        $('.essay-li').filter(':odd').addClass('essay-li-color');

        //搜索提示语
        tools.textHint($('#search-text'));

        //分组点击
        $('.essay-manage').on('click','.group-title',function(){
            $('.group-title').removeClass('group-title-active');
            $(this).addClass('group-title-active');
        });

        //文章设置点击
        tools.setBox($('.essay-all'));

        //批量操作开关
        $('#essays-set').on('click',function(){
            bulkManage(true);
        });
        $('#all-set-no').on('click',function(){
            bulkManage();
        });

        //批量全选
        tools.checkAll( $('#all_onoff'),$('.alog-onoff') );

        //批量编辑显示状态
        function bulkManage(booleans){
            if( booleans ){
                $('.essay-list-set').show();
                $('.alog-onoff').show();
            }else{
                $('.essay-list-set').hide();
                $('.alog-onoff').hide();
            }
        };

        //月份
        function dateSearch(){
            var time = new Date();
            var max_year = time.getFullYear();
            var year = max_year
            $('#year').html(year);
            var months = '';
            for (var i = 0; i < 12; i++) {
                months += '<li class="month-list" month="' + (i+1) + '"><a class="month-link" href="javascript:;">' + (i+1) + '月</a></li>'
            };
            $('#month').html(months);
            $('.mo-left').unbind().bind('click',function(){
                year--;
                $('#year').html(year);
            });
            $('.mo-right').unbind().bind('click',function(){
                year++;
                if( year >= max_year ){
                    year = max_year;
                }
                $('#year').html(year);
            });
            $('.month-link').each(function(){
                $(this).unbind().bind('click',function(){
                    $('.month-link').removeClass('month-active');
                    $(this).addClass('month-active');
                    var Y = $('#year').html();
                    var M = parseFloat($(this).html());
                    var D =  Y +'-' + tools.doubleNum(M) + '-00 00:00:00';
                    console.log(D);
                })
            });
        };
    });
})


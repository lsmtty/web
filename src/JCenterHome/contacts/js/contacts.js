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

        //搜索提示
        tools.textHint($('#search'));

        //分类搜索选择
        $('#type').click(function(){
            if( $(this).next().is(':hidden') ){
                $(this).next().show();
            }else{
                $(this).next().hide();
            }
            return false;
        });
        $('.search-type').on('click',function(){
            return false;
        });
        $('.types').on('click','li',function(){
            $('#type').html($(this).html());
            $('.types').hide();
        });

        //增加分组操作-打开分组
        $('.create-btn').click(function(){
            $(this).hide();
            $('.create-box').show();
        });

        //增加分组操作-关闭分组
        $('.cancel').click(function(){
            $('.create-box').hide();
            $('#add-name').val('');
            $('.create-btn').show();
        });

        //好友名单中的分组点击
        $('.friends').on('click','.other-group',function(){
            $('.move-box').hide();
            var $groupBox = $(this).parent().find('.move-box');
            var $otherLi = $(this).parent().find('.other-li');
            var $ok = $(this).parent().find('.confirm');
            var $no = $(this).parent().find('.cancel');
            $groupBox.show();
            $groupBox.click(function(){
                return false;
            });
            $otherLi.click(function (){
                $otherLi.removeClass('active');
                $(this).addClass('active');
            })
            $no.on('click',function(){
                $groupBox.hide();
            });
            return false;
        });

        //清除好友中的分组展开状态
        $('body').on('click',function(){
            //好友信息内移动分组状态清除
            $('.move-box').hide();
            //好友搜索分类状态框
            $('.types').hide();
        });

        //班级 好友通讯列表切换
        $('.group').on('click','ul',function(){
            $('.friends').hide();
            $('#' + $(this).attr('type')).show();
        })
    });
})


require.config({
    paths: {
        "configurl": "base/configurl"
    }
});
require(['configurl'],function(configpaths) {

    require.config(configpaths);
    require(['jquery'], function ($) {
        $('body').on('click', '.set-name', function () {
            if ($(this).next().is(':hidden')) {
                $(this).next().show();
            } else {
                $(this).next().hide();
            }
        })
        $('body').on('click', '.set-name', function () {
            return false;
        });
        $('body').on('click', function () {
            $('.set-list').hide();
        });

        $('.photos-set').on('click', function () {
            if ($('.pho-aset').is(':hidden')) {
                $('.pho-aset').show();
                $('.pho-radio').show();
            } else {
                $('.pho-aset').hide();
                $('.pho-radio').hide();
                $('.pho-radio').removeClass('pho-radio-active');
            }
        });
        //全选
        $('#pho-all').on('click',function(){
            if( $(this).attr('key') == 2 ){
                $(this).attr('key','1');
                $('.pho-radio').attr('key','1');
                $('.pho-radio').removeClass('pho-radio-active');
            }else{
                $(this).attr('key','2');
                $('.pho-radio').attr('key','2');
                $('.pho-radio').addClass('pho-radio-active');
            }
        });
        //单个照片选择
        $('.ablum-photos').on('click','.pho-radio',function(){
            if( $(this).attr('key') == 2 ){
                $(this).attr('key','1');
                $(this).removeClass('pho-radio-active');
            }else{
                $(this).attr('key','2');
                $(this).addClass('pho-radio-active');
            }
        });
    });
})
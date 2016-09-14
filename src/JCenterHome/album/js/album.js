require.config({
    baseUrl:'../',
    paths: {
        "configurl": "sh/js/configurl"
    }
});
require(['configurl'],function(configpaths){
    require.config(configpaths);

    require(['jquery','tools','dialog'],function($,tools,dialog){
        /*
        * 编辑框
        * */
        $('body').on('click','.set-name',function(){
            if( $(this).next().is(':hidden') ){
                $(this).next().show();
            }else{
                $(this).next().hide();
            }
        });
        $('body').on('click','.set-name',function(){
            return false;
        });
        $('body').on('click',function(){
            $('.set-list').hide();
            dialog.photoMoveDialog(
                function(data){
                    console.log(data);
                },
                {
                    list:[
                        {
                            name:'相册1',
                            id:1,
                            permission:'全站用户可见'
                        },
                        {
                            name:'相册2',
                            id:2,
                            permission:'仅自己可见'
                        },
                        {
                            name:'相册3',
                            id:3,
                            permission:'仅好友可见'
                        }
                    ]
                }
            );
        });
    });
})


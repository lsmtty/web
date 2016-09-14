require.config({
    paths: {
        "configurl": "base/configurl"
    }
});
require(['configurl'],function(configpaths){
    require.config(configpaths);

    require(['jquery','tools'],function($,tools){
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
            /*tools.changeAlbumDialog(
                function (data){
                    console.log(data);
                },
                {
                    'name': '哈哈',
                    'message':'11110',
                    'permission':0
                }
            );*/
            /*tools.changeClassDialog(function(data){
                console.log(data);
            },{
                name:'123'
            });*/
            /*tools.friendGroupDialog(
                function (data){
                    console.log(data)
                },
                {
                    list:[
                        {name:'分组1',id:1},
                        {name:'分组2',id:2},
                        {name:'分组3',id:3},
                        {name:'分组4',id:4},
                        {name:'分组5',id:5}
                    ]
                }
            )*/
            tools.photoMoveDialog(
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


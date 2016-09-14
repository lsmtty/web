define('tools',['jquery'],function($){
    return {
        setCookie: function (name,value,t) {
            var now = new Date();
            now.setDate(now.getDate()+t);
            document.cookie = name+"="+escape(value)+";expires="+now.toUTCString()+"';path=/'";
        },
        readCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },
        delCookie: function (name) {
            this.setCookie(name, "", -1);
        },
        /*
        * 对话框点击事件
        * */
        dialogClick: function(callBack,obj){
            if( !callBack && !obj ){
                callBack = function(){};
                obj = {};
            }
            $('#mask,.dialog-box').on({
                'mousewheel':function () { return false; },
                'click':function () { return false; }
            });
            //删除确定按钮
            $('#confirm').click(function () {
                if (typeof callBack == 'function') {
                    if( typeof obj == 'object' ){
                        callBack(obj);
                    }else{
                        callBack();
                    }
                };
                $('#mask').remove();
                $('.dialog-box').remove();
                return false;
            });
            $('#cancel').click(function () {
                $('#mask').remove();
                $('.dialog-box').remove();
                return false;
            });
        },
        /*
        * 删除对话框
        * */
        confirmDialog: function(title, content, callBack) {
            $('body').append('<div id="mask"></div>');
            $('body').append('<div id="confirmDialog" class="dialog-box">'
                + '<h2 class="box-header">' + title + '</h2>'
                + '<p class="text">' + content + '</p>'
                + '<p>'
                + '<a id="confirm" href="javascript:;">确定</a>'
                + '<a id="cancel" href="javascript:;">取消</a>'
                + '</p>'
                + '</div>');
            this.dialogClick(callBack);
        },
        deleteDialog: function(callback) {
            this.confirmDialog('删除', '您确定要删除吗？删除后不可恢复。', callback);
        },
        /*
        * 编辑相册，创建相册对话框
        * */
       /*
       * tools.changeAlbumDialog(
            function (data){
             console.log(data);
            },
            {
                'name': '哈哈',
                'message':'11110',
                'permission':0
            }
        );
       * */
        changeAlbumDialog:function(callBack,albumData){
            var dialogTitle = '编辑相册';
            if( !albumData ){
                dialogTitle = '创建相册'
                albumData = {};
            }
            var albumNewData = {
                'name': albumData.name || '',
                'message':albumData.message || '',
                'permission':albumData.permission || 0
            }
            $('body').append('<div id="mask"></div>');
            $('body').append('<div id="changeAlbumDialog" class="dialog-box" style="display: block;">'
                    + '<h2 class="box-header">'
                      + '<span>' + dialogTitle + '</span>'
                    + '</h2>'
                    + '<div class="change-abtop">'
                        + '<span class="change-abtitle">相册名称 </span>'
                        + '<input class="calbum-name" type="text" value="' + albumNewData.name + '" maxlength="30">'
                        + '<span class="ab-name-num">'
                        + '<span class="numok">' + albumNewData.name.length + '</span>/30 </span>'
                    + '</div>'
                    + '<div class="change-abtop">'
                        + '<span class="change-abtitle">相册描述 </span>'
                        + '<textarea class="album-msg" value="' + albumNewData.message + '" name="" id="" cols="30" rows="10" maxlength="200"></textarea>'
                        + '<span class="ab-name-num">'
                        + '<span class="numok">' + albumNewData.message.length + '</span>/200 </span>'
                    + '</div>'
                    + '<div class="per-box">'
                        + '<span class="change-abtitle">相册权限 </span>'
                        + '<select class="permission" >'
                            + '<option value="0">全部用户可见</option>'
                            + '<option value="1">仅好友可见</option>'
                            + '<option value="3">仅自己可见</option>'
                        + '</select>'
                    + '</div>'
                    + '<p class="btns">'
                    + '<a id="confirm" href="javascript:;">确定</a>'
                    + '<a id="cancel" href="javascript:;">取消</a>'
                    + '</p>'
                + '</div>');
            $(".permission option[value='"+albumNewData.permission +"']").attr("selected",true);
            var $name = $("#changeAlbumDialog").find(".calbum-name");
            var $textArea = $("#changeAlbumDialog").find(".album-msg");
            $textArea.html(albumNewData.message);
            var $numLength = $("#changeAlbumDialog").find(".numok");
            var $select = $("#changeAlbumDialog").find(".permission");
            //输入框数字监控
            function valueLengthWatch(num,maxNum){
                var value = this.value;
                if( value.length > maxNum ) value = value.slice(0,maxNum);
                $numLength.eq(num).html(value.length);
                if( num ){
                    albumNewData.message = value;
                }else{
                    albumNewData.name = value;
                }
            }
            $name.unbind().bind({
                'keyup': function(){ valueLengthWatch.call(this,0,30); },
                'change':function(){ valueLengthWatch.call(this,0,30); }
            });
            $textArea.unbind().bind({
                'keyup': function(){ valueLengthWatch.call(this,1,200); },
                'change':function(){ valueLengthWatch.call(this,1,200); }
            });
            $select.on('change',function(){
                albumNewData.permission = $(this).val();
            });
            this.dialogClick(callBack,albumNewData);
        },
        /*
        *创建分类，修改分类名称对话框
        * */
        /*
        * tools.changeClassDialog(function(data){
             console.log(data);
         },{
             name:'123'
         });
        * */
        changeClassDialog:function(callBack,data){
            var dialogTitle = '修改分类';
            if( !data ){
                dialogTitle = '创建相册'
                data = {};
            }
            var className = {
                'name': data.name || ''
            }
            $('body').append('<div id="mask"></div>');
            $('body').append('<div id="changeClassDialog" class="dialog-box">'
                + '<h2 class="box-header">' + dialogTitle + '</h2>'
                + '<p class="remove-hint-text text-min">'
                    + '<span>分类名称</span>'
                    + '<input id="change-className" type="text" value="' + className.name + '" maxlength="10">'
                + '</p>'
                + '<p id="calss-val-hint" class="bottom_hint">分类名称不能超过十个字</p>'
                + '<p class="clearFix btns">'
                    + '<a id="confirm" href="javascript:;">确定</a>'
                    + '<a id="cancel" href="javascript:;">取消</a>'
                + '</p>'
                + '</div>');
            var $input = $('#change-className')
            $input.on('change',function(){
                if( $(this).val().length > 10 ) $(this).val($(this).val().slice(0,10));
                className.name = $(this).val();
            })
            this.dialogClick(callBack,className);
        },
        /*
         *好友分组分类
         * */
        /*

         tools.friendGroupDialog(
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
         )

         */

        friendGroupDialog:function(callBack,data){
            var groupList = '';
            for(var i = 0;i<data.list.length;i++){
                groupList+= '<li class="group-list" groupid="' + data.list[i].id + '">' + data.list[i].name + '</li>';
            }
            $('body').append('<div id="mask"></div>');
            $('body').append('<div id="friendGroupDialog" class="dialog-box">'
                + '<h2 class="box-header">增加好友</h2>'
                + '<div class="remove-hint-text text-min">'
                    + '<span>分组</span>'
                    + '<div class="add-friend-class">'
                    + '<span id="friend-group" groupid="0">我的好友</span>'
                    + '<a href="javascript:;" class="choose-btn"></a>'
                    + '<ul id="group-list">' + groupList + '</ul>'
                    +'</div>'
                + '</div>'
                + '<p class="clearFix btns">'
                    + '<a id="confirm" href="javascript:;">确定</a>'
                    + '<a id="cancel" href="javascript:;">取消</a>'
                + '</p>'
                + '</div>');
            var $groupTarget = $('#friend-group');
            var $groupList = $('#group-list');
            $groupTarget.on('click',function(){
                if( $groupList.is(':hidden') ){
                    $groupList.show();
                }else{
                    $groupList.hide();
                };
                return false;
            });
            var groupresult = {
                name : $groupTarget.html(),
                id : $groupTarget.attr('groupid')
            };
            $groupList.on('click','.group-list',function(){
                $groupTarget.html($(this).html());
                $groupTarget.attr('groupid',$(this).attr('groupid'));
                groupresult.name = $groupTarget.html();
                groupresult.id = $groupTarget.attr('groupid');
            })
            $('#mask,.dialog-box').on('click',function(){
                $groupList.hide();
            });
            this.dialogClick(callBack,groupresult);
        },
        /*
        * 照片移动对话框
        * */
        photoMoveDialog:function(callBack,data){
            var albumTarget = new Object();
            var albums = '';
            for(var i = 0; i<data.list.length;i++){
                albums += '<li class="al-box" albumid="' + data.list[i].id + '" name="' + data.list[i].name + '" key="1">'
                    + '<a href="javascript:;" class="aimg-box choose-pic">'
                        + '<img src="">'
                    + '</a>'
                    + '<div class="box-msg">'
                        + '<p><span class="msg-name">' + data.list[i].name + '</span></p>'
                        + '<p><span>' + data.list[i].permission + '</span></p>'
                    + '</div>'
                    + '<span class="box-radio"></span>'
                    + '</li>';
            };
            $('body').append('<div id="mask"></div>');
            $('body').append('<div id="photoMoveDialog" class="dialog-box">'
                + '<h2 class="box-header">移动到相册</h2>'
                +'<ul class="album-boxs clearFix">' + albums +'</ul>'
                + '<p class="clearFix btns">'
                    + '<a id="confirm" href="javascript:;">确定</a>'
                    + '<a id="cancel" href="javascript:;">取消</a>'
                + '</p>'
                + '</div>');
            var album = $('#photoMoveDialog').find('.al-box');
            var radio = $('#photoMoveDialog').find('.box-radio');
            album.on('click',function(index){
                album.attr('key','1');
                radio.removeClass('box-radio-active');
                $(this).find('.box-radio').addClass('box-radio-active');
                $(this).attr('key','2');
                albumTarget.id =  $(this).attr('albumid');
                albumTarget.name =  $(this).attr('name');
            });
            this.dialogClick(callBack,albumTarget);
        }
    }
})
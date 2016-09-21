define('tools',['jquery'],function($){
    return {
        setCookie: function (name,value,t) {
            var now = new Date();
            now.setDate(now.getDate()+t);
            document.cookie = name+"="+escape(value)+";expires="+now.toUTCString()+"';path=/'";
        },
        readCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr == document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        },
        delCookie: function (name) {
            this.setCookie(name, "", -1);
        },
        doubleNum: function two(m){
            if(m<0) return m;
            if( m >= 10 ){
                return m;
            }else{
                return '0' + m;
            }
        },
        //把search值转化成对象
        searchObj: function (){      //参数为window.location.search
            var str = window.location.search.slice(1);  //去掉首字母
            var obj = new Object();     //创建search对象

            if( str.indexOf('&') == -1 ){     //判断search值是否是多个
                var newArr = str.split('=');
                obj[newArr[0]] = newArr[1];   //拆分search并给 search对象赋值
            }else{
                var	arr = str.split('&');
                for (var i = 0; i < arr.length; i++) {
                    var newArr = arr[i].split('=');
                    obj[newArr[0]] = newArr[1]
                }
            }
            return obj;   //输出search对象
        },
        //添加search对象
        addSearch: function (str){
            var arr = str.split('=');
            var obj;
            if( window.location.search){
                obj = this.searchObj();
            }else{
                obj = {};
            }
            obj[arr[0]] = arr[1];               	//改变或赋值
            var searchArr = [];
            for(var n in obj){						//再把对象转化回来
                var searchStr = n + '=' + obj[n];
                searchArr.push(searchStr);
            }
            window.location.search = searchArr.join('&');  //改变search值
        },
        //删除search 的某个值
        removeSearch: function (str){
            var obj = this.searchObj();
            var searchArr = [];
            for(var n in obj){						//再把对象转化回来
                if( n == str ){
                    continue;
                }
                var searchStr = n + '=' + obj[n];
                searchArr.push(searchStr);
            }
            window.location.search = searchArr.join('&');  //改变search值
        },
        //输入框提示 传入jquery对象
        textHint: function (obj){
            obj.bind({
                focus:function(){
                    if (this.value == this.defaultValue){
                        this.value="";
                    }
                },
                blur:function(){
                    if (this.value == ""){
                        this.value = this.defaultValue;
                    }
                }
            });
        },
        //全选
        checkAll: function (input,target){
            input.on('click',function(){
                if( $(this).get(0).checked ){
                    target.each(function (index){
                        target.eq(index).get(0).checked = true;
                    })
                }else{
                    target.each(function (index){
                        target.eq(index).get(0).checked = false;
                    })
                }
            });
            $('body').on('click',target,function(){
                target.each(function(){
                    if( this.checked ){
                        input.eq(0).get(0).checked = true;
                    }else{
                        input.eq(0).get(0).checked = false;
                        return false;
                    }
                })
            });
        },
        /* 计算标题数量
         obj     input  输入框      类型 jquery对象
         target  要改变的数字       类型 jquery对象
         maxNum  最大值             类型 Number
         */
        titleNum: function (obj, target, maxNnm) {
            var length = 0;
            obj.unbind().bind('keyup', function () {
                length = obj.val().length;
                length = length > maxNnm ? maxNnm : length;
                target.html(length);
            });
        },
        //编辑下拉框（相册，随笔，分享）
        setBox: function(obj){
            //文章设置点击
            obj.on('click','.set-name',function(){
                var setBox = $(this).next().next();
                var sanjiao = $(this).next();
                if( setBox.is(':hidden') ){
                    $('.set-box').hide();
                    $('.alog-set-sj').removeClass('set-sj-ok');
                    setBox.show();
                    sanjiao.addClass('set-sj-ok');
                }else{
                    setBox.hide();
                    sanjiao.removeClass('set-sj-ok');
                }
                return false;
            });
            //清除编辑框状态
            $('body').on('click',function(){
                $('.set-box').hide();
                $('.alog-set-sj').removeClass('set-sj-ok');
            });
        }
    };
});
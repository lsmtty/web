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
        }
    }
})
(function(){
    window.layout = new Object();
    layout.header = function(data){
        if( !data ){
            data = {
                topNav:{},
                user:{},
                spaceNav:{}
            }
        };
        var headerData = {
            topNav:{
                mySpace:data.topNav.mySpace || 'javascript:;',
                classSpace:data.topNav.classSpace || '',
                schoolSpace:data.topNav.schoolSpace || 'javascript:;',
                subjectSpace:data.topNav.subjectSpace || 'javascript:;',
                regionSpace:data.topNav.regionSpace || 'javascript:;',
                messageLink:data.topNav.messageLink || 'javascript:;',
                messageNum:data.topNav.messageNum || '0',
            },
            user:{
                userName: data.user.userName || '姓名',
                userPic: data.user.userPic || ''
            },
            spaceNav:{
                home: data.spaceNav.home || 'javascript:;',
                achievements: data.spaceNav.achievements || 'javascript:;',
                topic: data.spaceNav.topic || 'javascript:;',
                collection: data.spaceNav.collection || 'javascript:;',
                app: data.spaceNav.app || 'javascript:;'
            }
        }
        var header = document.getElementById('header');
        var headerStr = '';
        var topNav = '';
        var spaceNav = '';
        topNav += '<div id="top-nav">'
                + '<div class="wrap clearFix">'
                    + '<h1>人人通</h1>'
                    + '<ul class="nav clearFix">'
                        + '<li class="clearFix"><a class="top-link active" href="' + headerData.topNav.mySpace + '">我的空间</a></li>'
                        + '<li class="clearFix">'
                            + '<a id="class-link" class="top-link" href="' + headerData.topNav.classSpace + '">班级空间<span class="sanjiao"></span></a>'
                        + '</li>'
                        + '<li class="clearFix"><a class="top-link" href="' + headerData.topNav.schoolSpace + '">学校空间</a></li>'
                        + '<li class="clearFix"><a class="top-link" href="' + headerData.topNav.subjectSpace + '">学科空间</a></li>'
                        + '<li class="clearFix"><a class="top-link" href="' + headerData.topNav.regionSpace + '">区域空间</a></li>'
                    + '</ul>'
                    + '<div class="top-nav-msg">'
                        + '<a class="message" href="' + headerData.topNav.messageLink + '">消息 <span class="msg-num">（' + headerData.topNav.messageNum + '）</span></a>'
                        + '<span class="line"></span>'
                        + '<a class="set" href="javascript:;">设置<span class="sanjiao"></span></a>'
                    + '</div>'
                + '</div>'
            + '</div>'
            + '<div class="banner"></div>';
        spaceNav += '<div id="space-nav">'
                + '<div class="wrap clearFix">'
                    + '<div id="user-msg">'
                        + '<div class="shadow"></div>'
                        + '<div class="px-box">'
                        + '<img class="user-pic" src="' + headerData.user.userPic + '">'
                        + '<span class="name-bj"></span>'
                        + '<span class="user-name">' + headerData.user.userName + '</span>'
                    + '</div>'
                + '</div>'
                    + '<ul class="nav">'
                        + '<li><a class="space-link active" href="' + headerData.spaceNav.home + '">主页</a></li>'
                        + '<li><a class="space-link" href="' + headerData.spaceNav.achievements + '">我的成果</a></li>'
                        + '<li><a class="space-link" href="' + headerData.spaceNav.topic + '">话题研讨</a></li>'
                        + '<li><a class="space-link" href="' + headerData.spaceNav.collection + '">精品收藏</a></li>'
                        + '<li><a class="space-link" href="' + headerData.spaceNav.app + '">我的应用</a></li>'
                    + '</ul>'
                + '</div>'
            + '</div>';
        headerStr = topNav + spaceNav;
        header.innerHTML = headerStr;
    }
    layout.footer = function(){
        var footer = document.getElementById('footer');
        var footerStr = '<div id="mainbo_footer">'
                + '<div>'
                    + '<ul class="clearFix wrap">'
                        + '<li>'
                            + '<p>版权所有:明博教育股份有限公司</p>'
                            + '<p>ICP备案号: 蜀ICP备 14000302</p>'
                            + '<p>版本号:2.2SP9 </p>'
                        + '</li>'
                        + '<li>'
                            + '<p>客服热线:028-85768857 </p>'
                            + '<p>每天9：00-17：30(法定节假日除外) </p>'
                        + '</li>'
                        + '<li><img src="http://ck.yun.myuclass.com/portal/images/code.png">'
                            + '<p>扫一扫,关注我们获得更多教育咨询 </p>'
                        + '</li>'
                        + '<li class="main_last_msg">'
                            + '<p>网站技术支持:明博教育 </p>'
                        + '</li>'
                    + '</ul>'
                + '</div>'
            + '</div>';
        footer.innerHTML = footerStr;
    }
})();
try{
    define('layout',function(){
        return layout;
    });
}catch(arr){}
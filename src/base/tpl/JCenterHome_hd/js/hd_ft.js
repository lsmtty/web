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
})();
try{
    define('layout',function(){
        return layout;
    });
}catch(arr){}
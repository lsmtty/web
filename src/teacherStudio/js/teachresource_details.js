/* shihao 2016/7/6 */
var userrole = {};
/* 公共部分加载 */
function loadheader() {
    tsViewtplHelper.initBasicViews(2);
    initHref();
    initData();
    initRecommend();

}
loadheader();

function initHref() {
    commonHelper.initBreadNav();
    commonHelper.initBodyHref();
}

function initStudioInfo() {
    var queryObj = getQueryObj();
    if (queryObj.studioID) {
        tsInfoHelper.initStudioInfo(queryObj.studioID, function () {
            var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
            $("#banner-studioName").text(studioInfo.name);

        })
        userRoleHelper.initUserRole(queryObj.studioID, function () {
            userrole = userRoleHelper.getUserRole(queryObj.studioID);
        })
    }
}

function initData() {
    initStudioInfo();
    initContent();
    commentInfoHelper.initComment("resource");
}

function initContent() {
    var queryObj = getQueryObj();
    var contentURL = studioHost + "resource/" + queryObj.titleID;
    $.ajax({
        type: "get",
        url: contentURL
    }).success(function (data) {
        initContentHtml(data)
    });
}

function initRecommend() {
    var queryObj = getQueryObj();
    var reCommendURL = studioHost + "resource/recommend/" + queryObj.titleID + "/4";
    $.ajax({
        type: "get",
        url: reCommendURL
    }).success(function (data) {
        initRecommendHtml(data)
    });
}

function initContentHtml(data) {
    if (data) {
        $("#article h2").html(getTitleHtml(data));
        $("#article-body").html(getContentHtml(data));
    }
}

function initRecommendHtml(data) {
    if (data) {
        $(".recommend-list").append(getCommendListHtml(data));
    }
}

function getCommendListHtml(data) {
    console.log(data);
    var html = "";
    for (var index = 0; index < data.length; index++) {
        html = html + '<li class="recommend-li hide-text">' +
            '<span class="' + tsInfoHelper.getTypeIcon(data[index].fileFormat) + '"></span>' +
            '<a href="' + commonHelper.replaceTitleID(data[index].id) + '">' + data[index].title + '</a>' +
            '</li>';
    }
    return html;
}

function getTitleHtml(data) {
    var html = '<p class="title hide-text">' + data.title + '</p>' +
        '<div class="file-msg"><ul class="claerFix">' +
        '<li>大小：<span class="gray-text">' + Math.round(data.size / 1024) / 1000 + '&nbsp;MB</span></li>' +
        '<li>上传时间：<span class="gray-text">' + data.uploadTime + '</span></li>' +
        '<li>上传人：<span class="gray-text">' + data.sysUser.username + '</span></li>' +
        '</ul></div>';
    if (userrole.role == USERROLE.OWNER || userrole.role == USERROLE.MEMBER) {
        html += '<a class="down-btn" href="' + data.downloadUrl + '">下载</a>';
    }

    return html;
}

function getContentHtml(data) {
    var html = "";
    if (data.previewUrl) {
        html += '<iframe src = "' + data.previewUrl + '" class = "previewFrame"></iframe>';
    }
    else {
        html += getnoPreviewHtml();
    }
    return html;
}

function getnoPreviewHtml() {
    var html = '<div class = "nopreview"><img src = "./images/error.png" class = "nopreview-img"></img><p class = "nopreview-text">很抱歉，您请求的资源无法预览。</p></div>';
    return html;
}



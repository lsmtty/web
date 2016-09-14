function initPage() {
    tsViewtplHelper.initBasicViews(3);    
    initHref();
    initData();
}
initPage();

function initStudioInfo() {
    var queryObj = getQueryObj();
    if (queryObj.studioID) {
        tsInfoHelper.initStudioInfo(queryObj.studioID, function () {
            var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
            $("#banner-studioName").text(studioInfo.name);
        });
        userRoleHelper.initUserRole(queryObj.studioID, function () {
            var userRole = userRoleHelper.getUserRole(queryObj.studioID);
        });
    }
}

function initHref() {
    commonHelper.initBreadNav();
    commonHelper.initBodyHref();
}

function initData() {
    initStudioInfo();
    initDetailsInfo();
    commentInfoHelper.initComment("research");
}

function initDetailsInfo() {
    var queryObj = getQueryObj();

    if (queryObj.titleID) {
        var detailsURL = studioHost + "/research/find/" + queryObj.titleID;
        $.ajax({
            type: "get",
            url: detailsURL
        }).success(function (data) {
            setDetailsContent(data);
        });
    }
}

function getDetailsHtml(data) {
    var detailsHtml = '<div class="titlearea">' +
        '<p class="details-title center">' + data.title + '</p>' +
        '<p class="center">' +
        '<span>发表人 :</span>' +
        '<span class="gray-text">' + data.sysUser.username + '</span>' +
        '<span>&nbsp;&nbsp;</span>' +
        '<span>发表时间 :</span>' +
        '<span class="gray-text">' + data.createTime + '</span>' +
        '</p>' +
        '</div>' +
        '<div class="details-content">' + data.content +
        '</div>' +
        '<div class="details-pre">';
    if (data.prevResearch) {
        detailsHtml = detailsHtml + '<a href="' + commonHelper.replaceTitleID(data.prevResearch.id) + '"><p><b>上一篇：' +
            '</b>' + data.prevResearch.title + '</p></a>';
    }

    if (data.nextResearch) {
        detailsHtml = detailsHtml + '<a href="' + commonHelper.replaceTitleID(data.nextResearch.id) + '"><p><b>下一篇：' +
            '</b>' + data.nextResearch.title + '</p></a>';
    }

    return detailsHtml;
}

function setDetailsContent(data) {
    $("#comment-box").before(getDetailsHtml(data));
}
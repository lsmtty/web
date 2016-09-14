function initPage() {
    tsViewtplHelper.initBasicViews(5);
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
            userrole = userRoleHelper.getUserRole(queryObj.studioID);
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
    getHotResearch();
    commentInfoHelper.initComment("discuss");
}

function initDetailsInfo() {
    var queryObj = getQueryObj();

    if (queryObj.titleID) {
        var detailsURL = studioHost + "discuss/find/" + queryObj.titleID;
        $.ajax({
            type: "get",
            url: detailsURL
        }).success(function (data) {
            setDetailsContent(data);
        });
    }
}

function getHotResearch() {
    var queryObj = getQueryObj();

    if (queryObj.titleID) {
        var hotURL = studioHost + "discuss/hotDiscuss/" + queryObj.titleID + "/5";
        $.ajax({
            type: "get",
            url: hotURL
        }).success(function (data) {
            sethotItem(data);
        });
    }
}

function getDetailsHtml(data) {
    var detailsHtml = '<div id="left-title">' +
        '<p class="details-title">' + data.title + '</p>' +
        '<p>' +
        '<dl class="details-prop">'+
        '<dt>发起时间：</dt>' +
        '<dd class="details-value">' + data.createTime + '</dd>' +
        '<dt>发起人：</dt>' +
        '<dd class="details-value">' + data.sysUser.username + '</dd>' +
        '</dl></p>' +
        '</div>' +
        '<div class="details-content">' + data.content +
        '</div>';
    return detailsHtml;
}

function getRecommendHtml(data) {
    var html = "<p><ul>";
    for (var index in data) {
        html = html + '<a href="' + commonHelper.replaceTitleID(data[index].id) + '">' +
            '<li class="recommend-item"><span>' + data[index].title + '</span></li>';
    }
    html += "</ul></p>";
    return html;
}

function setDetailsContent(data) {
    $("#comment-box").before(getDetailsHtml(data));
}

function sethotItem(data) {
    $(".recommend").append(getRecommendHtml(data));
}
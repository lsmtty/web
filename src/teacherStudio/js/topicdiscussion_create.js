function initPage() {
    tsViewtplHelper.initBasicViews(3);

    initStudioInfo();
    initHref();

    titleNum($('.title-input'), $('#titleCount'), 30);

    textHint($('.title-input'));

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

function confirmCreate() {

    var title = $(".title-input").val();
    if (!title) {
        toast("标题不能为空");
        $("#titlecontent").focus();
        return;
    }
    var content = ue.getContent();
    if (!content) {
        toast("内容不能为空");
        return;
    }
    var queryObj = getQueryObj();
    var upLoadURL = studioHost + "/research/save";
    $.ajax({
        type: "post",
        url: upLoadURL,
        data: {
            title: title,
            content: content,
            studioId: queryObj.studioID
        }
    }).success(function () {
        toast('<span class="icon-success"></span>恭喜，发布成功。');
        setTimeout(function () {
            var queryObj = getQueryObj();
            if (queryObj.studioID) {
                location.href = "./topicdiscussion_list.html?studioID=" + queryObj.studioID;
            } else {
                alert("数据异常，请重新登录后操作。");
            }
        }, 1500);
    });
}

function cancleCreate() {
    confirmDialog('取消', '您确定要取消吗？', function () {
        history.go(-1);
    });
}
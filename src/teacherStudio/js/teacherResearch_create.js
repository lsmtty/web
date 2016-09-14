function initPage() {
    tsViewtplHelper.initBasicViews(5);
    initStudioInfo();
    initHref();
    /* 标题字数跟踪 */
    titleNum($('#titlecontent'), $('#titleCount'), 30);
    textHint($('#titlecontent'));
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

function confirmCreate() {
    var title = $("#titlecontent").val();
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
    console.log(content);
    var upLoadURL = studioHost + "/discuss/save";
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
                location.href = "./teacherResearch_list.html?studioID=" + queryObj.studioID;
            } else {
                alert("数据异常，请重新登录后操作。");
            }
        }, 1500);
    }).erro(function () {
        alert("发布失败，请重新发布。");
        window.location.reload();
    });
}

function cancleCreate() {
    confirmDialog('取消', '您确定要取消吗？', function () {
        history.go(-1);
    });
}
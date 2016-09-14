$(function () {

    /* 公共部分加载 */
    function initPage() {
        tsViewtplHelper.initBasicViews(2);
        initHref();
        initStudioInfo();
        initList();
        bindEvent();
    }
    initPage();

    function bindEvent() {
        textHint($('#title-input'));
        $("#confirmbtn").click(confirmCreate);
        $("#canclebtn").click(cancleCreate);
        $('.title-li').click(function () {
            $(this).siblings().removeClass('title-active');
            $(this).addClass('title-active');
        });
    }

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
            });
            userRoleHelper.initUserRole(queryObj.studioID, function () {
                userrole = userRoleHelper.getUserRole(queryObj.studioID);
            });
        }
    }

    function initList() {
        console.log("initList");
        var queryObj = getQueryObj();
        if (queryObj.filetype) {
            switch (queryObj.filetype) {
                case "teachPlan":
                    $("#teachPlan").addClass('title-active');
                    $("#teachPlan").siblings().removeClass('title-active');
                    break;
                case "material":
                    $("#material").addClass('title-active');
                    $("#material").siblings().removeClass('title-active');
                    break;
                case "exercise":
                    $("#exercise").addClass('title-active');
                    $("#exercise").siblings().removeClass('title-active');
                    break;
            }
        }
        tsViewtplHelper.getYearList("yearlist");
        tsViewtplHelper.getSubjcetList("subjectlist");
    }

    /* 标题字数跟踪 */
    titleNum($('#title-input'), $('#nuw-num'), 30);


    /* 点击效果 */
    $('.kind-list').on('click', '.kind-li', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    })

    //验证上传文件格式
    var type = /doc|docx|ppt|pptx|zip|rar|jpg|jpeg|png|bmp|pdf$/;
    $('#file').change(function (event) {
        var str = $(this).val();

        if (!type.test(str)) {
            alert('请选择正确的格式');
            $(this).val('');
            str = '请选择要上传的资料';
        } else {
            str = str.slice(str.lastIndexOf('\\') + 1);
        }
        $('#fileName').val(str);
        $('.file-val').text(str);
    });
});

function confirmCreate() {

    var title = $("#title-input").val();
    if (!title) {
        toast("标题不能为空");
        $("#title-input").focus();
        return;
    }
    $("#inputName").val(title);
    var fileName = $("#fileName").val();
    var file = $("#file").val();
    if (!file) {
        toast("文件不能为空");
        $("#file").focus();
        return;
    }
    $("#confirmbtn").unbind();
    $("#progressbar").removeClass("hidden");

    var subjectId = $("#subjectlist").children(".active").data("id");
    $("#inputsubjectId").val(subjectId);

    var yearid = $("#yearlist").children(".active").data("id");
    $("#inputgradeId").val(yearid);

    var fileType = $(".title-list").children(".title-active").data("filetype");
    $("#inputfileType").val(fileType);

    var queryObj = getQueryObj();
    $("#inputstudioId").val(getQueryObj().studioID);
    var uploadURL = studioHost + "resource/upload";
    var options = {
        url: uploadURL,
        type: 'post',
        success: function (data) {
            $("#progressbar").addClass("hidden");
            toast('<span class="icon-success"></span>恭喜，上传成功。');
            setTimeout(function () {
                var queryObj = getQueryObj();
                if (queryObj.studioID) {
                    location.href = "./teachresource_list.html?studioID=" + queryObj.studioID;
                } else {
                    alert("数据异常，请重新登录后操作。");
                }
            }, 1500);
        },
        error: function (e) {
            $("#progressbar").addClass("hidden");
            toast('<span class="icon-error"></span>上传失败，请重新上传。');
            $("#confirmbtn").click(confirmCreate);
        }
    };
    $("#uploadform").ajaxSubmit(options);
}

function cancleCreate() {
    confirmDialog('取消', '您确定要取消吗？', function () {
        history.go(-1);
    });
}

$(function () {
	tsViewtplHelper.initBasicViews(1);
	commonHelper.initBodyHref();
	tsInfoHelper.initStudioInfo(getQueryObj().studioID, function () {
		var studioInfo = tsInfoHelper.getStudioInfo(getQueryObj().studioID);
		$("#banner-studioName").text(studioInfo.name);

	});
	/* 标题字数跟踪 */
	titleNum($('#title-input'), $('#nuw-num'), 30);
});

function publishArticle() {
	if ($("#title-input").val() == "" || $("#title-input").val() == undefined) {
		alert("请输入文章标题");
	} else if (ue.getContent() == "" || ue.getContent() == undefined) {
		alert("请输入文章内容");
	} else {
		var URL = "" + studioHost + "/article/save";
		$(".btn-1").unbind();
		$.ajax({
			type: "post",
			url: URL,
			dataType: "json",
			data: {
				studioId: '' + getQueryObj().studioID,
				title: '' + $("#title-input").val(),
				content: '' + ue.getContent(),
			},
			async: true
		}).success(function (data) {
			console.log(data);
			if (data.type == "success") {
				toast('<span class="icon-success"></span>恭喜，发布成功。');
				setTimeout(function () {
					var queryObj = getQueryObj();
					if (queryObj.studioID) {
						location.href = "./teaching_article_list.html?studioID=" + queryObj.studioID;
					} else {
						alert("数据异常，请重新登录后操作。");
					}
				}, 1500);
			}
		}).error(function () {
			toast('<span class="icon-error"></span>不好意思，发布失败。');
			setTimeout(function () {
				history.back(-1);
			}, 1500);
		})
	}
}

function cancleCreate() {
	confirmDialog('取消', '您确定要取消吗？', function () {
		history.go(-1);
	});
}
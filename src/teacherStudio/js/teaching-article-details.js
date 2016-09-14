$(function() {
	tsViewtplHelper.initBasicViews(1);
	initHref();
	initStudioInfo();
	getArticle();
	initComment();
});

function initStudioInfo(callback) {
	var queryObj = getQueryObj();
	if(queryObj.studioID) {
		tsInfoHelper.initStudioInfo(queryObj.studioID, function() {
			var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
			$("#banner-studioName").text(studioInfo.name);

		});
		userRoleHelper.initUserRole(queryObj.studioID, function() {
			userrole = userRoleHelper.getUserRole(queryObj.studioID);

		});
		commonHelper.initUserInfo(loadUserInfo);
	}
}

function loadUserInfo(data){
	userInfo = data;
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
}

function initComment() {
	commentInfoHelper.initComment("article");
}

function getArticle() {
	var queryObj = getQueryObj();
	var titleID = queryObj.titleID;
	$.ajax({
		type: 'get',
		url: studioHost + "article/find/" + titleID,
		dataType: 'json'
	}).success(function(data) {
		creater = data.creater;
		if(isCanDelete(creater)) {
			$("#deleteButton").show();
		}
		id = data.id;
		$("#article-title").text(data.title);
		$("#article-content-area").append(data.content);

		$("#author").text(data.sysUser != undefined ? data.sysUser.username : '匿名');
		$("#publish-time").text(data.createTime);
		if(data.prevArticle != null && data.prevArticle.id != null) {
			$("#last-page a").text(data.prevArticle.title);
			$("#last-page a").attr("href", "teaching_article_details.html?titleID=" + data.prevArticle.id + '&studioID=' + getQueryObj().studioID);
		} else {
			$("#last-page").addClass("hidden");
		}
		if(data.nextArticle != null && data.nextArticle.id != null) {
			$("#next-page a").text(data.nextArticle.title);
			$("#next-page a").attr("href", "teaching_article_details.html?titleID=" + data.nextArticle.id + '&studioID=' + getQueryObj().studioID);
		} else {
			$("#next-page").addClass("hidden");
		}
	});
};

function deleteItem(deleteButton) {
	if(isCanDelete(creater)) {
		deleteDialog(function() {
			var deleteurl = studioHost + "/article/del/" + id;
			$.ajax({
				type: "delete",
				url: deleteurl
			}).success(function(data) {
				toast('<span class="icon-success"></span>您已成功删除。');
				setTimeout(function() {
					var queryObj = getQueryObj();
					if(queryObj.studioID) {
						location.href = "./teaching_article_list.html?studioID=" + queryObj.studioID;
					} else {
						alert("数据异常，请重新登录后操作。");
					}
				}, 1500);
			})
		});
	} else {
		alert("您没有权限");
	}
};

function isCanDelete(creater) {
	if(userrole.role == USERROLE.OWNER) {
		return true;
	} else if(userrole.role == USERROLE.MEMBER) {
		var userID = readCookie("guid");
		if(userID == ''){
			userID = userInfo.guid;
		}
		if(creater == userID) {
			return true;
		}
	} else {
		return false;
	}
}
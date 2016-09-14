$(function() {
	tsViewtplHelper.initBasicViews(-1);
	initHref();
	initStudioInfo();
	getArticle();
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

function loadUserInfo(data) {
	userInfo = data;
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
}

function getArticle() {
	var queryObj = getQueryObj();
	var titleID = queryObj.titleID;
	$.ajax({
		type: 'get',
		url: studioHost + "notice/find/" + titleID,
		dataType: 'json'
	}).success(function(data) {
		console.log("notice-detail:" + data.sysUser);
		createId = data.creater;
		if(isCanDelete(createId)) {
			$("#deleteButton").show();
		}
		$("#article-title").text(data.title);
		$("#article-content-area").append(data.content);
		if(data.sysUser != undefined) {
			$("#author").text(data.sysUser.username);
		}
		$("#publish-time").text(data.createTime);
		if(data.prevNotice != null && data.prevNotice.id != null) {
			$("#last-page a").text(data.prevNotice.title);
			$("#last-page a").attr("href", "notice_details.html?titleID=" + data.prevNotice.id + '&studioID=' + getQueryObj().studioID);
		} else {
			$("#last-page").addClass("hidden");
		}
		if(data.nextNotice != null && data.nextNotice.id != null) {
			$("#next-page a").text(data.nextNotice.title);
			$("#next-page a").attr("href", "notice_details.html?titleID=" + data.nextNotice.id + '&studioID=' + getQueryObj().studioID);
		} else {
			$("#next-page").addClass("hidden");
		}
	});
};

function deleteItem(deleteButton) {
	if(isCanDelete(createId)) {
		deleteDialog(function() {
			var deleteurl = studioHost + "/notice/del/" + getQueryObj().titleID;
			$.ajax({
				type: "delete",
				url: deleteurl
			}).success(function(data) {
				toast('<span class="icon-success"></span>已成功删除。');
				setTimeout(function() {
					var queryObj = getQueryObj();
					if(queryObj.studioID) {
						location.href = "./notice_list.html?studioID=" + queryObj.studioID;
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
		if(userID == '') {
			userID = userInfo.guid;
		}
		if(creater == userID) {
			return true;
		}
	} else {
		return false;
	}
}
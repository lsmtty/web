$(function() {
	tsViewtplHelper.initBasicViews(4);
	initHref();
	initStudioInfo();
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
			loadData();
		});
		commonHelper.initUserInfo(loadUserInfo);
	}
}

function loadUserInfo(data) {
	userInfo = data;
}

function loadData() {
	pageClass = getPagingBar(initData);
	initData(0);
	if(canPublish()) {
		$(".upload_right").show();
	}
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
}

function initData(i) {
	var PAGE_COUNT = 15;
	var pagingURL = studioHost + "teacherClass/list/" + getQueryObj().studioID + "/" + PAGE_COUNT + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: pagingURL
	}).success(
		function(data) {
			console.log(data);
			updateClassInfo(data.datalist);
			if(Math.ceil(data.page.totalCount / PAGE_COUNT) != pageClass.getPageSize()) {
				pageClass.reloadPage(Math.ceil(data.page.totalCount / PAGE_COUNT));
			}
		});
}

function canPublish() {
	if(userrole.role == USERROLE.OWNER || userrole.role == USERROLE.MEMBER) {
		return true;
	}
	return false;
}

function updateClassInfo(data) {
	$("#list .dom").each(function() {
		$(this).remove();
	});
	if(data.length == 0) {
		$("#list").append(tsViewtplHelper.getErrorPage());
	} else {
		for(var index in data) {
			var ItemString = '<div class="dom" data-id="' + data[index].id + '" data-creater="' + data[index].sysUser.guid + '"><a  href="class_details.html?studioID=' + getQueryObj().studioID + '&titleID=' + data[index].id + '"><img src="images/class_list_icon.png" /><span>' + data[index].title + '</span></a>' +
				'<a href="class_details.html?studioID=' + getQueryObj().studioID + '&titleID=' + data[index].id + '">' + data[index].sysUser.username + '</a>' + '<div class="delete" onclick="deleteItem(this)">删除</div></div>';
			$("#list").append(ItemString);
		}
		$(".delete").each(function() {
			if(!canDelete($(this).parents(".dom").data("creater"))) {
				$(this).hide();
			}
		});
	}
}

function deleteItem(item) {
	if(canDelete($(item).parents(".dom").data("creater"))) {
		var id = $(item).parents(".dom").data("id");
		deleteDialog(function() {
			$.ajax({
				type: "delete",
				url: "" + studioHost + '/teacherClass/delete/' + id,
				async: true
			}).done(function(data) {
				if(data.type == "success") {
					initData(0);
				} else {
					console.log(data.message);
				}
			});
		});
	} else {
		alert("您没有权限删除");
	}
}

function canDelete(creater) {
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
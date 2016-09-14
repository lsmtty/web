var userrole = {};

function initPage() {
	tsViewtplHelper.initBasicViews(3);
	initHref();
	initStudioInfo();
}
initPage();

function bindEvent() {
	$('.li-delete').click(deleteItem);
}

function initStudioInfo() {
	var queryObj = getQueryObj();
	if(queryObj.studioID) {
		tsInfoHelper.initStudioInfo(queryObj.studioID, function() {
			var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
			$("#banner-studioName").text(studioInfo.name);

		});
		userRoleHelper.initUserRole(queryObj.studioID, function() {
			userrole = userRoleHelper.getUserRole(queryObj.studioID);
			initData();
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

function initData() {
	pageDiscussion = getPagingBar(fn);
	fn(0);
	if(canPublish()) {
		$(".create-topic").removeClass("hidden");
	}
}

function deleteItem() {
	var itemID = $(this).parent().data("id");
	var deleteItem = $(this).parent();
	deleteDialog(function() {
		var deleteurl = studioHost + "/research/del/" + itemID;
		$.ajax({
			type: "delete",
			url: deleteurl
		}).success(function() {
			$(deleteItem).remove();
		});
	});
}

function canPublish() {
	if(userrole.role == USERROLE.OWNER || userrole.role == USERROLE.MEMBER) {
		return true;
	}
	return false;
}

function canDelete(creater) {
	if(userrole.role == USERROLE.OWNER) {
		return true;
	}
	if(userrole.role == USERROLE.MEMBER) {
		var userID = readCookie("guid");
		if(userID == '') {
			userID = userInfo.guid;
		}
		if(creater == userID) {
			return true;
		}
	}
	return false;
}

function updateItemInfo(ItemArray) {
	$("#topic-item-container").empty();
	var queryObj = getQueryObj();
	if(ItemArray.length == 0) {
		$("#topic-item-container").append(tsViewtplHelper.getErrorPage());
		$(".error-page").css({
			"padding-bottom": "10px"
		});
	} else {
		for(var index in ItemArray) {
			var ItemHtmlString = '<ul class="topic-list clearFix" data-id="' + ItemArray[index].id + '">' +
				'<a href="' + './topicdiscussion_details.html?studioID=' + queryObj.studioID + "&titleID=" + ItemArray[index].id + '"><li class="li-prop">' +
				'<span class="li-title">' + ItemArray[index].title + '</span></li></a>' +
				'<li class="li-creator"><span>' + ItemArray[index].sysUser.username + '</span>' +
				'<li class="li-createdate"><span>' + ItemArray[index].createTime + '</span></li>';
			if(canDelete(ItemArray[index].creater)) {
				ItemHtmlString += '<li class="li-delete"><a href="javascript:;"><p class="icon-delete"></p><p>删除</p></a></li></ul>';
			}

			var ItemElement = $(ItemHtmlString);
			$("#topic-item-container").append(ItemElement);
		}
	}
	bindEvent();
}

function fn(i) { //执行的函数
	var queryObj = getQueryObj();
	var studioID = queryObj.studioID;
	var pagingURL = studioHost + "research/queryPage/" + studioID + "/" + PAGE_COUNT + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: pagingURL
	}).success(function(data) {
		updateItemInfo(data.datalist);
		if(Math.ceil(data.page.totalCount / PAGE_COUNT) != pageDiscussion.getPageSize()) {
			pageDiscussion.reloadPage(Math.ceil(data.page.totalCount / PAGE_COUNT));
		}
	});
}
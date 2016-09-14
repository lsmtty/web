var userrole = {};

function initPage() {
	tsViewtplHelper.initBasicViews(5);
	initHref();
	initStudioInfo();
}

initPage();

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
	pageResearch = getPagingBar(fn);
	fn(0);
	if(canPublish()) {
		$("#create-topic").removeClass("hidden");
	}
}

function deleteItem() {
	console.log("delete");
	var itemID = $(this).parent().data("id");
	var deleteItem = $(this).parent();
	deleteDialog(function() {
		var deleteurl = studioHost + "/discuss/del/" + itemID;
		$.ajax({
			type: "delete",
			url: deleteurl
		}).success(function() {
			$(deleteItem).remove();
		});
	});
}

function bindEvent() {
	$('.li-delete').click(deleteItem);
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
				'<a href="' + './teacherResearch_details.html?studioID=' + queryObj.studioID + "&titleID=" + ItemArray[index].id + '"><li class="li-prop">' +
				'<p class="li-title">' + ItemArray[index].title + '</p>' +
				'<p><span class="li-creator">' + ItemArray[index].sysUser.username + '</span><span class="li-date">' + ItemArray[index].createTime + '</span></p></li></a>';
			if(canDelete(ItemArray[index].creater)) {
				ItemHtmlString += '<li class="li-delete"><a href="javascript:;"><p class="icon-delete"></p><p>删除</p></a></li>';
			} else {
				ItemHtmlString += '<li class="li-delete" style = "visibility:hidden;"><p class="icon-delete"></p><p>删除</p></li>';
			}
			ItemHtmlString += '<li class="li-join"><p class="icon-talk-active"></p><p><span>' + ItemArray[index].parNum + '</span><span>人参与讨论</span></p></li></ul>';
			var ItemElement = $(ItemHtmlString);
			$("#topic-item-container").append(ItemElement);
		}
	}
	bindEvent();
}

function fn(i) { //执行的函数    
	var queryObj = getQueryObj();
	var studioID = queryObj.studioID;
	var pagingURL = studioHost + "discuss/queryPage/" + studioID + "/" + PAGE_COUNT + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: pagingURL
	}).success(
		function(data) {
			console.log(data);
			updateItemInfo(data.datalist);
			if(Math.ceil(data.page.totalCount / PAGE_COUNT) != pageResearch.getPageSize()) {
				pageResearch.reloadPage(Math.ceil(data.page.totalCount / PAGE_COUNT));
			}
		})
}
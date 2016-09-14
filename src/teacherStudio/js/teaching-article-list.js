$(function() {
	isLoadPage = false;
	tsViewtplHelper.initBasicViews(1);
	initHref();
	initStudioInfo();
});

function initStudioInfo(callback) {
	var queryObj = getQueryObj();
	if(queryObj.studioID) {
		tsInfoHelper.initStudioInfo(queryObj.studioID, function() {
			var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
			$("#banner-studioName").text(studioInfo.name);
		})
		userRoleHelper.initUserRole(queryObj.studioID, function() {
			userrole = userRoleHelper.getUserRole(queryObj.studioID);
			initData();
		})
		commonHelper.initUserInfo(loadUserInfo);
	}
}

function loadUserInfo(data){
	userInfo = data;
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
};

function initData() {
	pageArticle = getPagingBar(updateData);
	updateData(0);
	if(canPublish()) {
		$("#publish_article").show();
		$("#publish-send-icon").show();
	}
};

function updateData(i) {
	var titleID = getQueryObj().studioID;
	var pagingURL = studioHost + "article/queryPage/" + titleID + "/" + PAGE_COUNT + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: pagingURL
	}).success(
		function(data) {
			console.log(data);
			updateArticleInfo(data.datalist);
			if(Math.ceil(data.page.totalCount / PAGE_COUNT) != pageArticle.getPageSize()) {
				pageArticle.reloadPage(Math.ceil(data.page.totalCount / PAGE_COUNT));
			}
		});
}

function updateArticleInfo(ItemArray) {
	$(".news-list").empty();
	if(ItemArray.length != 0) {
		for(var index in ItemArray) {
			var articleString = '<li class="news-list-item" data-id="' + ItemArray[index].id + '" data-creater="' + ItemArray[index].creater + '">' +
				'<span class="article-name"><a href="' + 'teaching_article_details.html?titleID=' + ItemArray[index].id + '&studioID=' + getQueryObj().studioID + '">' + ItemArray[index].title +
				'</a></span><span class="article-author">';
			if(ItemArray[index].sysUser != undefined) {
				articleString += '' + ItemArray[index].sysUser.username + '</span>';
			} else {
				articleString += '' + '</span>';
			}
			articleString += '<span class="news-publish-time">' + ItemArray[index].createTime + '</span><div class="delete-area" onclick="deleteItem(this);"><div class="icon-delete"></div><span>删除</span></div></li>';
			var ItemElement = $(articleString);
			$(".news-list").append(ItemElement);
		}
		$(".delete-area").each(function() {
			if(!canDelete($(this).parent().data("creater"))) {
				$(this).hide();
			}
		});
		commonHelper.initBodyHref();
	} else {
		$(".news-list").append(tsViewtplHelper.getErrorPage());
	}

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

function deleteItem(item) {
	var itemID = $(item).parent().data("id");
	if(canDelete($(item).parent().data("creater"))) {
		var deleteItem = $(item).parent();
		deleteDialog(function() {
			var deleteurl = studioHost + "/article/del/" + itemID;
			$.ajax({
				type: "delete",
				url: deleteurl
			}).success(function(data) {
				$(deleteItem).remove();
				
			})
		});
	} else {
		alert("您没有权限");
	}

}

function confirmCreate() {
	$("#titlecontent").val();
}

function cancleCreate() {
	confirmDialog('取消', '您确定要取消吗？', function() {
		history.go(-1);
	});
}
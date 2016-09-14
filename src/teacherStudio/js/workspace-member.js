$(function() {
	tsViewtplHelper.initBasicViews(0);
	initHref();
	initStudioInfo();
	var checkID = getQueryObj().checkID;
	var checkID = getQueryObj().checkID == undefined ? 0 : getQueryObj().checkID;
	initData();
	checkTab(checkID);
	initTitleItemClick(".theme-small-title", "#workspace-member-content", ".tab-item", "blue-title-item", "gray-title-item");
	$("#paging").css({
		"border-top": "none"
	});
});

function initStudioInfo(callback) {
	var queryObj = getQueryObj();
	if(queryObj.studioID) {
		tsInfoHelper.initStudioInfo(queryObj.studioID, function() {
			var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
			$("#banner-studioName").text(studioInfo.name);
		})
	}
}

function initData() {
	pageMembers = getPagingBar(updateMember, "paging1");
	pageFans = getPagingBar(updateFans, "paging2");
	updateMember(0);
	updateFans(0);
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
};

function checkTab(checkID) {
	$(".theme-small-title").each(function(index) {
		if(index == checkID) {
			$(this).addClass("blue-title-item");
		} else {
			$(this).addClass("gray-title-item");
		}
	});
	$(".tab-item").each(function(index) {
		if(index == checkID) {
			$(this).show();
		} else {
			$(this).hide();
		}
	});
}

function updateMember(i) {
	var PAGE_SIZE = 8;
	var memberURL = studioHost + "member/queryPage/" + getQueryObj().studioID + "/" + PAGE_SIZE + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: memberURL
	}).success(
		function(data) {
			updateInfo(data.datalist, 1);
			if(Math.ceil(data.page.totalCount / PAGE_SIZE) != pageMembers.getPageSize()) {
				pageMembers.reloadPage(Math.ceil(data.page.totalCount / PAGE_SIZE));
			}
		});
}

function updateFans(i) {
	var PAGE_SIZE = 8;
	var attentionURL = studioHost + "attention/queryPage/" + getQueryObj().studioID + "/" + PAGE_SIZE + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: attentionURL
	}).success(
		function(data) {
			updateInfo(data.datalist, 2);
			if(Math.ceil(data.page.totalCount / PAGE_SIZE) != pageFans.getPageSize()) {
				pageFans.reloadPage(Math.ceil(data.page.totalCount / PAGE_SIZE));
			}
		});
}

function updateInfo(ItemArray, type) {
	if(type == 1) {
		$("#workspace-member-area").empty();
	} else {
		$("#workspace-fans-area").empty();
	}
	if(ItemArray.length == 0) {
		if(type==1){
			$("#workspace-member-area").append(tsViewtplHelper.getErrorPage());
		}else{
			$("#workspace-fans-area").append(tsViewtplHelper.getErrorPage());
		}
	} else {
		for(var index in ItemArray) {
			var MemberHtmlString = '<li class="news-list-item"><a href="' + ItemArray[index].sysUser.rrtUrl + '"><div><img src = "' + ItemArray[index].sysUser.avatar + '"/>' +
				'<div class="member-details"><span class="member-name">' + ItemArray[index].sysUser.username + '</span></div></div></a><span class="news-publish-time" style="margin-right:20px;">' + ItemArray[index].createTime;
			MemberHtmlString += '</span></li>';
			var ItemElement = $(MemberHtmlString);
			if(type == 1) {
				$("#workspace-member-area").append(ItemElement);
			} else {
				$("#workspace-fans-area").append(ItemElement);
			}
		}
	}
}

function initPaging(pageCount, type) {
	if(type == 1) {
		if(pageCount <= 0) {
			$("#content-page1 #paging").addClass("hidden");
		} else {
			$("#content-page1 #paging").removeClass("hidden");
			pagingFn(pageCount, updateMember);
		}
	} else {
		if(pageCount <= 0) {
			$("#content-page1 #paging").addClass("hidden");
		} else {
			$("#paging").removeClass("hidden");
			pagingFn(pageCount, updateFans);
		}
	}
}
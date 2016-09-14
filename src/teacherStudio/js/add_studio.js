function initPage() {
	tsViewtplHelper.initBasicViews();
	setHeader();
	initHref();
	pageStudio = getPagingBar(initStudioData);
	initStudioData(0);
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
};

function setHeader() {
	var queryObj = getQueryObj();
	if(queryObj.neednav == 'no') {
		$(".banner img").attr("src", "./images/banner-workspace.png");
		$("#contentNav").addClass("hidden");
	}
}
initPage();

function initStudioData(i) {
	var url = studioHost + "studio/queryPageByMember/" + PAGE_COUNT + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: url
	}).success(function(data) {
		updateInfo(data.datalist);
		if(Math.ceil(data.page.totalCount / PAGE_COUNT) != pageStudio.getPageSize()) {
			pageStudio.reloadPage(Math.ceil(data.page.totalCount / PAGE_COUNT));
		}
	});
}

/*function queryStudio(i) {
	var url = studioHost + "studio/queryPageByMember/" + PAGE_COUNT + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: url
	}).success(function(data) {
		updateInfo(data.datalist);
	});
}*/

function updateInfo(ItemArray) {

	$("#list_studio_div").empty();
	if(ItemArray.length == 0) {
		$("#list_studio_div").append(tsViewtplHelper.getErrorPage());
	} else {
		for(var index in ItemArray) {
			var studio = ItemArray[index];
			var MemberHtmlString =
				'<ul class="item-list clearFix" data-studioid="' + studio.id + '">' +
				'    <a href="workspace_index.html?studioID=' + studio.id + '">' +
				'        <li class="li-props">' +
				'            <img src="' + studio.icon + '" class="avatar"></img>' +
				'            <p class="item-name">' + studio.name + '</p>' +
				'            <p class="item-shcool gray-text"><span>创建者:</span><span>' + studio.sysUser.username + '</span></p>' +
				'        </li>' +
				'    </a>' +
				'    <li class = "li-quit" onclick="quitStudio(' + studio.id + ');">' +
				'        <span>退出</span>' +
				'    </li>' +
				'</ul>';
			var ItemElement = $(MemberHtmlString);
			$("#list_studio_div").append(ItemElement);
		}
	}
}

function quitStudio(studioId) {

	confirmDialog('退出', '您确定要退出吗？', function() {
		var url = studioHost + "studio/quit/" + studioId;
		$.ajax({
			type: 'delete',
			url: url
		}).success(function(data) {
			if(data.type == "success") {
				toast('<span class="icon-success"></span>退出成功。');
				setTimeout(initPage, 1500);
			} else {
				toast('<span class="icon-error"></span>退出失败。');
			}
		});
	});
}
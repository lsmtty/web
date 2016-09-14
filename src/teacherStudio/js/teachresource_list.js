/* shihao 2016/7/6 */
$(function() {

	/* 底部自适应 */
	winChange($('#content'), 0, 430);
	$(window).resize(function(event) {
		winChange($('#content'), 0, 430);
	});

	var userrole = {};

	function initPage() {
		tsViewtplHelper.initBasicViews(2);
		initHref();
		initStudioInfo();
		$("#create-topic").click(createUpload);
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

	function createUpload() {
		var queryObj = getQueryObj();
		var fileType = $(".title-list").children(".title-active").data("filetype");
		location.href = "teachresource_upload.html?studioID=" + queryObj.studioID + "&filetype=" + fileType;
	}

	function initHref() {
		commonHelper.initBreadNav();
		//commonHelper.initBodyHref();
	}

	function initData() {
		pageResource = getPagingBar(fn);
		fn(0);
		if(canPublish()) {
			$("#create-topic").removeClass("hidden");
		}
	}

	function initBindEvent() {
		$('a[name="td-delete"]').click(deleteItem);
		$('a[name="td-download"]').click(downloadItem);
	}

	function deleteItem() {
		var deleteItem = $(this).parents("tr");
		var itemID = $(deleteItem).data("id");
		deleteDialog(function() {
			var deleteurl = studioHost + "resource/delete/" + itemID;
			$.ajax({
				type: "delete",
				url: deleteurl
			}).success(function() {
				$(deleteItem).remove();
			});
		});
	}

	function downloadFile(url) {
		window.location = url;
	}

	function downloadItem() {
		var itemID = $(this).parents("tr").data("id");
		var downloadURL = studioHost + "resource/" + itemID;
		$.ajax({
			type: 'get',
			url: downloadURL
		}).success(function(data) {
			downloadFile(data.downloadUrl);
		}).error(function() {
			toast('<span class="icon-error"></span>下载失败。');
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

	function getResourceData(index, fileType) {
		var queryObj = getQueryObj();
		var resourceURL = studioHost + "resource/list/" + queryObj.studioID + "/" + fileType + "/" + PAGE_COUNT + "/" + index;
		$.ajax({
			type: "get",
			url: resourceURL
		}).success(function(data) {
			updataResourceListHtml(data);
		})
	}

	function updataResourceListHtml(data) {
		$(".tbody").empty();
		$(".tbody").html(getResourceItemHtml(data.datalist));
		pageResource.reloadPage(Math.ceil(data.page.totalCount / PAGE_COUNT));
		initBindEvent();
	}

	function getResourceItemHtml(data) {
		console.log(data);
		var html = "";
		if(data.length == 0) {
			return tsViewtplHelper.getErrorPage();
		}
		var queryObj = getQueryObj();
		for(var index = 0; index < data.length; index++) {
			html = html + '<tr data-id = "' + data[index].id + '">' +
				'<td class="file-title hide-text">' +
				'<span class="' + tsInfoHelper.getTypeIcon(data[index].fileFormat) + '"></span>' +
				'<a href="./teachresource_details.html?studioID=' + queryObj.studioID + "&titleID=" + data[index].id + '">' + data[index].title + '</a>' +
				'</td>' +
				'<td>' + data[index].fileFormat + '</td>' +
				'<td class="file-name hide-text">' + data[index].sysUser.username + '</td>' +
				'<td class="gray-text">' + data[index].uploadTime + '</td><td>';
			if(userrole.role == USERROLE.OWNER || userrole.role == USERROLE.MEMBER) {
				html += '<a class="gray-text font-12" href="javascript:;" name = "td-download"><span class="icon-down"></span><br/>下载</a>';
			}
			if(canDelete(data[index].sysUser.guid)) {
				html += '</td><td><a class="gray-text font-12" href="javascript:;" name = "td-delete"><span class="icon-delete"></span><br/>删除</a>';
			}
			html += '</td></tr>';
		}
		return html;
	}

	/* 选择加载资源 */
	$('.title-li').click(function() {
		$(this).siblings().removeClass('title-active');
		$(this).addClass('title-active');
		getResourceData(1, $(this).data("filetype"));
	});

	//分页
	function fn(i) {
		var fileType = $(".title-list").children(".title-active").data("filetype");
		getResourceData(i + 1, fileType);
	}
	//pagingFn(15, 5, fn);
});
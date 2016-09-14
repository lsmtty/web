$(function() {
	(function() {
		var PAGE_COUNT = 6;
	})();
	tsViewtplHelper.initBasicViews(0);
	commonHelper.updateStudioTraffic();
	initHref();
	initStudioInfo();
	initStudioMessage();
	uploadData();
	initTitleItemClick();
});

function initStudioInfo() {
	var queryObj = getQueryObj();
	if(queryObj.studioID) {
		tsInfoHelper.initStudioInfo(queryObj.studioID, function() {
			studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
			$("#banner-studioName").text(studioInfo.name);
			console.log(studioInfo.name);
		});

		userRoleHelper.initUserRole(queryObj.studioID, function() {
			userRole = userRoleHelper.getUserRole(queryObj.studioID);
			console.log(userRole);
		});
	}
}

function initStudioMessage() {
	$.ajax({
		type: 'get',
		url: studioHost + 'home/loadStudio/' + getQueryObj().studioID,
		dataType: 'json'
	}).success(function(data) {
		console.log(data);
		if(data.sysUser.avatar !== null) {
			$("#creater-icon").attr({
				"data-original": data.sysUser.avatar
			});
			$("#creater-icon").parents("a").attr({
				"href": data.sysUser.rrtUrl
			});
		} else {
			$("#creater-icon").attr({
				"data-original": "images/user-pic-default.jpg"
			});
		}

		$("#workspace-member-top #workspace-message-name span:first-of-type").text(data.sysUser.username);
		if(data.propaganda !== null) {
			$("#workspace-topic-pic").attr({
				"data-original": data.propaganda
			});
		} else {
			$("#workspace-topic-pic").attr({
				"data-original": "images/class.jpg"
			});
		}
		$("#workspace-message").empty();
		$("#workspace-message").append(tsViewtplHelper.createStudioInfohtml(data));
		$("img.lazy").lazyload({
			effect: "fadeIn",
			failure_limit: 5
		});
		getRelation(showRelationMessage);
	});
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
}

function uploadData() {
	uploadWorkingSpaceMember();
	uploadWorkingSpaceRecommend();
	uploadTopics();
	uploadClasses();
	/*uploadTeachingResources();*/
	uploadTeachingResourcesTabs();
	uploadTeachingReaserchs();
	uploadTeachingDiscussions();
	uploadTeachingArticles();
}

function uploadWorkingSpaceMember() {
	var URL = studioHost + "home/loadMember/" + getQueryObj().studioID + "/" + 6 + "/";
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log("member:" + data);
			updateItemInfo(data, 1);
		});
}

function uploadWorkingSpaceRecommend() {
	var URL = studioHost + "home/recomStudio/" + getQueryObj().studioID + "/" + 5 + "/";
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log("recommentStudio:" + data);
			updateItemInfo(data, 2);
		});
}

function uploadTopics() {
	var URL = studioHost + "home/loadNotice/" + getQueryObj().studioID + "/" + 5 + "/";
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log(data);
			updateItemInfo(data, 3);
		});
}

function uploadClasses() {
	var URL = studioHost + "home/teacherClass/" + getQueryObj().studioID + "/" + 3 + "/";
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log(data);
			updateItemInfo(data, 4);
		});
}

function uploadTeachingResources() {
	var URL = studioHost + "discuss/queryPage/" + getQueryObj().studioID + "/" + PAGE_COUNT + "/" + (i + 1);
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log(data);
			updateItemInfo(data.datalist, 5);
		});
}

function uploadTeachingReaserchs() {
	var URL = studioHost + "home/loadResearch/" + getQueryObj().studioID + "/" + 5 + "/";
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log(data);
			updateItemInfo(data, 6);
		});
}

function uploadTeachingDiscussions() {
	var URL = studioHost + "home/loadDiscuss/" + getQueryObj().studioID + "/" + 5 + "/";
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log(data);
			updateItemInfo(data, 7);
		});
}

function uploadTeachingArticles() {
	var URL = studioHost + "home/loadArticle/" + getQueryObj().studioID + "/" + 10 + "/";
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log(data);
			updateItemInfo(data, 8);
		});
}

function uploadTeachingResourcesTabs() {
	var URL = studioHost + "home/resource/" + getQueryObj().studioID + "/" + 10 + "/";
	$.ajax({
		type: 'get',
		url: URL,
		dataType: 'json'
	}).success(
		function(data) {
			console.log(data);
			updateItemInfo(data, 9);
		});
}

function initTitleItemClick() {
	$(".theme-small-title").click(function() {
		if($(this).hasClass("blue-title-item")) {
			return;
		} else {
			$(this).addClass("blue-title-item").removeClass("gray-title-item");
			$(this).siblings().each(function() {
				$(this).addClass("gray-title-item");
			});
		}
		var newsBlockList = $(this).parents("#workspace-resources").children();
		for(var i = 1; i < newsBlockList.length; i++) {
			if(i == ($(this).index() + 1)) {
				$(newsBlockList[i]).show();
			} else {
				$(newsBlockList[i]).hide();
			}
		}
		var thisLi = $(this).index();
		$(this).parent().children("li").each(function(index) {
			if(index != thisLi) {
				$(this).removeClass("blue-title-item");
			}
		});
	});
}

function displayWorkspaceMember() {
	$(".workspace-member-item").each(function(index) {
		if(index % 3 == 1) {
			$(this).css({
				"margin": "14px 20px 0px 20px"
			});
		}
	});
}

function displayWorkspaceRecommend() {
	$(".workspace-recommend:eq(0)").css({
		"padding-top": "0px"
	});
}

function initMessageDetail() {
	$(".workspace-message-item").each(function(index) {
		if($(this).hasClass("item-blue")) {
			var countChild = $(this).children("span").eq(0);
			$(countChild).css({
				"cursor": "pointer"
			});
			if(index === 0) {
				$(countChild).click(function() {
					alert("显示成员更多");
				});
			} else {
				$(countChild).click(function() {
					alert("显示粉丝更多");
				});
			}
		}
	});
}

function getDataTime(time) {
	return time.substring(0, 10);
}

//事件处理
function memberClick() {
	var itemId = $(this).data("id");
}

function recommendDetailClick() {
	var itemId = $(this).parents(".workspace-recommend:eq(0)").data("id");
	window.location.href = "workspace_index.html?studioID=" + itemId;
}

function workspaceAttentionClick() {
	if($(this).attr("value") == "关注") {
		var itemId = $(this).parents(".workspace-recommend:eq(0)").data("id");
		getRelation(attentionStudio, itemId, "recommend-" + itemId);
	}
}

function classVideoClick() {
	var id = $(this).parents(".classes-video-area:eq(0)").data("id");
	window.location.href = "class_details.html?studioID=" + getQueryObj().studioID + "&titleID=" + id;
}

/**
 * 判断是否可以申请加入
 * @param {Object} data
 */
function judgeIfCanEnter(relation) {
	if(relation == 1) {
		alert("请先登录"); // 调用登录模块
	} else if(relation == 2 || relation == 3) {
		enterStudio();
	}
}

/**
 * 显示用户与页面主工作室身份相关的信息
 * @param {Object} data
 */
function showRelationMessage(relation) {
	if(relation != 1 && relation != 2 && relation != 3) {
		hideEnterButton();
	}
	if(userRole.role == USERROLE.OWNER) {
		$("#follow").val("已创建").removeClass("notice-button-attention").addClass("notice-button-attentioned");
	} else if(userRole.role == USERROLE.MEMBER) {
		$("#follow").val("已加入").removeClass("notice-button-attention").addClass("notice-button-attentioned");
	} else if(userRole.role == USERROLE.APPLICATION) {
		$("#follow").val("申请中").removeClass("notice-button-attention").addClass("notice-button-attentioned");
	} else if(userRole.follow) {
		$("#follow").val("已关注").removeClass("notice-button-attention").addClass("notice-button-attentioned");
	}
	$("#follow").click(function() {
		attentionStudio(relation, getQueryObj().studioID, "follow");
	});
}

/**
 * 获取用户与工作室关系
 */
function getRelation(callBack, studioID, inputId) {
	var studioid;
	if(studioID !== null && studioID !== undefined) {
		studioid = studioID;
	} else {
		studioid = getQueryObj().studioID;
	}
	$.ajax({
		dataType: 'json',
		type: 'get',
		url: studioHost + 'home/studioRelation/' + studioid
	}).success(function(data) {
		if(typeof callBack == 'function') {
			callBack(data.relation, studioID, inputId);
		}
	})
}

/**
 * 关注工作室
 * @param {Object} relation
 * @param {Object} studioID
 * @param {Object} id  input 的 id
 */
function attentionStudio(relation, studioID, id) {
	if(relation == 1) {
		alert("请先登录");
	} else if(relation == 2 || relation == 5) {
		$.ajax({
			dataType: 'json',
			type: 'post',
			data: {
				"studioId": studioID
			},
			url: studioHost + '/attention/save'
		}).success(function(data) {
			console.log("requestEnter:" + data.message);
			if(data.type == "success") {
				toast('<span class="icon-success"></span>关注成功');
				$("#" + id).val("已关注").removeClass("notice-button-attention").addClass("notice-button-attentioned");
				if(id === 'follow') {
					$("#fans-count").text(parseInt($("#fans-count").text()) + 1);
				}
			} else {
				toast('<span class="icon-error"></span>关注失败');
			}
		})
	}
}

/**
 * 申请加入工作室
 */
function enterStudio() {
	$.ajax({
		dataType: 'json',
		type: 'post',
		data: {
			"studioId": getQueryObj().studioID
		},
		url: studioHost + '/apply/save'
	}).success(function(data) {
		toast('<span class="icon-success"></span>申请成功');
		hideEnterButton();
		$("#follow").val("申请中").removeClass("notice-button-attention").addClass("notice-button-attentioned");
	}).error(function() {
		toast('<span class="icon-error"></span>申请失败');
	})
}

/**
 * 隐藏申请加入按钮
 */
function hideEnterButton() {
	$("#enter-workspace").hide();
	$("#workspace-message").css({
		"height": "135px"
	});
}
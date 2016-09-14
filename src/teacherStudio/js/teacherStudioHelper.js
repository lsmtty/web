window.tsInfoHelper = window.tsInfoHelper || {};
(function (scope) {
	"use strict";
	var studiosInfo = [];

	function getStudioinfofromServer(studioID, callback) {
		var studioInfoURL = studioHost + "studio/find/" + studioID;
		$.ajax({
			type: 'get',
			url: studioInfoURL
		}).success(function (data) {
			setStudiosInfo(studioID, data);
			callback();
		});
	}

	function setStudiosInfo(studioID, data) {
		studiosInfo[studioID] = data;
	}

	function initStudioInfo(studioID, callback) {
		if (studiosInfo.length) {
			if (!(studioID in studiosInfo)) {
				getStudioinfofromServer(studioID, callback);
			} else {
				callback();
			}
		} else {
			getStudioinfofromServer(studioID, callback);
		}
	}

	function getStudioInfo(studioID) {
		return studiosInfo[studioID];
	}
	/**
	 * 获得资源类型图标的类名
	 * @param {Object} type
	 */
	function getTypeIcon(type) {
		switch (type) {
			case 'png':
			case 'jpg':
			case 'bmp':
			case 'jpeg':
				return 'icon-pic-small';
			case 'rar':
				return 'icon-rar-small';
			case 'zip':
				return 'icon-zip-small';
			case 'pdf':
				return 'icon-pdf-small';
			case 'doc':
			case 'docx':
				return 'icon-word-small';
			case 'ppt':
			case 'pptx':
				return 'icon-ppt-small';
			default:
				console.log("未知类型");
				return 'icon-word-small';
		}
	}
	scope.getTypeIcon = getTypeIcon;
	scope.initStudioInfo = initStudioInfo;
	scope.getStudioInfo = getStudioInfo;

})(window.tsInfoHelper);

var USERROLE = {
	OWNER: 0,
	MEMBER: 1,
	FOLLOW: 2,
	APPLICATION: 3,
	NONE: 4,
	GUEST: 5
};

window.userRoleHelper = window.userRoleHelper || {};
(function (scope) {
	var userRoleData = [];

	function initUserRole(studioID, callback) {
		var studioRelationURL = studioHost + "home/studioRelation/" + studioID;
		$.ajax({
			type: "get",
			url: studioRelationURL
		}).success(function (data) {
			userRoleData[studioID] = data;
			callback();
		});
	}

	function getUserRolebyrelationID(relationID) {
		var userrole = {
			'role': USERROLE.GUEST,
			'follow': false
		};
		if (relationID == 3 || relationID == 7 || relationID == 6)
			userrole.follow = true;
		if (relationID == 8)
			userrole.role = USERROLE.OWNER;
		if (relationID == 4 || relationID == 7)
			userrole.role = USERROLE.MEMBER;
		if (relationID == 2)
			userrole.role = USERROLE.NONE;
		if (relationID == 1)
			userrole.role = USERROLE.GUEST;
		if (relationID == 5 || relationID == 6)
			userrole.role = USERROLE.APPLICATION;
		return userrole;
	}

	function getUserRole(studioID) {

		return getUserRolebyrelationID(userRoleData[studioID].relation);
	}

	function clearUserRole() {
		userRoleData = [];
	}
	scope.initUserRole = initUserRole;
	scope.getUserRole = getUserRole;
	scope.getUserRolebyrelationID = getUserRolebyrelationID;
	scope.clearUserRole = clearUserRole;

})(window.userRoleHelper);

window.commentInfoHelper = window.commentInfoHelper || {};

(function (scope) {
	var commentType = "";

	function getCommentHtml() {
		var commentHtml = '<h3 class="title blue-text"><h3 class="title blue-text">写评论</h3>' +
			'<div class="write-comment"><div><textarea class="textarea" placeholder="我也来评论一句"></textarea>' +
			'<p class="btn-box" id = "btn-box"><a href="javascript:;" class="btn">发表</a></p></div>' +
			'<h3 class="title blue-text">最新评论</h3>' +
			'<ul class="comment-list">' +
			'</ul></div>';
		return commentHtml;
	}

	function getPositionHtml() {
		var Html = '<div id = "bottom"></div>';
		return Html;
	}

	function getTopElement(e, tagName) {
		var elemList = e.parents(tagName);
		var count = elemList.length;
		if (count < 1)
			return null;
		return elemList[count - 1];
	}

	function publish(e) {
		var commentContent = e.parent().prev().val();
		if (commentContent.length < 1) {
			toast('<span class="icon-error"></span>发布的内容不能为空');
			$(".clear-textarea").focus();
			return;
		}

		var commentUrl = studioHost + "comment";
		var queryObj = getQueryObj();
		var topLiEle = getTopElement(e, "li");
		var parentID = 0;
		var parentUserID = 0;
		if (topLiEle) {
			parentID = $(topLiEle).data("id");
			parentUserID = $(topLiEle).data("userid");
		}
		$.ajax({
			type: 'post',
			url: commentUrl,
			data: {
				content: commentContent,
				mainId: queryObj.titleID,
				mainType: commentType,
				parentId: parentID,
				onUser: parentUserID
			}
		}).success(function (data) {
			initCommentInfo();
		}).error(function (e) {
			if (e.status === 401) {
				toast("请登录后再发表评论");
			}
		});
		claerText();
		if (parentID === 0) {
			$("html,body").animate({
				scrollTop: $("#bottom").offset().top
			}, 1000);
		}
	}

	function deleteComment(e) {
		console.log(e);
		var commentID = e.closest("li").data("id");
		var deleteUrl = studioHost + "comment/" + commentID;
		$.ajax({
			type: 'delete',
			url: deleteUrl
		}).success(function () {

		});
		e.closest("li").remove();
	}

	function initCommentInfo() {
		var queryObj = getQueryObj();
		var commentUrl = '';
		commentUrl = studioHost + "comment/" + queryObj.titleID + "/" + commentType;
		$.ajax({
			type: 'get',
			url: commentUrl
		}).success(function (data) {
			console.log(data);
			setCommentHtml(data);
		});
	}

	function getCommentListHtml(data) {
		var commentHtml = "";
		for (var index = 0; index < data.length; index++) {
			commentHtml += getCommentListItemHtml(data[index]);
		}
		return commentHtml;
	}

	function getCommentListItemHtml(data) {
		var commentItemHtml = '<li class="comment-li" data-userid = "' + data.sysUser.guid + '" data-id = "' + data.id + '">' +
			'<a class="user-pic" href="' + data.sysUser.rrtUrl + '">' +
			'<img src="' + data.sysUser.avatar + '" alt="">' +
			'</a>' +
			'<div class="comment-msg clearFix">' +
			'<div class="message"><p>' +
			'<a class="reply-name user-name" href="javascript:;">' + data.sysUser.username + '</a>&nbsp;&nbsp;<span>' + data.content + '</span>' +
			'</p><p class="gray-text">' +
			'<span class="inline">' + data.createTime + '</span>' +
			'<a class="inline icon-reply-active" key="1" href="JavaScript:;">' +
			'<span class="reply-bj">回复</span>' +
			'</a>' +
			'<a class="inline icon-delete-active" href="javascript:;"></a>' +
			'</p></div></div>' +
			'<div class="write-comment" style="display: none;">' +
			'<textarea class="textarea">回复' + data.sysUser.username + '</textarea>' +
			'<p class="btn-box"><a class="btn" href="javascript:;">发表</a></p>' +
			'</div>';

		for (var index = 0; index < data.child.length; index++) {
			commentItemHtml += getChildCommentListItemHtml(data.child[index]);
		}
		commentItemHtml += '</li>';
		return commentItemHtml;
	}

	function getChildCommentListItemHtml(data) {
		var commentItemHtml = '<ul><li class="comment-li" data-userid = "' + data.sysUser.guid + '" data-id = "' + data.id + '">' +
			'<a class="user-pic" href="' + data.sysUser.rrtUrl + '">' +
			'<img src="' + data.sysUser.avatar + '" alt="">' +
			'</a>' +
			'<div class="comment-msg clearFix">' +
			'<div class="message"><p>' +
			'<a class="reply-name user-name" href="javascript:;">' + data.sysUser.username + '</a>回复&nbsp;&nbsp;<a class="user-name" href="' + data.onUserInfo.rrtUrl + '">' + data.onUserInfo.username + '</a>:&nbsp;&nbsp;<span>' + data.content + '</span>' +
			'</p><p class="gray-text">' +
			'<span class="inline">' + data.createTime + '</span>' +
			'<a class="inline icon-reply-active" key="1" href="JavaScript:;">' +
			'<span class="reply-bj">回复</span>' +
			'</a>' +
			'<a class="inline icon-delete-active" href="javascript:;"></a>' +
			'</p></div></div>' +
			'<div class="write-comment" style="display: none;">' +
			'<textarea class="textarea">回复 ' + data.sysUser.username + '</textarea>' +
			'<p class="btn-box"><a class="btn" href="javascript:;">发表</a></p>' +
			'</div>' +
			'</li></ul>';
		return commentItemHtml;
	}

	//还原回复框
	function claerText() {
		$('.textarea', '#comment-box').each(function (index) {
			$(this).removeClass('clear-textarea');
			var reply_name = $(this).parent().parent().parent().find('.reply-name').html();
			if (index) {
				$(this).val('回复 ' + reply_name);
			} else {
				$(this).val('我也来评论一句');
			}
		});
	}

	function showCommentBox() {
		$(this).closest("li").children(".write-comment").css("display", "block");
		$(this).unbind("click");
		$(this).click(hiddenCommentBox);
	}

	function hiddenCommentBox() {
		$(this).closest("li").children(".write-comment").css("display", "none");
		$(this).unbind("click");
		$(this).click(showCommentBox);
	}

	function bindCommentEvent() {
		// 点击回复
		$('#comment-box .icon-reply-active').click(showCommentBox);

		// 回复框点击
		$('#comment-box').on('click', '.textarea', function () {
			claerText();
			$(this).addClass('clear-textarea').val('');
		});
		$(".btn").unbind().bind("click", function () {
			publish($(this));
		});

		$("#comment-box .icon-delete-active").click(function () {
			deleteComment($(this));
		});
	}

	function setCommentHtml(data) {
		$(".comment-list").empty();
		$(".comment-list").append($(getCommentListHtml(data.datalist)));
		$("#comment-box").append($(getPositionHtml()));
		bindCommentEvent();
	}

	function initComment(mainType) {
		commentType = mainType;
		$("#comment-box").empty();
		$("#comment-box").append($(getCommentHtml()));
		initCommentInfo();
	}

	scope.initComment = initComment;

})(window.commentInfoHelper);

window.commonHelper = window.commonHeler || {};

(function (scope) {
	function getURLQueryStr(key, value, urlvalue) {
		var href = urlvalue;
		if (urlvalue && urlvalue !== null && urlvalue !== undefined) {
			if (urlvalue.indexOf(".html") > 0 && urlvalue.indexOf(key) < 0) {
				if (urlvalue.indexOf("?") > 0) {
					href += "&" + key + "=" + value;
				} else {
					href += "?" + key + "=" + value;
				}
			}
		}
		return href;
	}

	function initBreadNav() {
		var queryObj = getQueryObj();
		$(".breadcrumbNav a").each(function () {
			var href = $(this).attr("href");
			$(this).attr("href", getURLQueryStr("studioID", queryObj.studioID, href));
		});
	}

	function initBodyHref() {
		var queryObj = getQueryObj();
		$(".maincontent a").each(function () {
			var href = $(this).attr("href");
			$(this).attr("href", getURLQueryStr("studioID", queryObj.studioID, href));
		});
		$(".main-content a").each(function () {
			var href = $(this).attr("href");
			$(this).attr("href", getURLQueryStr("studioID", queryObj.studioID, href));
		});
		$("#main-content a").each(function () {
			var href = $(this).attr("href");
			$(this).attr("href", getURLQueryStr("studioID", queryObj.studioID, href));
		});
		$("#content-center a").each(function () {
			var href = $(this).attr("href");
			$(this).attr("href", getURLQueryStr("studioID", queryObj.studioID, href));
		});
		$("#middle-content a").each(function () {
			var href = $(this).attr("href");
			$(this).attr("href", getURLQueryStr("studioID", queryObj.studioID, href));
		});
		$("#content a").each(function () {
			var href = $(this).attr("href");
			$(this).attr("href", getURLQueryStr("studioID", queryObj.studioID, href));
		});
	}

	function replaceTitleID(titleID) {
		var curHref = location.href;
		curHref = curHref.split(/titleID/);
		curHref = curHref[0] + "titleID=" + titleID;
		return curHref;
	}

	function updateStudioTraffic() {
		var queryObj = getQueryObj();

		if (queryObj.studioID) {
			var studioTrafficURL = studioHost + "studio/visit/" + queryObj.studioID;
			$.ajax({
				type: "put",
				url: studioTrafficURL
			});
		} else {

		}
	}

	function dealNoAuthor() {
		location.reload(true);
	}

	function initUserInfo(callback) {
		var userURL = studioHost + "user/currentUser";
		$.ajax({
			type: 'get',
			url: userURL
		}).success(function (data) {
			clearUserCookie();
			if (data) {
				setCookie("userType", data.userType);
				setCookie("guid", data.guid);
				callback(data);
			}
		}).error(function (jqxhr) {
			if (jqxhr.status == '401') {
				console.log("login error");
			}
		});
	}

	function clearUserCookie() {
		delCookie("userType");
		delCookie("guid");
	}

	function initMessageCount() {
		$.ajax({
			url: studioHost + "/message/amount",
			type: 'GET',
			dataType: 'text',
			success: function (data) {
				$('#message-banner').remove();
				$('.mainbo-search').prepend('<a href="./message.html" id = "message-banner">消息<span style="color:#f20000;">(' + data + ')</span></a>');
			}
		});
	}

	scope.initBreadNav = initBreadNav;
	scope.initBodyHref = initBodyHref;
	scope.replaceTitleID = replaceTitleID;
	scope.updateStudioTraffic = updateStudioTraffic;
	scope.dealNoAuthor = dealNoAuthor;
	scope.initUserInfo = initUserInfo;
	scope.clearUserCookie = clearUserCookie;
	scope.initMessageCount = initMessageCount;
})(window.commonHelper);

(function () {
	var isAppendMessage = setInterval(function () {
		if (!!$('.mainbo-search')) {
			commonHelper.initMessageCount();
			$('.mainbo-search a:last').click(function(){
				$.ajax({
					type:"get",
					url: studioHost + "logout"
				})
			});
			commonHelper.clearUserCookie();
			clearInterval(isAppendMessage);			
		}
	}, 175);
})();

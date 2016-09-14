window.tsViewtplHelper = window.tsViewtplHelper || {};
(function(scope) {
	function getFooterHtml() {
		var strfooter = '<div class="footer_"><div class="footer_content"><ul>' +
			'<li><span>版权所有：明博教育科技股份有限公司</span><br/><span>ICP备案号：09067563</span><br/><span>版本号：2.2.SP9111</span></li>' +
			'<li><span>客服热线：028-85768857</span><br/><span>每天9：00-17：30(法定节假日除外)</span></li>' +
			'<li> <img src="../base/images/code.jpg"><span>扫一扫,关注我们获得更多教育咨询</span></li>' +
			'<li class="footer_noborder"><span>网站技术支持：明博教育科技股份有限公司</span></li>' +
			'</ul></div></div>';
		return strfooter;
	}

	function getBannerHtml() {
		var strbanner = '<div class="wrap"><div class="banner">' +
			'<img src="./images/banner.png" alt=""><span id = "banner-studioName" class="space-name"></span>' +
			'<a id="banner-create" class="go-work-list hidden" href="./workspace_index.html">我创建的工作室</a>' +
			'<a id = "banner-add" class="go-work-list hidden" href="./add_studio_list.html">我加入的工作室</a>' +
			'</div></div>';
		return strbanner;
	}

	function getContentNavHtml(index, studioID) {
		var strnav = '<div class="content-nav wrap">' + '<ul class="clearFix">' + '<li class="cont-li">' + '<a class="home';
		if (index === 0) {
			strnav = strnav + " active";
		}
		strnav = strnav + '" href="workspace_index.html?studioID=' + studioID + '">首页</a>' + '</li>' + '<li class="cont-li">' + '<a class="article';
		if (index == 1) {
			strnav = strnav + " active";
		}

		strnav = strnav + '" href="teaching_article_list.html?studioID=' + studioID + '">教学文章</a>' + '</li>' + '<li class="cont-li">' + '<a class="resource';
		if (index == 2) {
			strnav = strnav + " active";
		}
		strnav = strnav + '" href="teachresource_list.html?studioID=' + studioID + '">教学资源</a>' + '</li>' + '<li class="cont-li">' + '<a class="research';
		if (index == 3) {
			strnav = strnav + " active";
		}
		strnav = strnav + '" href="topicdiscussion_list.html?studioID=' + studioID + '">课题研究</a>' + '</li>' + '<li class="cont-li">' + '<a class="teacher-class';
		if (index == 4) {
			strnav = strnav + " active";
		}
		strnav = strnav + '" href="class_list.html?studioID=' + studioID + '">名师课堂</a>' + '</li>' + '<li class="cont-li">' + '<a class="teach-discuss';
		if (index == 5) {
			strnav = strnav + " active";
		}
		strnav = strnav + '" href="teacherResearch_list.html?studioID=' + studioID + '">教学研讨</a>' + '</li>' + '</ul>' + '</div>';
		return strnav;
	}

	/* 工作室首页的工作室介绍 */
	function createStudioInfohtml(studioInfo) {
		var strHtml = "";
		if (studioInfo.icon !== null) {
			strHtml = '<div id="workspace-message-top">' +
				'<img src="' + studioInfo.icon + '" />';
		} else {
			strHtml = '<div id="workspace-message-top">' +
				'<img src="images/studio_default_pic.png" />';
		}
		strHtml += '<div class="workspace-pic-area" id="workspace-message-name">' +
			'<span>' + studioInfo.name + '</span>' +
			'<a href = "./basic_information.html?studioID=' + studioInfo.id + '" id = "StudioBaseInfo"><span class="workspace-detail">基本资料</span></a>' +
			'<input class="notice-button-attention" id ="follow" type="button" value="关注" />' +
			'</div>' +
			'<div class="workspace-message-item item-blue">' +
			'<a href="workspace_member.html?studioID=' + studioInfo.id + '&checkID=0' + '"><span id="member-count">' + studioInfo.memberNum + '</span></a>' +
			'<span class="workspace-message-itme-name" >成员数</span>' +
			'</div>' +
			'<div class="workspace-message-item item-blue">' +
			'<a href="workspace_member.html?studioID=' + studioInfo.id + '&checkID=1' + '"><span id="fans-count">' + studioInfo.fansNum + '</span></a>' +
			'<span class="workspace-message-itme-name">粉丝数</span>' +
			'</div>' +
			'<div class="workspace-message-item item-dark">' +
			'<span>' + studioInfo.traffic + '</span>' +
			'<span class="workspace-message-itme-name">访问量</span>' +
			'</div>' +
			'<span id="enter-workspace" onclick="getRelation(judgeIfCanEnter)">申请加入工作室</span>' +
			'</div>';
		return strHtml;
	}
	/**
	 * 初始化基础页面部分 
	 * @param {Object} index  工作室导航显示位置
	 */
	function initBasicViews(index) {
		var bannerHtml = tsViewtplHelper.getBannerHtml();
		$("#banner").html(bannerHtml);

		var queryObj = getQueryObj();
		var contentNavHtml = tsViewtplHelper.getContentNavHtml(index, queryObj.studioID);
		$("#contentNav").html(contentNavHtml);

		var footerHtml = tsViewtplHelper.getFooterHtml();
		$("#footer").html(footerHtml);
	}
	/**
	 * 获取学段列表
	 * @param {Object} id
	 */
	function getPeriodList(id,callback) {
		var periodUrl = studioHost + "sysDic/loadPeriod";
		$.ajax({
			type: "get",
			url: periodUrl,
			/*async: true,*/
			dataType: 'json'
		}).success(function(data) {
			console.log("period:" + data);
			$("#" + id).empty();
			var innerHtml = '';
			for (var index in data) {
				if (index === 0) {
					innerHtml += '<li class="kind-li active" data-id="' + data[index].dicId + '">' + data[index].dicName + '</li>';
				} else {
					innerHtml += '<li class="kind-li" data-id="' + data[index].dicId + '">' + data[index].dicName + '</li>';
				}
			}
			$("#" + id).append($(innerHtml));
			if( typeof callback == 'function'){
				callback();
			}
		});
	}
	/**
	 * 获取学科列表
	 * @param {Object} id 列表id
	 */
	function getSubjcetList(id,callback) {
		var subjectUrl = studioHost + "sysDic/loadSubject";
		$.ajax({
			type: "get",
			url: subjectUrl,
			/*async: true,*/
			dataType: 'json',
			success: function(data){
				console.log(data);
				console.log("subject:" + data);
				$("#" + id).empty();
				var innerHtml = '';
				for (var index in data) {
					if (index === 0) {
						innerHtml += '<li class="kind-li active" data-id="' + data[index].dicId + '">' + data[index].dicName + '</li>';
					} else {
						innerHtml += '<li class="kind-li" data-id="' + data[index].dicId + '">' + data[index].dicName + '</li>';
					}
				}
				$("#" + id).append($(innerHtml));
				if( typeof callback == 'function'){
					callback();
				}
			}
		});
	}

	/*获取学年列表
	 *
	 */
	function getYearList(id,callback) {
		var yearUrl = studioHost + "sysDic/schoolYear";
		$.ajax({
			type: "get",
			url: yearUrl,
			/*async: true,*/
			dataType: 'json',
		}).success(function(data) {
			console.log("year:" + data);
			$("#" + id).empty();
			var innerHtml = '';
			for (var index in data) {
				if (index === 0) {
					innerHtml += '<li class="kind-li active" data-id="' + data[index].dicId + '">' + data[index].dicName + '</li>';
				} else {
					innerHtml += '<li class="kind-li" data-id="' + data[index].dicId + '">' + data[index].dicName + '</li>';
				}
			}
			$("#" + id).append($(innerHtml));
			if( typeof callback == 'function'){
				callback();
			}
		});
	}
	
	function getErrorPage(){
		var errorString = '<div class="error-page"><div><img src="./images/error.png"></div><span>抱歉，暂时还没有内容</span></div>';
		return errorString;
	}
	scope.getBannerHtml = getBannerHtml;
	scope.getContentNavHtml = getContentNavHtml;
	scope.getFooterHtml = getFooterHtml;
	scope.initBasicViews = initBasicViews;
	scope.createStudioInfohtml = createStudioInfohtml;
	scope.getPeriodList = getPeriodList;
	scope.getSubjcetList = getSubjcetList;
	scope.getYearList = getYearList;
	scope.getErrorPage = getErrorPage;
})(window.tsViewtplHelper);
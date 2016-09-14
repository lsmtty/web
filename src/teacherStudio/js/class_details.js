$(function() {
	tsViewtplHelper.initBasicViews(4);
	initHref();
	initStudioInfo();
	getAudio();
	commentInfoHelper.initComment("teacher_class");
})

function initStudioInfo(callback) {
	var queryObj = getQueryObj();
	if(queryObj.studioID) {
		tsInfoHelper.initStudioInfo(queryObj.studioID, function() {
			var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
			$("#banner-studioName").text(studioInfo.name);

		});
		userRoleHelper.initUserRole(queryObj.studioID, function() {
			userrole = userRoleHelper.getUserRole(queryObj.studioID);
		});
	}
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
}

function getAudio() {
	var URL = studioHost + "teacherClass/" + getQueryObj().titleID;
	$.ajax({
		url: URL,
		type: 'get',
		dataType: 'json'
	}).done(function(data) {
		console.log("class:" + data.previewUrl);
		$("#class-name").text(data.title);
		$("#current").text(data.title);
		$("#class-size").text("" + Math.ceil(data.size / (1024 * 1024)) + "M");
		$("#class-time").text(data.uploadTime);
		$("#class-author").text(data.sysUser.username);
		getRecommendAudios(data.subjectId, data.gradeId);
		loadAudio(data.downloadUrl, data.previewUrl);
	});
}

function getRecommendAudios(subjectId, gradeId) {
	var RecommendCount = 3;
	var URL = studioHost + "teacherClass/" + "recommend/" + getQueryObj().titleID + "/" + RecommendCount;
	$.ajax({
		type: "get",
		url: URL,
		async: true,
		dataType: 'json'
	}).success(function(data) {
		for(var index in data) {
			var appendHtml = '<div class="recommend" data-id = "' + data[index].id + '"><img src="images/class_list_icon.png"/>' +
				'<a href="class_details.html?studioID=' + getQueryObj().studioID + '&titleID=' + data[index].id + '">' + data[index].title + '</a></div>';
			$("#content-right").append($(appendHtml));
		}
		$(".recommend").click(function() {
			var id = $(this).data("id");
			window.location.href = 'class_details.html?studioID=' + getQueryObj().studioID + '&titleID=' + id;
		});
	});
}

function loadAudio(downloadUrl, previewUrl) {
	/*var previewUrl = 'http://demo.fs.zy.winshareyun.cn/group1/M00/54/91/AgAAAFcM2_GIXFWTADp3vJXdWecAAAA5ALxsBgAOnfU454.mp4'; //预览路径*/
	$("#download").attr({
		"href": downloadUrl
	});
	if (previewUrl === null || previewUrl === undefined) {
		var html = '<div class = "nopreview"><img src = "./images/error.png" class = "nopreview-img"></img><p class = "nopreview-text">很抱歉，您请求的资源无法预览。</p></div>';
		$("#content_video").empty();
		$("#content_video").append($(html));
	} else {
		var text = '<object classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" width="682" height="360">' +
			'<param name="AutoStart" value="1" />' +
			'<param name="Src"  value="' + previewUrl + '"/>' +
			'</object>';

		var str = '<video id="example_video_1" class="video-js vjs-default-skin" controls preload="auto" style="width:682px;height:360px"   data-setup="{}">';
		str += "<source src='" + previewUrl + "'/>";
		str += '</video>';
		$("#content_video").empty();
		$("#content_video").append(str);
		var isIE = !!window.ActiveXObject;
		var isIE8 = isIE && !!document.documentMode;
		if(isIE8) {
			$("#content_video").empty();
			$("#content_video").append(text);
		}
		var myPlayer = videojs('example_video_1');
		videojs("example_video_1").ready(function() {
			var myPlayer = this;
			myPlayer.play();
		});
	}
}
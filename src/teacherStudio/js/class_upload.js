$(function () {
	tsViewtplHelper.initBasicViews(4);
	commonHelper.initBodyHref();
	tsInfoHelper.initStudioInfo(getQueryObj().studioID, function () {
		var studioInfo = tsInfoHelper.getStudioInfo(getQueryObj().studioID);
		$("#banner-studioName").text(studioInfo.name);

	});
	/* 标题字数跟踪 */
	titleNum($('#title-input'), $('#nuw-num'), 30);
	/* 点击效果 */
	loadAudioMessageTab();

	$('#file').change(function (event) {
		str = $(this).val();
		str = str.slice(str.lastIndexOf('\\') + 1) || '请选择要上传的视频';
		$('.file-val').empty();
		$('.file-val').append(str);
	});
	$(".btns a:first-child").click(upload);
	$(".btns a:last-of-type").click(dismiss);
})

function loadAudioMessageTab() {
	tsViewtplHelper.getSubjcetList("class_subject");
	tsViewtplHelper.getYearList("class_period");
	$('.kind-list').on('click', '.kind-li', function () {
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
	});
}

function upload(uploadButton) {
	var aviName = $("#title-input").val();
	if (aviName == '') {
		toast("请输入课堂名称");
		return;
	} else {
		$("#inputName").val(aviName);
	}
	//拿文件名
	var file = $("#file").val();
	var filename = getFileName(file);
	if (filename == '') {
		toast("请上传视频");
		return;
	} else {
		$("#inputfileName").val(filename);
	}
	$("#progressbar").removeClass("hidden");
	
	$("#class_period li").each(function () {
		if ($(this).hasClass("active")) {
			$("#inputgradeId").val($(this).data("id"));
		}
	});
	$("#class_subject li").each(function () {
		if ($(this).hasClass("active")) {
			$("#inputsubjectId").val($(this).data("id"));
		}
	});
	$("#inputstudioId").val(getQueryObj().studioID);
	/*$("form").submit();*/
	$(uploadButton).unbind();
	$("form").ajaxSubmit({  //异步提交
		url: '' + studioHost + 'teacherClass/upload',
		type: 'post',
		dataType: 'json',
		success: function (data) {
			$("#progressbar").addClass("hidden");
			$(uploadButton).bind("click", function () {
				upload(this);
			});
			if (data.type == 'success') {
				toast('<span class="icon-success"></span>恭喜，上传成功。');
				setTimeout(function () {
					var queryObj = getQueryObj();
					if (queryObj.studioID) {
						location.href = "./class_list.html?studioID=" + queryObj.studioID;
					} else {
						alert("数据异常，请重新登录后操作。");
					}
				}, 1500);
			} else {
				toast("上传名师课堂失败,请重新上传视频");
			}
		},
		resetForm: true
	});
}

function getFileName(o) {
	var pos = o.lastIndexOf("\\");
	return o.substring(pos + 1);
}

function dismiss() {
	confirmDialog('取消', '您确定要取消吗？', jumpToMain);
}

function jumpToMain() {
	window.history.back(-1);
}
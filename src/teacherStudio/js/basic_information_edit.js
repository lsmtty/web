$(function() {
	tsViewtplHelper.initBasicViews(0);
	initHref();
	initStudioInfo();
	titleNum($('#title-input'), $('#nuw-num'), 30);
	tsViewtplHelper.getPeriodList("study_period");
	tsViewtplHelper.getSubjcetList("study_subject", initInfo);
	$('.kind-list').on('click', '.kind-li', function() {
		$(this).siblings().removeClass('active');
		$(this).addClass('active')
	})

	$('#file').change(function(event) {
		str = $(this).val();
		str = str.slice(str.lastIndexOf('\\') + 1) || '请选择要上传的图片';
		$('.file-val').html(str);
	});

	$(".btns a:first-child").click(createStudio);
	$(".btns a:last-of-type").click(cancelCreateStudio);
});

function initStudioInfo(callback) {
	var queryObj = getQueryObj();
	if (queryObj.studioID) {
		tsInfoHelper.initStudioInfo(queryObj.studioID, function() {
			var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
			$("#banner-studioName").html(studioInfo.name);
		})
		userRoleHelper.initUserRole(queryObj.studioID, function() {
			userrole = userRoleHelper.getUserRole(queryObj.studioID);
		})
	}
};

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
};

function initInfo() {
	var URL = studioHost + 'studio/find/' + getQueryObj().studioID;
	$.ajax({
		type: "get",
		url: URL,
		async: true
	}).success(function(data) {
		studioData = data;
		$("#title-input").val(data.name);
		$("#nuw-num").text(data.name.length);
		$("#title-details-input").val(data.introduction);
		getPeriod(data.period);
		getSubject(data.subject);
		if (data.propaganda != null) {
			$("#myPic").attr({
				"src": data.propaganda
			});
		}
		if (data.icon != null) {
			$("#right-box > img").attr({
				"src": data.icon
			});
		}
	});
};

function getPeriod(periodId) {
	console.log("period:" + periodId);
	$("#study_period").children().each(function() {
		var id = $(this).data("id");
		$(this).removeClass("active");
		if (periodId == id) {
			$(this).addClass("active");
		}
	});
};

function getSubject(subjectId) {
	console.log("subjectId:" + subjectId);
	$("#study_subject").children().each(function() {
		var id = $(this).data("id");
		$(this).removeClass("active");
		if (subjectId == id) {
			$(this).addClass("active");
		}
	});
};

//上传图片显示预览照片
function showAvatar(inputId, imgId, wrapDivName) {
	var docObj = document.getElementById(inputId);
	var imgObjPreview = document.getElementById(imgId);
	if (docObj.files && docObj.files[0]) {
		//火狐下，直接设img属性
		imgObjPreview.style.display = 'block';
		imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
	} else {
		//IE下，使用滤镜
		//让input 获取焦点
		docObj.select();
		try {
			document.selection.createRange().text; //ie8 9 不支持
		} catch (e) {
			alert("图片上传成功");
			return;
		}
		var imgSrc = document.selection.createRange().text;
		var imgSrc = docObj.text;
		var localImagId = document.getElementById(wrapDivName);
		try {
			localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
		} catch (e) {
			alert("您上传的图片格式不正确，请重新选择!");
			return false;
		}
		imgObjPreview.style.display = 'none';
		document.selection.empty();
	}
	return true;
}

//确定创建工作室
function createStudio() {
	$(".btns a:first-child").unbind();
	var studioName = $("#title-input").val();
	if (studioName == '') {
		toast("请填入工作室名称");
		return;
	}
	$("#inputId").val(getQueryObj().studioID);
	var studio_period;
	$("#study_period li").each(function() {
		if ($(this).hasClass("active") && $(this).data("id") != studioData.period) {
			$("#inputPeriod").val($(this).data("id"));
		}
	});
	var studio_subject;
	$("#study_subject li").each(function() {
		if ($(this).hasClass("active") && $(this).data("id") != studioData.subject) {
			$("#inputSubject").val($(this).data("id"));
		}
	});
	var studio_produce = $("#title-details-input").val();
	if (studio_produce == '') {
		toast("请填入工作室介绍");
		return;
	}
	/*$("form").submit();*/
	/*$("#form").ajaxSubmit({  //异步提交
		url: '' + studioHost + '/studio/save',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			toast("创建工作室成功");
		},
		resetForm:true,
	});*/
	$("#form").ajaxSubmit({ //异步提交
		url: '' + studioHost + 'studio/update',
		type: 'post',
		dataType: 'json',
		success: function(data) {
			if (data.type == 'success') {
				toast("修改工作室信息成功");
				setTimeout(function() {
					window.location.href = "workspace_index.html?studioID=" + getQueryObj().studioID;
				}, 500);
			} else {
				toast("修改工作室信息失败,请联系管理员");
				$(".btns a:first-child").click(createStudio);
				console.log(data.message);
			}
		},
		resetForm: false,
	});
};

//取消创建工作室
function cancelCreateStudio() {
	confirmDialog("取消工作室编辑", "您确定要取消操作吗", jumpToMain);
};

function jumpToMain() {
	window.history.back(-1);
}
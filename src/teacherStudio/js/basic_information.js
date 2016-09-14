$(function() {
	tsViewtplHelper.initBasicViews(0);
	initHref();
	initStudioInfo();
	initInfo();
});

function initStudioInfo(callback) {
	var queryObj = getQueryObj();
	if (queryObj.studioID) {
		tsInfoHelper.initStudioInfo(queryObj.studioID, function() {
			var studioInfo = tsInfoHelper.getStudioInfo(queryObj.studioID);
			$("#banner-studioName").text(studioInfo.name);

		});
		userRoleHelper.initUserRole(queryObj.studioID, function() {
			userrole = userRoleHelper.getUserRole(queryObj.studioID);
			initData();
		});
	}
}

function initHref() {
	commonHelper.initBreadNav();
	commonHelper.initBodyHref();
}

function initData(){
	if(canEdit()){
		$("#main_edit").show();
	}
}

function canEdit(){
	if (userrole.role == USERROLE.OWNER) {
		return true;
	}
	return false;
}

function initInfo() {
	var URL = studioHost + 'studio/find/' + getQueryObj().studioID;
	$.ajax({
		type: "get",
		url: URL,
		async: true
	}).success(function(data) {
		console.log(data);
		console.log("period:" + data.period);
		console.log("subject:" + data.subject);
		$("#studio-name").text(data.name);
		$("#studio-introduce").text(data.introduction);
		$("#studio-period p").text()
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
	var periodUrl = studioHost + "sysDic/loadPeriod";
	$.ajax({
		type: "get",
		url: periodUrl,
		async: true,
		dataType: 'json'
	}).success(function(data) {
		for (var index in data) {
			if (data[index].dicId == periodId) {
				$("#studio-period p").text(data[index].dicName);
				break;
			}
		}
	});
}

function getSubject(subjectId) {
	var subjectUrl = studioHost + "sysDic/loadSubject";
	$.ajax({
		type: "get",
		url: subjectUrl,
		async: true,
		dataType: 'json'
	}).success(function(data) {
		for (var index in data) {
			if (data[index].dicId == subjectId) {
				$("#studio-subject p").text(data[index].dicName);
				break;
			}
		}
	});
}
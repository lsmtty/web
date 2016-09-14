function initPage() {
	pageMessage = getPagingBar(fn);
	fn(0);
}

initPage();

function initMessageData(index) {
	var messageURL = studioHost + "message/list/" + PAGE_COUNT + "/" + index;
	$.ajax({
		type: "get",
		url: messageURL
	}).success(function(data) {
		initMsgeHtml(data);
		if(Math.ceil(data.page.totalCount / PAGE_COUNT) != pageMessage.getPageSize()) {
			pageMessage.reloadPage(Math.ceil(data.page.totalCount / PAGE_COUNT));
		}
	}).error(function(jqXHR) {
		initEmptyMsgHtml();
	});
}

function initMsgeHtml(data) {
	$("#messagelist").html(getMsgHtml(data.datalist));
	bindEvent();
}

function initEmptyMsgHtml() {
	$("#messagelist").html('<div class="emptyMsg">您没有消息</div>');
}

function bindEvent() {
	$("a[name='passbtn']").click(passAdd);
	$("a[name='failbtn']").click(failAdd);
}

function passAdd() {
	var applyID = $(this).parent().parent().data("id");
	applactionAdd(applyID, "agree");
	$(this).parent().html('<span class="gray-text">已通过</span>');
}

function failAdd() {
	var applyID = $(this).parent().parent().data("id");
	applactionAdd(applyID, "refuse");
	$(this).parent().html('<span class="gray-text">已拒绝</span>');
}

function applactionAdd(id, decision) {

	var applyURL = studioHost + "apply/operate/" + id + "/" + decision;
	$.ajax({
		type: "put",
		url: applyURL		
	}).success(function(data){
		commonHelper.initMessageCount();
	});
}

function getMsgHtml(data) {
	console.log(data);
	var html = "";
	var userid = readCookie("guid");

	for(var index = 0; index < data.length; index++) {
		if(userid == data[index].proposer) {
			html += getPostMsgItemHtml(data[index]);
		} else {
			html += getReciveMsgItemHtml(data[index]);
		}

	}
	return html;
}

function getReciveMsgItemHtml(data) {
	var html = '<ul class="message-item clearFix" data-id = "' + data.id + '">';
	if(data.status == 1) {
		html += '<li class="mes-source bold">[名师工作室]&nbsp;';
	} else {
		html += '<li class="mes-source">[名师工作室]&nbsp;';
	}

	html = html + '<a href="' + data.sysUser.rrtUrl + '">' +
		'<span class="blue-text">' + data.sysUser.username + '</span>' +
		'</a>' +
		'申请加入您的工作室</li>' +
		'<li class="mes-date gray-text">' + data.createDate + '</li>';
	if(data.status == 1) {
		html = html + '<li class="mes-operate"><a href="#" name ="passbtn"><span class="btn"">同意</span></a> &nbsp;' +
			'<a href="#" name ="failbtn"><span class="btn-active">拒绝</span></a></li>';
	}
	if(data.status == 2) {
		html = html + '<li class="mes-operate"><span class="gray-text">已通过</span></li>';
	}
	if(data.status == 3) {
		html = html + '<li class="mes-operate"><span class="gray-text">已拒绝</span></li>';
	}
	html = html + '</ul>';
	return html;
}

function getPostMsgItemHtml(data) {
	var html = '<ul class="message-item clearFix">';
	if(data.viewFlag == 1) {
		html = html + '<li class="mes-source bold">[名师工作室]&nbsp;恭喜，您申请加入';
	} else {
		html = html + '<li class="mes-source">[名师工作室]&nbsp;恭喜，您申请加入';
	}
	html = html + '<a href="./workspace_index.html?studioID=' + $.trim(data.studioId) + '">' +
		'<span class="blue-text">' + data.studioName + '</span>' +
		'</a>' +
		'工作室的申请已经通过</li>' +
		'<li class="mes-date gray-text right">' + data.createDate + '</li>' +
		'</ul>';
	return html;
}

function fn(i) { //执行的函数
	initMessageData(i + 1);
}
$(function() {
	currentPage = 1;
	initBreadLine();
	initFirstLiStyle();
	initTitleItemClick();
});

function initFirstLiStyle(){
	$(".theme-small-title:eq(0)").addClass("blue-title-item");
	$(".news-list:eq(0)").show();
}

function initBreadLine() {
	var breadLineChild = $(".breadLine").children("span");
	eventUtil.addHandler(breadLineChild[0],'click',function() {
		window.location.href="seminar-main.html";
	});
};


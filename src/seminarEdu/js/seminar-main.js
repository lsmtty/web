$(function() {
	initTitleItemClick();	
	initSecondBlock();
});

function initSecondBlock(){
	var safeBlock1Ul = $("#safeAndEmergencyNews1 .news");
	var safeBlock2Ul = $("#safeAndEmergencyNews2 .news");
	$(safeBlock1Ul).children().each(function(index){
		if(index >=6){
			$(this).remove();	
			safeBlock2Ul.append($(this));
		}
	});
}


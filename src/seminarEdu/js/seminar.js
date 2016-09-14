$(function() {
	eventUtil = {
		addHandler: function(element, type, handler) {
			if (element.addEventListener) {
				element.addEventListener(type, handler, false);
			} else if (element.attachEvent) {
				element.attachEvent('on' + type, handler);
			} else {
				element['on' + type] = handler;
			}
		},
		removeHandler: function(element, type, handler) {
			if (element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			} else if (element.detachEvent) {
				element.detachEvent('on' + type, handler);
			} else {
				element['on' + type] = null;
			}
		}
	};
});

function initTitleItemClick() {
	$(".theme-small-title").click(function() {
		if($(this).hasClass("blue-title-item")){
			return;
		}else{
			$(this).addClass("blue-title-item");
		}
		var newsBlockList = $(this).parents("#moralEdu").children();
		for (var i = 1; i < newsBlockList.length; i++) {
			if (i == ($(this).index()+1)) {
				$(newsBlockList[i]).show();
			} else {
				$(newsBlockList[i]).hide();
			}
		}
		var thisLi = $(this).index();
		$(this).parent().children("li").each(function(index) {
			if (index != thisLi) {
				$(this).removeClass("blue-title-item");
			}
		});
	});
};


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
})

/**
 * 
 * @param {Object} itemname  选项卡名字   jQuery选择器
 * @param {Object} parentname  选项卡与选择内容所在父级元素名字 jQuery选择器
 * @param {Object} tabname     选项内容名字 jQuery选择器
 * @param {Object} checkclass  选中状态class
 * @param {Object} discheckclass  未选中class
 */
function initTitleItemClick(itemname,parentname,tabname,checkclass,discheckclass) {
	var argumentsCount = arguments.length;
	$(itemname).click(function() {
		var thisLi = $(this).index();
		if(argumentsCount == 5){  //如果设置了未选中样式
			if(!$(this).hasClass(checkclass)){
				addClassAll($(this).parent().children("li"),discheckclass);
				$(this).addClass(checkclass).removeClass(discheckclass);
			}
		}else{ //没有未选中样式
			if(!$(this).hasClass(checkclass)){
				$(this).addClass(checkclass);
			}
		}	
		var newsBlockList = $(this).parents(parentname).children(tabname);
		for (var i = 0; i < newsBlockList.length; i++) {
			if (i == ($(this).index())) {
				$(newsBlockList[i]).show();
			} else {
				$(newsBlockList[i]).hide();
			}
		}
		$(this).parent().children("li").each(function(index) {
			if (index != thisLi) {
				$(this).removeClass(checkclass);
			}
		});
	});
}

function addClassAll(objects,className){
	$(objects).each(function(){
		$(this).addClass(className);
	});
}

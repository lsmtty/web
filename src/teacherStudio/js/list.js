$(function(){
	(function(){
		currentPage = 1;
	})();
	initPageNavigator();
});

function initPageNavigator(){
	var pageCount = 5;
	var $append = '';
	for(var i = 1;i<=pageCount;i++){
		var $html = "<input class='nav-input' value='"+i+"'></input>";
		$append += $html;
	}
	$(".nav-input:eq(0)").after($append);
	var navChild = $(".nav-input");
	for(var i = 0 ;i < navChild.length;i++){
		navChild[i].index = i;
		if(i == 0){
			eventUtil.addHandler(navChild[i],"click",function(){
				moveToLastPage();
			});
		}else if(i == navChild.length - 1){
			eventUtil.addHandler(navChild[i],"click",function(){
				moveToNextPage();
			});
		}
		else{
			eventUtil.addHandler(navChild[i],"click",function(){
				changePageTo(this.index);
			});
			if(i == 1){
				navChild[i].className = "nav-input blue-nav";
			}
		}
	}
};

function changePageTo(index){
	if(currentPage ==alert){
		return;
	}else{
		changeNavBg(index);
		currentPage = index;
	}
};

function moveToLastPage(){
	if(currentPage == 1){
		return;
	}else{
		changeNavBg(-1);
		currentPage--;
	}
};

function moveToNextPage(){
	if(currentPage == ($(".nav-input").length - 2)){
		return;
	}else{
		changeNavBg(0);
		currentPage ++;
	}
};

function changeNavBg(newIndex){
	//使用jQuery对象转换
	var navChild = $(".nav-input");
	$(navChild[currentPage]).removeClass("blue-nav"); //使用$(dom对象) 就可以转化为jQuery对象
	if(newIndex == 0) {  //下一个
		newIndex = currentPage + 1;
	}else if(newIndex == -1){ // 上一个
		newIndex = currentPage - 1;
	}
	$(navChild[newIndex]).addClass("blue-nav");
	//改变上一页下一页字体颜色
	$(navChild[0]).css({"color":"#000"});
	$(navChild[navChild.length - 1]).css({"color":"#000"});
	if(newIndex == 1){
		$(navChild[0]).css({"color":"#828282"});
	}else if(newIndex == navChild.length - 2){
		$(navChild[navChild.length - 1]).css({"color":"#828282"});
	}
}


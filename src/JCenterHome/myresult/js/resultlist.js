require.config({
	baseUrl: 'js/component/',
	paths: {
		"mock": "http://mockjs.com/dist/mock",
		"jquery": "../../../../lib/jquery/jquery-1.9.1",
		"tools": "../../../../base/js/requiretools",
		"paging": "../../../../base/component/paging/js/requirepaging"
	},
	enforeDefine: true
});
require(['jquery', 'leftnav'], function($, leftnav) {
	$(function() {
		//todo getData from server
		leftnav.init("{}", $(".left-nav"));
		bindEvents();
	})

	function bindEvents() {
		$(".serach-box").bind("click", function() {
			var chooseValue = $(".choose-value").text();
			$(this).find("ul").show().focus().children().removeClass("darkbg").each(function() {
				if(chooseValue == $(this).find("span").text()) {
					$(this).addClass("darkbg");
					return;
				}
			});
			/*$(this).find("ul").blur(function() {
				$(this).hide(); //取消焦点代码没有效果
			});*/
		});
		$(".serach-box ul li").click(function(event) {
			event.stopPropagation();
			var newSerachText = $(this).children("span").text();
			$(".serach-box ul").hide();
			if(newSerachText !== $(".choose-value").text()) {
				$(".choose-value").text(newSerachText);
				if("全部" === newSerachText) {
					$("#serach-content").attr({
						"placeholder": "请输入搜索内容"
					});
				} else {
					$("#serach-content").attr({
						"placeholder": "请输入搜索" + newSerachText
					});
				}
			}
		})
	}
});
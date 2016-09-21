require.config({
	baseUrl: 'js/component/',
	paths: {
		"mock": "http://mockjs.com/dist/mock",
		"jquery": "../../../../lib/jquery/jquery-1.9.1",
		"tools": "../../../../base/js/requiretools",
		"paging": "../../../../base/component/paging/js/requirepaging",
		"mockmodule": "../../../../../mock/mockmodule",
		"resultlistmock": "../../../../../mock/resultlistmock"
	},
	enforeDefine: true
});
require(['jquery', 'leftnav'], function($, leftnav) {
	$(function() {
		//todo getData from server
		require(['resultlistmock'], function(resultlistmock) {
			initLeftNav();
		});
		require(['tools'], function(tools) {
			tools.textHint($('#serach-content'));
		});
	})

	function initLeftNav() {
		$.ajax({
			type: 'get',
			url: 'http://localhost:8080/rrt/tagManager/listTag?user=admin&space=te',
			dataType: 'json'
		}).success(
			function(data) {
				console.log(data);
				leftnav.init(data, $(".left-nav"), pageSwitch);
				$(".main").css({
					"height": "auto",
					"minHeight": "880px"
				});
				/**
				 * 列表页初步展示
				 */
				function pageSwitch(first_type, creater, space) {
					initSecondTypeValue();
					require(['paging'], function(paging) {
						paging.pageInit(fn);
						$("#search").click(function(){
							fn(0);
						});

						/**
						 * 刷新页面列表
						 * @param {Object} data
						 */
						function updateItemInfo(data) {
							$(".list-area").html();
							var innerHtml = "";
							for(var i = 0; i < data.length; i++) {
								innerHtml += '<div class="list-item" data-id="' + data[i].id + '"><img class="item-type-image" src="./images/type_word.png">';
								innerHtml += '<div class="item-message"><div class="item-title"><span>' + getResultName(data[i]) + '</span></div><span class="item-time">' + getDataTime(data[i].update_time) + '</span>';
								innerHtml += '<div class="item-control clearFix">' + getControlArea(data[i]) + '</div></div></div>';
							}
							$(".list-area").html(innerHtml);
							$(".item-control div:last-child").css({
								"border-right": "none"
							});
						}

						/**
						 * 拼接成果名称
						 * @param {Object} data
						 */
						function getResultName(data) {
							var name = "";
							if(!isStringEmpty(data.second_type)) {
								name += "【" + data.second_type + "】";
							}
							if(!isStringEmpty(data.publish_name)) {
								name += "【" + data.publish_name + "】";
							}
							if(!isStringEmpty(data.subject_name) && !isStringEmpty(data.grade_name)) {
								name += "【" + data.grade_name + data.subject_name + "】";
							}
							return name;
						}

						/**
						 * 获取成果的可操作区域
						 * @param {Object} data
						 */
						function getControlArea(data) {
							var innerHtml = "";
							innerHtml += '<div class="delete-area"><span class="item-control-name">删除</span></div><div class="upload-area"><span class="item-control-name">下载</span></div>';
							if(data.share_flag) { //如果分享了成果
								innerHtml += '<div class="disshare-area"><span class="item-control-name">取消分享</span></div>';
							} else {
								innerHtml += '<div class="share-area"><span class="item-control-name">分享</span></div>';
							}
							return innerHtml;
						}

						//判断字符串是否为空
						function isStringEmpty(targetString) {
							if(targetString != null || targetString != undefined || targetString != "") {
								return false;
							} else {
								return true;
							}
						}

						/**
						 * 分页查询函数
						 * @param {Object} i
						 */
						function fn(i) {
							var second_type = $(".choose-value").text() == "全部" ? "" : $("#choose-ul").children(".darkbg").data("id");
							var serach_content = $("#serach-content");
							var title = serach_content.val() == serach_content[0].defaultValue ? "" : serach_content.val();
							$.ajax({
								type: 'post',
								url: 'http://localhost:8080/rrt/achievementManager/pageList',
								data: {
									"first_type": first_type,
									"second_type": second_type,
									"title": title,
									"creater": creater,
									"space": space,
									"page_no": i,
									"page_size": 15
								},
								dataType: 'json'
							}).success(function(data) {
								updateItemInfo(data.list);
								if(data.totalPage != paging.getPageSize()) {
									paging.reloadPage(data.totalPage);
								}
							})
						}
					})

					/**
					 *加载搜索类型
					 */
					function initSecondTypeValue() {
						$.ajax({
							url: 'http://localhost:8080/rrt/dataManager/getData?key=beikeziyuan',
							dataType: 'json',
							type: 'get'
						}).success(function(data) {
							if(data.success) {
								var innerHtml = "";
								$("#choose-ul").empty().append('<li class="darkbg"><span>全部</span></li>');
								for(var i = 0; i < data.mapList.length; i++) {
									innerHtml += '<li data-id="' + data.mapList[i].id + '"><span>' + data.mapList[i].name + '</span></li>';
								}
								$("#choose-ul").append(innerHtml);
								bindEvents();
							} else {
								console.log("元数据加载错误");
							}
						})
					}

					function getDataTime(time) {
						return time.substring(0, 16);
					}
				}
			})
	}

	function bindEvents() {
		$(".serach-box").bind("click", function() {
			if($(this).find("ul").is(":hidden")) {
				var chooseValue = $(".choose-value").text();
				$(this).find("ul").show().focus().children().removeClass("darkbg").each(function() {
					if(chooseValue == $(this).find("span").text()) {
						$(this).addClass("darkbg");
						return;
					}
				});
				$(this).css({
					"background": "url(../myresult/images/trangle_up.png) no-repeat 70px 9px"
				});
			} else {
				$(this).find("ul").hide();
				$(this).css({
					"background": "url(../myresult/images/trangle_down.png) no-repeat 70px 9px"
				});
			}
			/*$(this).find("ul").blur(function() {
				$(this).hide(); //取消焦点代码没有效果
			});*/
		});
		$(".serach-box ul li").click(function(event) {
			event.stopPropagation();
			var newSerachText = $(this).children("span").text();
			$(this).parent().hide().parent().css({
				"background": "url(../myresult/images/trangle_down.png) no-repeat 70px 9px"
			});
			if(newSerachText !== $(".choose-value").text()) {
				$(".choose-value").text(newSerachText);
				var serach_content = $("#serach-content");
				if("全部" === newSerachText) {
					serach_content.val("请输入搜索内容");
					serach_content[0].defaultValue = "请输入搜索内容";
				} else {
					serach_content.val("请输入搜索" + newSerachText);
					serach_content[0].defaultValue = "请输入搜索" + newSerachText;
				}
			}
		})
	}
});
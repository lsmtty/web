function updateItemInfo(data, type) {
	switch(type) {
		case 1: //工作室成员
			$("#workspace-member-content").empty();
			for(var index in data) {
				var ItemHtmlString = '<div class="workspace-member-item wrap-img" data-id="' + data[index].id + '"><a href="' + data[index].sysUser.rrtUrl + '"><img class="lazy" data-original="' + data[index].sysUser.avatar + '"alt="' + data[index].sysUser.username +
					'"/></a><span>' + data[index].sysUser.username + '</span></div>';
				var ItemElement = $(ItemHtmlString);
				$("#workspace-member-content").append(ItemElement);
			}
			$("img.lazy").lazyload({
				effect:"fadeIn"
			});
			displayWorkspaceMember();
			$('workspace-member-item').click(memberClick);
			break;
		case 2: //推荐工作室
			if(data.length == 0) {
				$("#workspace-recommend").append('<span>抱歉，现在没有推荐的工作室</span>');
			} else {
				for(var index in data) {
					var ItemHtmlString = '<div class="workspace-recommend" data-id="' + data[index].id + '"><div class="wrap-img" style="height:85px;width:85px;"><a href="workspace_index.html?studioID=' + data[index].id + '"><img class="lazy" data-original="' + data[index].icon + '" alt="' + data[index].name +
						'"/></a></div><div id="workspace-message-name"><span>' + data[index].name + '</span>';
					if(data[index].relation == 1 || data[index].relation == 2) {
						ItemHtmlString += '<input  id="recommend-' + data[index].id + '" class="notice-button-attention" type= "button" value="关注"/></div> ';
					} else if(data[index].relation == 3 || data[index].relation == 6 || data[index].relation == 7) {
						ItemHtmlString += '<input class="notice-button-attentioned" type= "button" value="已关注"/></div> ';
					} else {
						ItemHtmlString += '<input class="notice-button-attentioned" type= "button" value="已加入"/></div> ';
					}
					var ItemElement = $(ItemHtmlString);
					$("#workspace-recommend").append(ItemElement);
				}
				displayWorkspaceRecommend();
				$(".workspace-recommend span").click(recommendDetailClick);
				$(".workspace-recommend input").click(workspaceAttentionClick);
				$("img.lazy").lazyload({
					effect: "fadeIn"
				});
			}
			break;
		case 3: //通知公告
			$("#workspace-topic .workspace-resource").empty();
			if(data.length == 0) {
				$("#workspace-topic .workspace-resource").append('<span>抱歉，现在还没有公告</span>');
			} else {
				for(var index in data) {
					var ItemHtmlString = '<li data-id="' + data[index].id + '"><span class="resource-name"><a href="notice_details.html?titleID=' + data[index].id + '&studioID=' + getQueryObj().studioID + '">' + data[index].title + '</a></span>' +
						'<span class = "resource-time">' + getDataTime(data[index].createTime) + '</span><li>';
					var ItemElement = $(ItemHtmlString);
					$("#workspace-topic .workspace-resource").append(ItemElement);
				}
			}
			break;
		case 4: //加载名师课堂
			$("#workspace-classes .clearFix").empty();
			if(data.length == 0) {
				$("#workspace-classes .clearFix").append('<span>抱歉，现在还没有名师课堂</span>');
			} else {
				for(var index in data) {
					var ItemHtmlString = '<div class = "classes-video-area" data-id="' + data[index].id + '">';
					ItemHtmlString += '<div class="classes-video-pic"><img src = "images/display.png"/>' +
						'</div><span class="class-title">' + data[index].title + '</span><span class="class-name">' + getDataTime(data[index].uploadTime) + '</span></div>';
					var ItemElement = $(ItemHtmlString);
					$("#workspace-classes .clearFix").append(ItemElement);
					$(".classes-video-area img").click(classVideoClick);
				}
			}
			break;
		case 5:
			/*//教学资源
			$("#workspace-resources .theme-list").empty();
			for (var index in data) {
				var ItemHtmlString = '<li class="theme-small-title';
				if (index == 0) {
					ItemHtmlString += 'blue-title-itme"><span>';
				} else {
					ItemHtmlString += 'gray-title-itme"><span>';
				}
				ItemHtmlString += '' + data[index].name + '</span></li>';
				var ItemElement = $(ItemHtmlString);
				$("#workspace-resources .theme-list").append(ItemElement);
			}
			initTitleItemClick(".theme-small-title", "#workspace-resources", ".tab-resource", "blue-title-item", "gray-title-item");*/
			break;
		case 6: //教学研究
			$("#workspace-reaserch .workspace-resource").empty();
			if(data.length == 0) {
				$("#workspace-reaserch .workspace-resource").append('<span>抱歉，现在还没有教学研究</span>');
			} else {
				for(var index in data) {
					var ItemHtmlString = '<li data-id="' + data[index].id + '"><span class="resource-name"><a href="topicdiscussion_details.html?studioID=' + getQueryObj().studioID + '&titleID=' + data[index].id + '">' + data[index].title + '</a></span>' +
						'<span class = "resource-time">' + getDataTime(data[index].createTime) + '</span><li>';
					var ItemElement = $(ItemHtmlString);
					$("#workspace-reaserch .workspace-resource").append(ItemElement);
				}
			}
			break;
		case 7: //教学研讨
			$("#workspace-discussion .workspace-resource").empty();
			if(data.length == 0) {
				$("#workspace-discussion .workspace-resource").append('<span>抱歉，现在还没有教学研讨</span>');
			} else {
				for(var index in data) {
					var ItemHtmlString = '<li data-id="' + data[index].id + '"><span class="resource-name"><a href="teacherResearch_details.html?studioID=' + getQueryObj().studioID + '&titleID=' + data[index].id + '">' + data[index].title + '</a></span>' +
						'<span class = "resource-time">' + getDataTime(data[index].createTime) + '</span><li>';
					var ItemElement = $(ItemHtmlString);
					$("#workspace-discussion .workspace-resource").append(ItemElement);
				}
			}

			break;
		case 8: //教学文章
			$("#workspace-articles .workspace-resource").empty();
			if(data.length == 0) {
				$("#workspace-articles .workspace-resource").eq(0).append('<span>抱歉，现在还没有教学文章</span>');
			} else {
				for(var index in data) {
					var ItemHtmlString = '<li data-id="' + data[index].id + '"><span class="resource-name"><a href="teaching_article_details.html?titleID=' + data[index].id + '&studioID=' + getQueryObj().studioID + '">' + data[index].title + '</a></span>' +
						'<span class = "resource-time">' + getDataTime(data[index].createTime) + '</span><li>';
					var ItemElement = $(ItemHtmlString);
					if(index < 5) {
						$("#workspace-articles .workspace-resource:eq(0)").append(ItemElement);
					} else {
						$("#workspace-articles .workspace-resource:eq(1)").append(ItemElement);
					}
				}
			}
			break;
		case 9: //资源Tab数据
			$("#workspace-resources .tab-resource").remove();
			var dataArray = new Array();
			dataArray[0] = data.courseware;
			dataArray[1] = data.teachPlan;
			dataArray[2] = data.material;
			dataArray[3] = data.exercise;
			for(var index in dataArray) {
				var dataItem = dataArray[index];
				if(index == 0) {
					var ItemHtmlString = '<div class="tab-resource"><ul class="workspace-resource topic">';
				} else {
					var ItemHtmlString = '<div class="tab-resource" style="display:none;"><ul class="workspace-resource topic">';
				}
				if(dataItem.length == 0) {
					ItemHtmlString += '<span>抱歉，现在还没有相应资源</span></ul></div>';
				} else {
					for(var temp in dataItem) {
						var titleName = dataItem[temp].title + '.' + dataItem[temp].fileFormat;
						ItemHtmlString += '<li style="background:none" data-id ="' + dataItem[temp].id + '">';
						ItemHtmlString += '<span class="' + tsInfoHelper.getTypeIcon(dataItem[temp].fileFormat) + '"></span>';
						ItemHtmlString += '<span class="resource-name"><a href="teachresource_details.html?studioID=' + getQueryObj().studioID + '&titleID=' + dataItem[temp].id + '">' + titleName +
							'</a></span><span class="resource-time">' + getDataTime(dataItem[temp].uploadTime) + '</span></li>';
						if(temp == 4) {
							ItemHtmlString += '</ul>';
							if(dataItem.length > 5) {
								ItemHtmlString += '<ul class ="workspace-resource topic" style="float:right;">';
								continue;
							} else {
								break;
							}
						}
						if(temp == 9) {
							ItemHtmlString += '</ul></div>';
							break;
						}
					}
				}
				var ItemElement = $(ItemHtmlString);
				$("#workspace-resources").append(ItemElement);
			}
			break;
		default:
			console.log("数据错误");
	}
}
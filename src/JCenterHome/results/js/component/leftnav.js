define("leftnav", ['jquery'], function($) {
	var leftnav = {
		res_count: new Array(),
		parent: undefined,
		fixed_category: new Array("备课资源", "我的试题", "教学反思", "教学文章", "我的微课", "课题研究"),
		id_list: new Array(),
		self_define: new Array(), //自定义标签名称
		old_name: "",
		user: "admin",
		old_count: 0,
		pageTurn: function() {},
		/**
		 * 
		 * @param {Object} data 初始化数据
		 * @param {Object} parent  父级jquery对象
		 * @param {Object} pageTurn 页面切换函数
		 */
		init: function(data, parent, pageTurn) {
			leftnav.parent = parent;
			leftnav.pageTurn = pageTurn; //进入页面首先展示
			for(var i = 0; i < data.mapList.length; i++) {
				if(i == 0) {
					pageTurn(data.mapList[0].id,leftnav.user,"te");
				}
				this.res_count.push(data.mapList[i].total);
				this.id_list.push(data.mapList[i].id);
				if(i >= leftnav.fixed_category.length) {
					leftnav.self_define.push(data.mapList[i].name);
				}
			}
			parent.html('<ul class="left-nav-ul"></ul>');
			leftnav.addFixedCategory();
			leftnav.addSelfDefineCategory();
			leftnav.addAddArea();
			leftnav.bindEvent();
		},
		addFixedCategory: function() {
			var innerHtml = '';
			for(var i = 0; i <= 5; i++) {
				if(i == 0) {
					innerHtml += '<li class="left-nav-li checked" data-id="' + leftnav.id_list[i] + '"><span class="category-name">' + leftnav.fixed_category[i] + '(' + leftnav.res_count[i] + ')</span></li>';
				} else {
					innerHtml += '<li class="left-nav-li"><span class="category-name">' + leftnav.fixed_category[i] + '(' + leftnav.res_count[i] + ')</span></li>';
				}
			}
			leftnav.parent.children("ul").html(innerHtml);
		},
		/**
		 * 添加自定义分类
		 */
		addSelfDefineCategory: function() {
			var innerHtml = '';
			for(var i = 0; i < leftnav.self_define.length; i++) {
				innerHtml += '<li class="left-nav-li edit-li" data-id="' + leftnav.id_list[i + 6] + '"><div class="self_edit_category"><span class="category-name">' + leftnav.self_define[i] + "(" + leftnav.res_count[6 + i] + ')</span>';
				innerHtml += '<img src="./images/edit.png" /></div><div class="category-edit" style="display: none;"><input type="text" />';
				innerHtml += '<input type="button" class="admit-button" value="保存"/></div></li>';
			}
			leftnav.parent.children("ul").append(innerHtml);
		},
		/**
		 * 添加底部添加自定义区域
		 */
		addAddArea: function() {
			var innerHtml = '<li class="left-nav-li edit-li"><div class="add-show"><span><img src="./images/add.png"/>添加分类</span>';
			innerHtml += '</div><div class="category-edit" style="display: none;"><input type="text" />';
			innerHtml += '<input type="button" class="admit-button" value="保存"/></div></li>';
			leftnav.parent.children("ul").append(innerHtml);
		},
		/*
		 *统一绑定事件
		 */
		bindEvent: function() {
			leftnav.parent.find(".category-name").unbind().bind("click", leftnav.categoryclick);
			leftnav.parent.find(".self_edit_category").find("img").unbind().bind("click", leftnav.editname);
			leftnav.parent.find(".add-show > span").unbind().bind("click", leftnav.editname);
			leftnav.parent.find("input[type=button]").unbind();
		},
		/**
		 * 分类被点击
		 */
		categoryclick: function() {
			leftnav.parent.find("li").removeClass("checked");
			$(this).parents("li").addClass("checked");
			//todo:选项被选择的调用函数
			leftnav.pageTurn($(this).parents("li").data("id"), leftnav.user, "te");
		},
		/**
		 * 显示编辑内容区域
		 */
		editname: function() {
			if($(this).parents(".edit-li").children().is(".self_edit_category")) {
				var oldString = $(this).siblings("span").html();
				leftnav.old_name = oldString.split("(")[0];
				leftnav.old_count = oldString.split("(")[1].split(")")[0];
			}
			$(this).parents(".edit-li").children().hide().eq(1).show();
			$(this).parents(".edit-li").find("input:text:first").focus().unbind().blur(function() {
				leftnav.stopEdit($(this));
			});
		},
		/**
		 * 保存分类名字
		 */
		savename: function(item) {
			var newName = item.val();
			if(newName == "" || newName == leftnav.old_name || newName == undefined) {
				return;
			} else {
				if(item.parents(".edit-li").children().is(".self_edit_category")) {
					leftnav.changeCategoryFromServer(newName, item);
				} else {
					//添加分类，同时同步服务器
					leftnav.addCategoryFromServer(newName);
				}
			}
			item.parents(".edit-li").children().hide().eq(0).show();
		},
		/**
		 * 添加分类调用
		 */
		addCategroy: function(name, id) {
			var insertHtml = '<li class="left-nav-li edit-li" data-id="' + id + '"><div class="self_edit_category"><span class="category-name">' + name + '(0)</span>';
			insertHtml += '<img src="./images/edit.png"/></div><div class="category-edit" style="display:none;"><input type="text"/>';
			insertHtml += '<input type="button" class="admit-button" value="保存" onclick="savename(this)"/></div></li>';
			$(".left-nav-ul > li:last-child").before(insertHtml);
			leftnav.bindEvent();
			leftnav.self_define.push(name);
			leftnav.res_count.push(0);
		},
		/**
		 * 点击其他地方还原编辑前状态
		 */
		stopEdit: function(item) {
			leftnav.savename(item);
			item.val("");
			leftnav.parent.find(".category-edit:visible").hide().unbind().siblings(".add-show,.self_edit_category").show();
		},
		/**
		 * 服务器端添加分类
		 * @param {Object} newName
		 */
		addCategoryFromServer: function(newName) {
			$.ajax({
				type: "post",
				url: 'http://localhost:8080/rrt/tagManager/addTag',
				data: {
					name: newName,
					creater: leftnav.user
				},
				dataType: 'json'
			}).success(function(data) {
				if(data.success) {
					leftnav.addCategroy(newName, data.id);
				} else {
					console.log(data.desc);
				}
			})
		},
		/**
		 * 服务器端更改分类名称
		 * @param {Object} newName
		 */
		changeCategoryFromServer: function(newName, item) {
			$.ajax({
				type: "post",
				url: 'http://localhost:8080/rrt/tagManager/updateTag',
				data: {
					id: 1,
					name: newName
				},
				dataType: 'json'
			}).success(function(data) {
				if(data.success) {
					item.parents(".edit-li").find("span").html(newName + "(" + leftnav.old_count + ")");
					leftnav.old_name = "";
					leftnav.old_count = 0;
				} else {
					console.log(data.desc);
				}
			})
		}
	}
	return leftnav;
});
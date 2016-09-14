define("leftnav", ['jquery'], function($) {
	var leftnav = {
		res_count: new Array(),
		parent: undefined,
		fixed_category: new Array("备课资源", "我的试题", "教学反思", "教学文章", "我的微课", "课题研究"),
		self_define: new Array(),
		old_name: "",
		/**
		 * 左边导航初始化
		 * @param {Object} data 初始化数据
		 * @param {Object} parent  父级jquery对象
		 */
		init: function(data, parent) {
			leftnav.parent = parent;
			for(var i = 0; i < 7; i++) { 
				this.res_count.push(40);
			}
			leftnav.self_define.push("化学生物研究");
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
					innerHtml += '<li class="left-nav-li checked"><span class="category-name">' + leftnav.fixed_category[i] + '(' + leftnav.res_count[i] + ')</span></li>';
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
				innerHtml += '<li class="left-nav-li edit-li"><div class="self_edit_category"><span class="category-name">' + leftnav.self_define[i] + "(" + leftnav.res_count[6 + i] + ')</span>';
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
		 *绑定事件
		 */
		bindEvent: function() {
			leftnav.parent.find(".category-name").bind("click", leftnav.categoryclick);
			leftnav.parent.find(".self_edit_category").find("img").bind("click", leftnav.editname);
			leftnav.parent.find(".add-show > span").bind("click", leftnav.editname);
			leftnav.parent.find("input[type=button]").bind("click", leftnav.savename);
			leftnav.parent.find(".edit-li").blur(leftnav.endEdit);
		},
		/**
		 * 分类被点击
		 */
		categoryclick: function() {
			leftnav.parent.find("li").removeClass("checked");
			$(this).parents("li").addClass("checked");
			//点击更改内容代码
		},
		/**
		 * 显示编辑内容区域
		 */
		editname: function() {
			if($(this).parents(".edit-li").children().is(".self_edit_category")) {
				leftnav.old_name = $(this).siblings("span").html().split("(")[0];
			}
			$(this).parents(".edit-li").children().hide().eq(1).show();
		},
		/**
		 * 保存分类名字
		 */
		savename: function() {
			var newName = $(this).siblings("input[type=text]").attr("value");
			if(newName == leftnav.old_name) {
				return;
			} else {
				if($(this).parents(".edit-li").children().is(".self_edit_category")) {
					/*$(this).parents(".edit-li").find("span").html(newName+);*/
					//同步服务器，同时更改名字
				} else {
					//添加分类，同时同步服务器
				}
			}
			leftnav.old_name = "";
			$(this).parents(".edit-li").children().hide().eq(0).show();
		},
		/**
		 * 添加分类调用
		 */
		addCategroy: function(name) {
			//使用名字添加分类，返回issuccess
			var issuccess = true;
			var insertHtml = '<li class="left-nav-li edit-li"><div class="slef_edit_category"><span>' + name + '(0)</span>';
			insertHtml += '<img src="./images/edit.png"/></div><div class="categroy-edit" style="display:none;"><input type="text"/>';
			insertHtml += '<input type="button" class="admit-button" value="保存" onclick="savename(this)"/></div></li>';
			$(".left-nav-ul > li:last-child").before(insertHtml);
			leftnav.bindEvent();
		},
		/**
		 * 点击其他地方还原编辑前状态
		 */
		endEdit:function(){
			alert("onblur");
			leftnav.parent.find(".category-edit:visible").hide().siblings(".add-show,.self_edit_category").show();
		}
	}
	return leftnav;
});
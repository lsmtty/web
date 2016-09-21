define("mockmodule", ["mock"], function(Mock) {
	var Random = Mock.Random;
	Mock.setup({
		timeout: 300
	});
	return {
		getCategoryList: function() {
			Mock.mock(
				'http://localhost:8080/rrt/tagManager/listTag?user=admin&space=te',
				'get', {
					"desc": "查询成功！",
					"mapList|6-10": [{
						"id|1": ["beikeziyuan", "wodezuoye", "wodesiti"],
						"name|+1": ["备课资源", "我的作业", "我的试题", "教学反思", "教学文章", "我的微课", "课题研究"],
						"total|0-40": 12
					}],
					"success": Random.boolean(3, 1, true)
				}
			);
		},
		addCategory: function() {
			Mock.mock(
				'http://localhost:8080/rrt/tagManager/addTag',
				'post', {
					"desc": "保存成功！",
					"id": Random.natural(1, 50),
					"success": Random.boolean(3, 1, true)
				}
			);
		},
		changeCategory: function() {
			Mock.mock(
				'http://localhost:8080/rrt/tagManager/updateTag',
				'post', {
					"desc": "修改成功！",
					"success": Random.boolean(3, 1, true)
				}
			);
		},
		getSecondCategory: function() {
			Mock.mock(
				'http://localhost:8080/rrt/dataManager/getData?key=beikeziyuan',
				'get', {
					"id": /\d{5,10}/,
					"mapList|3-5": [{
						"id": /\d{5,10}/,
						"name": Random.cname(),
					}],
					"success": Random.boolean(3, 1, true)
				}
			);
		},
		getResultList: function() {
			Mock.mock(
				'http://localhost:8080/rrt/achievementManager/pageList',
				'post', {
					"lastPage": Random.boolean(3, 1, false),
					"pageSize": 15,
					"pageNumber": 1,
					"firstPage": true,
					"list|3-15": [{
						"subject_name": "s5",
						"grade_name": "g5",
						"subject_id": "e",
						"share_flag": Random.boolean(3, 1, true),
						"creater": "admin",
						"phase_name": "a5",
						"second_type": "second_type5",
						"publish_name": "p5",
						"id": "ee",
						"resource_id": "asdf",
						"publish_id": "ee",
						"title": "t5",
						"update_time": "2016-09-19 15:57:45",
						"create_time": "2016-09-19 15:55:56",
						"first_type": "first_type5",
						"grade_id": "5",
						"phase_id": "phase_id5",
						"descr": null
					}],
					"totalRow": 5,
					"totalPage": 2
				}
			);
		}
	};
});
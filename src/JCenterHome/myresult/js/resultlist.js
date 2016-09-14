require.config({
	baseUrl: 'js/component/',
	paths: {
		"mock": "http://mockjs.com/dist/mock",
		"jquery": "../../../../lib/jquery/jquery-1.9.1",
		"tools": "../../../../base/js/requiretools",
	},
	enforeDefine: true
});
require(['jquery', 'leftnav'], function($, leftnav) {
	leftnav.init("{}", $(".left-nav"));
});
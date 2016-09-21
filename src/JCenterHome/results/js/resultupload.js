require.config({
	baseUrl: 'js/component/',
	paths: {
		"mock": "http://mockjs.com/dist/mock",
		"jquery": "../../../../lib/jquery/jquery-1.9.1",
		"tools": "../../../../base/js/requiretools",
		"mockmodule": "../../../../../mock/mockmodule",
		"resultuploadmock": "../../../../../mock/resultuploadmock"
	},
	enforeDefine: true
});

require(['jquery','tools'],function($,tools){
	initViews($,tools);
});

function initViews($,tools){
	tools.textHint($('#title-input'));
	tools.titleNum($('#title-input'), $('#nuw-num'), 20);
	$("#delete-file img").attr("src","images/close_blue.png");
}

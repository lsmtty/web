define("requireCommon", ['require'], function(requirejs) {
	requirejs.config({
		baseUrl: '../../',
		paths: {
			"mock": "http://mockjs.com/dist/mock",
			"jquery": "lib/jquery/jquery-1.9.1",
			"webuploader": "base/component/upload/js/webuploader",
			"upload": "base/component/upload/image-js/uploadnew",
			"tools":"base/js/requiretools",
		},
		enforeDefine: true
	});
	return {
	}
})
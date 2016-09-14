// 文件上传
jQuery(function () {
    var $ = jQuery,
        $list = $('#thelist'),
        $btn = $('#ctlBtn');

        var state = 'pending',
            uploader;
        //当前没有文件隐藏开始及清空按钮
        $btn.hide();
        uploader = WebUploader.create({

            // 不压缩image
            resize: false,

            // swf文件路径
            swf: './file-js/Uploader.swf',

            // 文件接收服务端。
            server:'',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker'
        });

        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            $list.append('<div id="' + file.id + '" class="item">' +
                '<h4 class="info">' + file.name + '</h4>' +
                '<p class="state">等待上传...</p>' +
                '<span class="remove">删除</span>' +
                '</div>');
            //加载文件后显示按钮
            $btn.show();
            $('#' + file.id).find('.remove').on('click', function () {
                uploader.removeFile(file);
                $('#' + file.id).remove();

                //如果当前没有文件则隐藏上传和清空按钮
                if ($('.remove').length == 0) {
                    $btn.hide();
                }
            })
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress .progress-bar');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                    '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                    '</div>' +
                    '</div>').appendTo($li).find('.progress-bar');
            }
            $li.find('p.state').text('上传中');
            $li.find('.remove').hide();
            $percent.css('width', percentage * 100 + '%');
        });
        uploader.on('uploadSuccess', function (file) {
            //上传完成后显示清除按钮
            $('#' + file.id).find('.remove').show();
            $('#' + file.id).find('p.state').text('已上传');
        });

        uploader.on('uploadError', function (file) {
            //上传出错后显示清除按钮
            $('#' + file.id).find('.remove').show();
            // $clear.show();

            $('#' + file.id).find('p.state').text('上传出错');
        });

        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').fadeOut();
        });

        uploader.on('all', function (type) {
            if (type === 'startUpload') {
                state = 'uploading';
            } else if (type === 'stopUpload') {
                state = 'paused';
            } else if (type === 'uploadFinished') {
                state = 'done';
            }

            if (state === 'uploading') {
                $btn.text('暂停上传');
            } else {
                $btn.text('开始上传');
            }
        });
        var spaceId = $("#spaceId").val();
        $btn.on('click', function () {
            uploader.options.server = '';
            if (state === 'uploading') {
                uploader.stop(true);
            } else {
                uploader.upload();
            }
        });
});

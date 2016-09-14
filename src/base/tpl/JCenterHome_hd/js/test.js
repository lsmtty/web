require.config({
    paths: {
        "layout": "hd_ft"
    }
});
require(['layout'],function(aaa){
    var data = {
        topNav:{
            mySpace: 'javascript:;',
            classSpace: 'javascript:;',
            schoolSpace: 'javascript:;',
            subjectSpace: 'javascript:;',
            regionSpace: 'javascript:;',
            messageLink: 'javascript:;',
            messageNum: 10,
        },
        user:{
            userName: '姓名',
            userPic: ''
        },
        spaceNav:{
            home: 'javascript:;',
            achievements: 'javascript:;',
            topic: 'javascript:;',
            collection: 'javascript:;',
            app: 'javascript:;'
        }
    }

    aaa.header(data);


})
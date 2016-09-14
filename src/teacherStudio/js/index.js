$(function () {
    var userinfo = {};

    function initPage() {
        var queryObj = getQueryObj();
        if (queryObj.sessionId) {
            setCookie("JSESSIONID", queryObj.sessionId);
            window.location.search = "";
        }
        commonHelper.initUserInfo(initEntryandData);
        if (!queryObj.sessionId) {
            initBannerEntry();
        }
        tsViewtplHelper.initBasicViews(3);

        initDynamicData();
        initrecomStudioData();
        initList();
        pageStudio = getPagingBar(fn);
        fn(0);
        addEvents();
    }
    initPage();

    function addEvents() {
        $("#period-list").click(searchStudio);
        $("#subject-list").click(searchStudio);
        $(".search-btn").click(searchStudio);
    }

    function initEntryandData(data) {
        userinfo.userType = data.userType;
        userinfo.guid = data.guid;
        initBannerEntry();
    }

    function initBannerEntry() {
        isCreateStudio(showMyCreateStudio);
        isAddStudio(showMyAddStudio);
    }

    function isCreateStudio(callback) {
        var guid = readCookie("guid");
        if (!guid) {
            guid = userinfo.guid;
        }
        if (guid) {
            var queryStudioURL = studioHost + "portal/queryStudioByCreater";
            $.ajax({
                type: 'get',
                url: queryStudioURL
            }).success(function (data) {
                if (data.id !== null && data.id !== undefined) {
                    callback(data.id);
                }
                else {
                    var userType = readCookie("userType");
                    if (!userType) {
                        userType = userinfo.userType;
                    }
                    if (userType == "teacher") {
                        showCreateButton();
                    }
                }
            }).error(function (jqxhr) {
                if (jqxhr.status == "401") {

                }
            })
        }
    }

    function isAddStudio(callback) {
        var guid = readCookie("guid");
        if (!guid) {
            guid = userinfo.guid;
        }
        if (guid) {
            var queryAddStudioURL = studioHost + "portal/isMember";
            $.ajax({
                type: 'get',
                url: queryAddStudioURL
            }).success(function (data) {
                if (data) {
                    callback();
                }
            }).error(function (jqxhr) {
                if (jqxhr.status == '401') {

                }
            })
        }
    }

    function showMyCreateStudio(studioID) {
        $("#banner-create").removeClass("hidden");
        var hrefString = './workspace_index.html?studioID=' + studioID;
        $("#banner-create").attr("href", hrefString);
    }

    function showCreateButton() {
        $("#banner-create").removeClass("hidden");
        var hrefString = './create_studio.html';
        $("#banner-create").attr("href", hrefString);
        $("#banner-create").text("创建我的工作室");
    }

    function showMyAddStudio() {
        $("#banner-add").removeClass("hidden");
    }

    function initList() {
        var periodURL = studioHost + 'sysDic/loadPeriod';
        $.ajax({
            type: "get",
            url: periodURL
        }).success(function (data) {
            initPeriodList(data);
        });

        var subjectURL = studioHost + "/sysDic/loadSubject";
        $.ajax({
            type: 'get',
            url: subjectURL
        }).success(function (data) {
            initSubjectList(data);
        });
    }

    function initDynamicData() {
        var dynamicURL = studioHost + "portal/loadDynamic/8";
        $.ajax({
            type: "get",
            url: dynamicURL
        }).success(function (data) {
            initDynamicHtml(data);
        })
    }

    function initrecomStudioData() {
        var recomURL = studioHost + 'portal/recomStudio/2/4/4';
        $.ajax({
            type: "get",
            url: recomURL
        }).success(function (data) {
            console.log(data);
            initRecomStudioHtml(data);
        })
    }

    function getOrderValue() {
        var orderVal = "fansNum";
        var ordertext = $("#order-list").children(".blue-text").text();
        if (ordertext.subCompare(0, 3, "成员数") == 0) {
            orderVal = "memberNum";
        }
        if (ordertext.subCompare(0, 3, "访问量") == 0) {
            orderVal = "traffic";
        }
        return orderVal;
    }

    function getAllStudioData(index) {
        var allStudioURL = studioHost + "portal/queryPageStudio";
        var periodvalue = $("#period-list").children(".active").data("dicid");
        if (periodvalue == 0) {
            periodvalue = '';
        }
        var subjectvalue = $("#subject-list").children(".active").data("dicid");
        if (subjectvalue == 0) {
            subjectvalue = '';
        }
        var fuzzyvalue = $(".search-text").val();
        var ordervalue = getOrderValue();
        $.ajax({
            type: "get",
            url: allStudioURL,
            data: {
                period: periodvalue,
                subject: subjectvalue,
                fuzzy: fuzzyvalue,
                order: ordervalue,
                pageSize: 20,
                currentPage: index
            }
        }).success(function (data) {
            initAllStudioHtml(data);

        })
    }

    function searchStudio() {
        getAllStudioData(1);
    }

    function initPeriodList(data) {
        $("#period-list").append(getPeriodHtml(data));
    }

    function initSubjectList(data) {
        $("#subject-list").append(getSubjectHtml(data));
    }

    function initDynamicHtml(data) {
        $(".dyn").append(getDynamicHtml(data));

    }

    function initRecomStudioHtml(data) {
        if (data) {
            $(".rec-content").append(getRecomStudioHtml(data));
        }
        else {
            $(".rec-content").text('没有推荐的工作室');
        }
        $(".rec-content .attention").unbind().bind("click", focusStudios);
    }

    function initAllStudioHtml(data) {
        $(".studio-list").empty();
        if (data.datalist.length > 0) {
            $(".studio-list").append(getAllStudioHtml(data.datalist));
        }
        else {
            $(".studio-list").text('暂时没有工作室');
        }

        $("#search-num").html(data.page.totalCount);
        if (Math.ceil(data.page.totalCount / PAGE_COUNT) != pageStudio.getPageSize()) {
            pageStudio.reloadPage(Math.ceil(data.page.totalCount / PAGE_COUNT));
        }
        $(".attention").unbind().bind("click", focusStudios);
    }

    function focusStudios() {
        var studioID = $(this).closest("li").data("studioid");
        var isRecStudio = false;
        if (!studioID) {
            studioID = $(this).parents(".a-studio").data("studioid");
            isRecStudio = true;
        }
        var focusURL = studioHost + "attention/save";
        var _this = $(this);
        $.ajax({
            type: "post",
            url: focusURL,
            data: {
                studioId: studioID
            }
        }).success(function () {
            toast('<span class="icon-success"></span>关注成功');            
            $(_this).parent().html('<a class="join btn-active" href="javaScript:;">已关注</a>');
            dealConnectedStudio(studioID, isRecStudio);
        }).error(function () {
            toast('<span class="icon-error"></span>关注失败');
        })
    }

    function dealConnectedStudio(studioID, isRecStudio) {
        if (!studioID)
            return;
        if (isRecStudio) {
            $(".studios-box li").each(function () {
                if ($(this).data("studioid") == studioID) {
                    var btns = $(this).find(".btns");
                    if (btns) {
                        btns.empty();
                        btns.append('<a class="join btn-active" href="javaScript:;">已关注</a>');
                    }
                }
            })
        } else {
            $(".a-studio").each(function () {
                if ($(this).data("studioid") == studioID) {
                    var btns = $(this).find(".btns");
                    if (btns) {
                        btns.empty();
                        btns.append('<a class="join btn-active" href="javaScript:;">已关注</a>');
                    }

                }
            })
        }
    }

    function initPaging(pageCount) {
        if (pageCount <= 0) {
            $("#paging").addClass("hidden");
        } else {
            $("#paging").removeClass("hidden");
            pagingFn(pageCount, fn);
        }
    }

    function getPeriodHtml(data) {
        var html = '<li class="kind-li active" data-dicid = "0">全部</li>';
        for (var index = 0; index < data.length; index++) {
            html = html + '<li class="kind-li" data-dicid = "' + data[index].dicId + '">' + data[index].dicName + '</li>';
        }
        return html;
    }

    function getSubjectHtml(data) {
        var html = '<li class="kind-li active" data-dicid = "0">全部</li>';
        for (var index = 0; index < data.length; index++) {
            html = html + '<li class="kind-li" data-dicid = "' + data[index].dicId + '">' + data[index].dicName + '</li>';
        }
        return html;
    }

    function getAllStudioHtml(data) {
        console.log(data);
        var html = "";
        for (var index = 0; index < data.length; index++) {
            html = html + '<li class="studio-li gray-text" data-studioid= "' + data[index].id + '">' +
                '<div class="msg-top">' +
                '<a class="user-pic" href="javascript:;">' +
                '<img src="' + data[index].icon + '" alt="">' +
                '</a>' +
                '<div class="studio-msg">' +
                '<p><a class="studio-name blue-text hide-text" href="workspace_index.html?studioID=' + data[index].id + '" target="_blank">' + data[index].name + '</a></p>' +
                '<p class="black-text">';
            if (data[index].sysUser) {
                html = html + '创建人：<span class="founder">' + data[index].sysUser.username + '</span>';
            }

            html = html + '</p>' +
                '</div>';

            html = html + getRelationHtml(data[index].relation);

            html = html + '</div>' +
                '<div class="record">' +
                '<div class="record-kind">成员数：<span class="num">' + data[index].memberNum + '</span></div>' +
                '<div class="record-kind">粉丝数：<span class="num">' + data[index].fansNum + '</span></div>' +
                '<div class="record-kind">访问量：<span class="num">' + data[index].traffic + '</span></div>' +
                '</div>' +
                '</li>';
        }
        return html;

    }

    function getDynamicType(type) {
        var TypeDesc = {
            desc: "发表了文章",
            path: ""
        };
        switch (type) {
            case 1:
                {
                    TypeDesc.desc = "发表了文章";
                    TypeDesc.path = "teaching_article";
                    break;
                }
            case 2:
                {
                    TypeDesc.desc = "上传了教学资源";
                    TypeDesc.path = "teachresource";
                    break;
                }
            case 3:
                {
                    TypeDesc.desc = "发表了课题";
                    TypeDesc.path = "topicdiscussion";
                    break;
                }
            case 4:
                {
                    TypeDesc.desc = "上传了名师课堂";
                    TypeDesc.path = "class";
                    break;
                }
            case 5:
                {
                    TypeDesc.desc = "发起了教学研讨";
                    TypeDesc.path = "teacherResearch";
                    break;
                }
        }
        return TypeDesc;
    }

    function getDynamicHtml(data) {

        var html = '<ul class="dyn-list clearFix">';
        if (data.length > 0) {
            for (var index = 0; index < data.length; index++) {
                html = html + '<a class="" href="' + getDynamicType(data[index].type).path + "_details.html?studioID=" + data[index].studioId + "&titleID=" + data[index].id + '" target="_blank">' +
                    '<li class="li clearFix">' +
                    '<span class="user-pic">' +
                    '<img src="' + data[index].sysUser.avatar + '" alt="">' +
                    '</span>' +
                    '<div class="dyn-msg">' +
                    '<p class="hide-text">' +
                    '<span class="user-name" href="javascript:;">' + data[index].sysUser.username + '</span>' +
                    '</p>' +
                    '<p class="hide-text">' +
                    '<span class="school" > ' + data[index].sysUser.orgName + '</span >' +
                    '</p >' +
                    '<p class="hide-text">' +
                    '<span class="time">' + data[index].createTime + '</span>' +
                    '</p>' +
                    '</div >' +
                    '<p class="artcile hide-text">' + getDynamicType(data[index].type).desc +
                    '<span class = "blue-text">' + data[index].title + '</span>' +
                    '</p>' +
                    '</li >' + '</a>';
            }
        } else {
            html = html + "没有新的动态";
        }

        html += '</ul >';
        return html;
    }

    function getRelationHtml(relation) {
        var userRole = userRoleHelper.getUserRolebyrelationID(relation);
        var html = "";

        if (userRole.role == USERROLE.MEMBER) {
            html = '<p class="btns">' +
                '<a class="join btn-active" href="javaScript:;">已加入</a>' +
                '</p>';
        }
        else if (userRole.role == USERROLE.APPLICATION) {
            html = '<p class="btns">' +
                '<a class="join btn-active" href="javaScript:;">申请中</a>' +
                '</p>';
        }
        else if (userRole.follow) {
            html = '<p class="btns">' +
                '<a class="join btn-active" href="javaScript:;">已关注</a>' +
                '</p>';
        }
        if (userRole.role == USERROLE.NONE && !userRole.follow) {
            html = '<p class="btns">' +
                '<a class="attention btn" href="javaScript:;">关注</a>' +
                '</p>';
        }
        return html;
    }

    function getRecomStudioHtml(data) {
        var html = "";
        if (!data)
            return html;
        for (var index = 0; index < data.length; index++) {
            html = html + '<div class="a-studio" data-studioid = "' + data[index].id + '">' +
                '<div class="header clearFix gray-text">' +
                '<a class="user-pic" href="./workspace_index.html?studioID=' + data[index].id + '">' +
                '<img src="' + data[index].icon + '" alt="">' +
                '</a>' +
                '<div class="msg">' +
                '<p>' +
                '<a class="stuido-name blue-text hide-text" href="./workspace_index.html?studioID=' + data[index].id + '" target="_blank">' + data[index].name + '</a>' +
                '</p>' +
                '<p>' +
                '<span class="kind">成员数：<span class="num">' + data[index].memberNum + '</span></span>' +
                '<span class="kind">粉丝数：<span class="num">' + data[index].fansNum + '</span></span>' +
                '<span class="kind">访问量：<span class="num">' + data[index].traffic + '</span></span>' +
                '</p>' +
                '</div>';
            html = html + getRelationHtml(data[index].relation);
            html = html + '</div>' +
                '<div class="resource clearFix">' +
                '<div class="a-resource">' +
                '<h3 class="res-title">教学资源</h3>' +
                '<ul class="res-list">';
            if (data[index].resourceList) {
                for (var irsIndex = 0; irsIndex < data[index].resourceList.length; irsIndex++) {
                    html = html + getResourceHtml(data[index].id, data[index].resourceList[irsIndex]);
                }
            };

            html = html + '</ul></div>' +
                '<div class="a-resource">' +
                '<h3 class="res-title">课题研究</h3>' +
                '<ul class="res-list">';
            if (data[index].researchList) {
                for (var iresIndex = 0; iresIndex < data[index].researchList.length; iresIndex++) {
                    html = html + getResearchHtml(data[index].id, data[index].researchList[iresIndex]);
                }
            };

            html = html + '</ul>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        return html;
    }

    function getResourceHtml(studioID, data) {
        var html = '<li class="res-li hide-text">' +
            '<span class="icon-dot"></span>' +
            '<a href="./teachresource_details.html?studioID=' + studioID + "&titleID=" + data.id + '" target="_blank">' + data.title + '</a></li>';
        return html;
    }

    function getResearchHtml(studioID, data) {
        var html = '<li class="res-li hide-text">' +
            '<span class="icon-dot"></span>' +
            '<a href="./topicdiscussion_details.html?studioID=' + studioID + "&titleID=" + data.id + '" target="_blank">' + data.title + '</a></li>';
        return html;
    }

    //搜索提示
    textHint($('.search-text'))

    /* 名师条件选择点击切换 */
    $('.kind-list').on('click', '.kind-li', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    })
    $('.way-li').on('click', function () {
        $(this).siblings().removeClass('blue-text');
        $(this).addClass('blue-text');
        searchStudio();
    })

    function fn(i) {
        getAllStudioData(i + 1);

    }
})
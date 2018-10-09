var emergency = new Vue({
    el: "#emergency",
    data: {
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: '',
        },
        eventList: {}, //列表对象
        eventModel: {},//临时缓存用
        categoryList:{},
        typeList:{},
        groupList:{},
        noticeModel:{
            type:"",
            name:"",
        },
        processModel:{}
    },
    mounted: function () {
        this.selectEventList();
        this.initMap();
        this.initData();

    },
    methods: {
        initData: function() {
            this.initCategory();
            this.initType();
            this.initGroup();
        },

        selectEventList: function() {
            var url = "/emergency/list";
            YF_HTTP
                .post(url, this.searchObj)
                .then(function (result) {
                    emergency.$data.eventList = result.data;
                });
        },
        saveUi: function(eventId) {
            if(eventId) {
                var url = "/emergency/get?eventId=" + eventId;
                YF_HTTP
                    .get(url)
                    .then(function (result) {
                        emergency.$data.eventModel = result.data;
                        $('#addEventSelect').select2().val(result.data.type).trigger('change');
                        if (emergency.$data.eventModel.status == "BA005") {
                            $('#divAddEvent').modal('show');
                        } else {
                            $('#divDetail').modal('show');
                        }
                    });
            } else {
                this.eventModel = {};
                this.eventModel.category = this.categoryList[0].configKey;
                $('#addEventSelect').select2().val( this.typeList[0].children[0].configKey).trigger('change');
                $('#divAddEvent').modal('show');
            }
        },
        saveEvent: function () {
            this.eventModel.type = $("#addEventSelect").val();
            var url = "/emergency/save";
            YF_HTTP
                .post(url, this.eventModel)
                .then(function (result) {
                    //$('#divAddEvent').modal('hide');//关闭模态框
                    Utils.showMsg("保存成功！",2000,"success");
                    emergency.$data.eventModel = result.data;
                    emergency.selectEventList();
                });
        },
        notice: function(statusKey) {
            if (this.eventModel.status == "BA005") {
                this.eventModel.type = $("#addEventSelect").val();
                var url = "/emergency/save";
                YF_HTTP
                    .post(url, this.eventModel)
                    .then(function (result) {
                        emergency.$data.eventModel = result.data;
                        emergency.selectEventList();
                    });
            }

            this.processModel = {};
            $('#noticeGroupSelect').select2().val(null).trigger('change');
            this.noticeModel.type = statusKey;
            switch (statusKey) {
                case "BD001":
                    this.noticeModel.name = "应急准备";
                    break;
                case "BD002":
                    this.noticeModel.name = "应急取消";
                    break;
                case "BD003":
                    this.noticeModel.name = "应急启动";
                    break;
                case "BD004":
                    this.noticeModel.name = "应急解除";
                    break;
            }
            $('#divNotice').modal('show');
        },
        process: function() {
            var selectedGroupIds = $("#noticeGroupSelect").val().join(",");//获取多选输入框选中值的方式
            this.processModel.selectedGroupIds = selectedGroupIds;
            var selectOpt = [];
            var options=document.getElementById('noticeGroupSelect').options;
            for(var i=0;i<options.length;i++){
                if(options[i].selected){
                    selectOpt.push(options[i].text);
                }
            }
            var selectedGroupNames = selectOpt.join(",");
            this.processModel.selectedGroupNames = selectedGroupNames;

            this.processModel.node = this.noticeModel.type;
            this.processModel.eventId = this.eventModel.id;
            console.log(this.processModel);
            var url = "/emergency/addProcess";
            YF_HTTP
                .post(url, this.processModel)
                .then(function (result) {
                    $('#divNotice').modal('hide');//关闭模态框
                    Utils.showMsg("保存成功！",2000,"success");
                    emergency.$data.eventModel = result.data;
                    emergency.selectEventList();
                })
        },
        initCategory: function () {
            var url = "/common/configList";
            var param = Qs.stringify({type: 11});
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    emergency.$data.categoryList = result.data;
                })
        },
        initType: function () {
            var url = "/common/configList2";
            var param = Qs.stringify({type: 12});
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    emergency.$data.typeList = result.data;
                })
        },
        initGroup: function () {
            var url = "/group/allList";
            YF_HTTP
                .post(url,{})
                .then(function (result) {
                    emergency.$data.groupList = result.data;
                })
        },

        initMap: function () {
            // 百度地图API功能
            var map = new BMap.Map("allmap");    // 创建Map实例
            map.centerAndZoom(new BMap.Point(104.072078,30.663608), 12);  // 初始化地图,设置中心点坐标和地图级别
            //添加地图类型控件
            map.addControl(new BMap.MapTypeControl({
                mapTypes:[
                    BMAP_NORMAL_MAP,
                    BMAP_HYBRID_MAP
                ]}));
            map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var bottom_right_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});// 添加比例尺
            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //仅包含平移和缩放按钮
            map.addControl(bottom_right_control);
            map.addControl(top_right_navigation);
        },
    }
});
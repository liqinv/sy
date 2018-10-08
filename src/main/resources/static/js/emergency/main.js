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
        typeList:{}
    },
    mounted: function () {
        this.selectEventList();
        this.initMap();
        this.initComponent();
        this.initCategory();
        this.initType();
    },
    methods: {
        initComponent: function() {

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
                    });
            } else {
                this.eventModel = {};
                this.eventModel.category = this.categoryList[0].configKey;
                $('#addEventSelect').select2().val( this.typeList[0].children[0].configKey).trigger('change');

            }
            $('#divAddEvent').modal('show');
        },
        saveEvent: function () {
            this.eventModel.type = $("#addEventSelect").val();
            var url = "/emergency/save";
            YF_HTTP
                .post(url, this.eventModel)
                .then(function (result) {
                    //$('#divAddEvent').modal('hide');//关闭模态框
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
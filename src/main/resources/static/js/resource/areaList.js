var areaList = new Vue({
    el: "#areaList",
    data: {
        areaList: {}, //列表对象
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: ''
        },
        areaModel: {}, //临时缓存用
        map : {}, // 地图对象
    },
    mounted: function () {
        this.localList();
        this.initMap();
    },
    methods: {
        prePage: function () {
            this.searchObj.pageNo = this.areaList.prePage;
            this.selectAreaList();
        },
        currPage: function (pageIndex) {
            this.searchObj.pageNo = pageIndex;
            this.selectAreaList();
        },
        nextPage: function () {
            this.searchObj.pageNo = this.areaList.nextPage;
            this.selectAreaList();
        },
        localList: function () {
            this.searchObj.pageNo = 1;
            this.selectAreaList();
        },
        selectAreaList: function () {
            var url = "/resource/area/list";
            YF_HTTP
                .post(url, this.searchObj)
                .then(function (result) {
                    areaList.$data.areaList = result.data;
                });
        },
        
        saveUi: function(areaId) {
            if(areaId) {
                var url = "/resource/area/get?areaId=" + areaId;
                YF_HTTP
                    .get(url)
                    .then(function (result) {
                        areaList.$data.areaModel = result.data;

                        $('#divSave').modal('show');
                    });
            } else {
                this.areaModel = {};
                this.map.clearOverlays();
                $('#divSave').modal('show');
            }
        },
        save: function () {
            var url = "/resource/area/save";
            YF_HTTP
                .post(url, this.areaModel)
                .then(function (result) {
                    areaList.$data.areaModel = result.data;
                    areaList.selectAreaList();
                    $('#divSave').modal('hide');//关闭模态框
                });
        },
        deleteArea: function (area) {
            Utils.confirm("确认删除【"+area.name+"】社区信息吗？",'warning').then(function(isOk){
                if(isOk) {
                    var url = "/resource/area/delete";
                    var param = Qs.stringify({areaId: area.id});
                    YF_HTTP
                        .post(url, param)
                        .then(function (result) {
                            areaList.selectAreaList();
                        })
                }
            });

        },
        initMap: function () {
            // 百度地图API功能
            this.map = new BMap.Map("selectmap");    // 创建Map实例
            this.map.centerAndZoom(new BMap.Point(104.072078,30.663608), 12);  // 初始化地图,设置中心点坐标和地图级别
            //this.map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
            this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //仅包含平移和缩放按钮
            this.map.addControl(top_right_navigation);
        },
        drawPoint: function() {
            
        }
    }
});
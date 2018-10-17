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
        // 多边形样式
        styleOptions : {
            strokeColor : "red", // 边线颜色。
            fillColor : "red", // 填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight : 3, // 边线的宽度，以像素为单位。
            strokeOpacity : 0.8, // 边线透明度，取值范围0 - 1。
            fillOpacity : 0.6, // 填充的透明度，取值范围0 - 1。
            strokeStyle : 'solid' // 边线的样式，solid或dashed。
        },
        drawingManager : {}, // 画图对象
        //overlays : [], // 画图
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
                        areaList.initArea();
                    });
            } else {
                this.areaModel = {};
                this.clearArea();
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
            this.map.centerAndZoom(new BMap.Point(CONFIG.BAIDU_LOCATION_X,CONFIG.BAIDU_LOCATION_Y), CONFIG.BAIDU_DISPLAY_LEVEL);  // 初始化地图,设置中心点坐标和地图级别
            //this.map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
            this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //仅包含平移和缩放按钮
            this.map.addControl(top_right_navigation);
            this.drawArea();
        },
        initArea: function() {
            areaList.$data.map.clearOverlays();
            if(areaList.$data.areaModel.dataList) {
                var initMapDatas = [];
                for (var i = 0; i < areaList.$data.areaModel.dataList.length; i++) {
                    var data = new BMap.Point(areaList.$data.areaModel.dataList[i].locationX,areaList.$data.areaModel.dataList[i].locationY);
                    initMapDatas.push(data);
                }
                var polygon = new BMap.Polygon(initMapDatas,areaList.$data.styleOptions);
                areaList.$data.map.addOverlay(polygon);
                areaList.$data.map.centerAndZoom(new BMap.Point(areaList.$data.areaModel.dataList[0].locationX,areaList.$data.areaModel.dataList[0].locationY), 12);
            }
        },
        drawArea: function() {

            // 设施画图对象
            this.drawingManager = new BMapLib.DrawingManager(
                this.$data.map, {
                    isOpen : false, // 是否开启绘制模式
                    enableDrawingTool : true, // 是否显示工具栏
                    drawingToolOptions : {
                        anchor : BMAP_ANCHOR_TOP_RIGHT, // 位置
                        offset : new BMap.Size(5, 5), // 偏离值
                        drawingModes : [ BMAP_DRAWING_POLYGON]
                    },
                    polygonOptions : this.$data.styleOptions
                    // 多边形的样式

                });
            this.drawingManager.addEventListener('overlaycomplete',function(e) {
                //areaList.$data.overlays.push(e.overlay);
                areaList.$data.areaModel.dataList = [];
                var path = e.overlay.getPath();
                for (var i = 0; i < path.length; i++) {
                    //alert("lng:" + path[i].lng + "\n lat:" + path[i].lat);
                    var data = {};
                    data.locationX = path[i].lng;
                    data.locationY = path[i].lat;
                    areaList.$data.areaModel.dataList.push(data);
                }
            });
        },
        clearArea: function() {
            this.$data.map.clearOverlays();
            this.$data.areaModel.dataList = [];
            this.$data.map.centerAndZoom(new BMap.Point(CONFIG.BAIDU_LOCATION_X,CONFIG.BAIDU_LOCATION_Y), CONFIG.BAIDU_DISPLAY_LEVEL);
        }
    }
});
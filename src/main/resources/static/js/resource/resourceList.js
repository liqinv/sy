var resourceList = new Vue({
    el: "#resourceList",
    data: {
        resourceList: {}, //列表对象
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: '',
            type:''
        },
        resourceModel: {}, //临时缓存用
        typeList: {},

        map : {}, // 地图对象
        drawStatus:'close',
    },
    mounted: function () {
        this.localList();
        this.initType();
        this.initMap();
    },
    methods: {
        prePage: function () {
            this.searchObj.pageNo = this.resourceList.prePage;
            this.selectResourceList();
        },
        currPage: function (pageIndex) {
            this.searchObj.pageNo = pageIndex;
            this.selectResourceList();
        },
        nextPage: function () {
            this.searchObj.pageNo = this.resourceList.nextPage;
            this.selectResourceList();
        },
        localList: function () {
            this.searchObj.pageNo = 1;
            this.selectResourceList();
        },
        selectResourceList: function () {
            var url = "/resource/point/list";
            YF_HTTP
                .post(url, this.searchObj)
                .then(function (result) {
                    resourceList.$data.resourceList = result.data;
                });
        },
        initType: function () {
            var url = "/common/configList";
            var param = Qs.stringify({type: 4});
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    resourceList.$data.typeList = result.data;
                })
        },
        saveUi: function(resourceId) {
            if(resourceId) {
                var url = "/resource/point/get?resourceId=" + resourceId;
                YF_HTTP
                    .get(url)
                    .then(function (result) {
                        resourceList.$data.resourceModel = result.data;
                        resourceList.initPoint();

                        $('#divSave').modal('show');
                    });
            } else {
                this.resourceModel = {};
                this.clearPoint();
                this.resourceModel.type = this.typeList[0].configKey;
                $('#divSave').modal('show');
            }
        },
        save: function () {
            var url = "/resource/point/save";
            YF_HTTP
                .post(url, this.resourceModel)
                .then(function (result) {
                    resourceList.$data.resourceModel = result.data;
                    resourceList.selectResourceList();
                    $('#divSave').modal('hide');//关闭模态框
                });
        },
        deleteResource: function (resource) {
            Utils.confirm("确认删除【"+resource.name+"】点位资源吗？",'warning').then(function(isOk){
                if(isOk) {
                    var url = "/resource/point/delete";
                    var param = Qs.stringify({resourceId: resource.id});
                    YF_HTTP
                        .post(url, param)
                        .then(function (result) {
                            resourceList.selectResourceList();
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

            this.drawPoint();
        },
        initPoint: function() {
            resourceList.$data.map.clearOverlays();
            if(resourceList.$data.resourceModel.locationX) {
                var point = new BMap.Point(resourceList.$data.resourceModel.locationX, resourceList.$data.resourceModel.locationY);
                var marker = new BMap.Marker(point); // 创建标注
                resourceList.$data.map.addOverlay(marker);// 将标注添加到地图中
                resourceList.$data.map.centerAndZoom(point, 12);
            }
        },
        drawPoint: function() {
            // 设施画图对象
            this.drawingManager = new BMapLib.DrawingManager(
                this.$data.map, {
                    isOpen : false, // 是否开启绘制模式
                    enableDrawingTool : true, // 是否显示工具栏
                    drawingToolOptions : {
                        anchor : BMAP_ANCHOR_TOP_RIGHT, // 位置
                        offset : new BMap.Size(5, 5), // 偏离值
                        drawingModes : [ BMAP_DRAWING_MARKER]
                    },
                    polygonOptions : this.$data.styleOptions
                    // 多边形的样式

                });

            this.drawingManager.addEventListener('overlaycomplete',function(e) {
                resourceList.$data.resourceModel.locationX = e.overlay.point.lng;
                resourceList.$data.resourceModel.locationY = e.overlay.point.lat;
            });
        },
        clearPoint: function() {
            resourceList.$data.map.clearOverlays();
            resourceList.$data.resourceModel.locationX = null;
            resourceList.$data.resourceModel.locationY = null;
            resourceList.$data.map.centerAndZoom(new BMap.Point(104.072078,30.663608), 12);
        }
    }
});
var emergency = new Vue({
    el: "#emergency",
    data: {
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: '',
        },
        eventList: {}, //列表对象
        eventModel: {gpsMqIsInit: false},//临时缓存用
        categoryList: {},
        typeList: {},
        groupList: {},
        noticeModel: {
            type: "",
            name: "",
        },
        processModel: {},
        //eventFileList:[],
        map: {}, // 地图对象
        // 多边形样式
        styleOptions: {
            strokeColor: "red", // 边线颜色。
            fillColor: "red", // 填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3, // 边线的宽度，以像素为单位。
            strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
            fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' // 边线的样式，solid或dashed。
        },
        drawingManager: {}, // 画图对象
        overlays: [], // 画图
    },
    mounted: function () {
        this.selectEventList();
        this.initData();
        this.initMap();
        this.initPoint({});
        this.initArea();
        this.getCurUser();
        /*$('#divAddEvent').on('hide.bs.modal', function () {
            alert('模态框关闭了');
        });*/
        this.openMqListener();
    },
    methods: {
        initData: function () {
            this.initCategory();
            this.initType();
            this.initGroup();
            this.initFileInputCallback();
        },
        initDatetime: function () {
            $("#happenTime").datetimepicker({
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true,
                minuteStep: 10
            }).on("changeDate", function (e) {
                console.log(e.date);
                var selectTime = Utils.dateFormat(e.date);
                emergency.$data.eventModel.happenTime = selectTime.substring(0, selectTime.length - 3) + ":00";
            });


        },
        initFileInputCallback: function () {
            $("#event-files").on("fileuploaded", function (event, data, previewId, index) {
                console.log(index + ":::" + previewId + ":::" + JSON.stringify(data.response));
                if (data.response.code == 200) {
                    if (!emergency.$data.eventModel.fileList) {
                        emergency.$data.eventModel.fileList = [];
                    }
                    emergency.$data.eventModel.fileList.push(data.response.data[0]);
                }
            });
            $("#event-files").on('fileerror', function (event, file, previewId, index) {
                console.log("fileerror");
            });
            $("#event-files").on("filebatchselected", function (event, files) {
                console.log("filebatchselected");
            });
            //初始化的文件删除回调
            $('#event-files').on('filedeleted', function (event, key) {
                console.log('filedeleted::::' + key);
                for (var i = 0; i < emergency.$data.eventModel.fileList.length; i++) {
                    var file = emergency.$data.eventModel.fileList[i];
                    if (key == file.id) {
                        emergency.$data.eventModel.fileList.splice(i, 1);
                    }
                }
            });
            //文件全部上传完成后回调
            $('#event-files').on('filebatchuploadcomplete', function (event, files, extra) {
                console.log('File batch upload complete');
                emergency.$data.eventModel.type = $("#addEventSelect").val();
                var url = "/emergency/save";
                YF_HTTP
                    .post(url, emergency.$data.eventModel)
                    .then(function (result) {
                        Utils.showMsg("保存成功！", 2000, "success");
                        emergency.$data.eventModel = result.data;
                        emergency.initFileInput();
                        emergency.selectEventList();

                    });
            });
        },
        initFileInput: function () {
            var initialPreviewData = [];
            var initialPreviewConfigData = [];
            if (emergency.$data.eventModel.fileList) {
                for (var i = 0; i < emergency.$data.eventModel.fileList.length; i++) {
                    var file = emergency.$data.eventModel.fileList[i];
                    initialPreviewData.push(baseUrl+file.originalPath);
                    var cc = {};
                    cc.caption = file.fileName;
                    //cc.width = "120px";
                    cc.url = baseUrl+"/common/fileRemove";
                    cc.key = file.id;
                    cc.extra = {id: file.id};
                    cc.downloadUrl = baseUrl+file.originalPath;
                    cc.size = file.fileSize;
                    initialPreviewConfigData.push(cc);
                }
            }

            $("#event-files").fileinput('destroy');
            $("#event-files").fileinput({
                maxFileCount: 3,
                language: 'zh',
                theme: 'explorer-fa',
                uploadUrl: baseUrl+'/common/fileUpload',
                showCaption: false,
                enctype: 'multipart/form-data',
                dropZoneEnabled: false,
                overwriteInitial: false,
                showRemove: false,
                showUpload: false,
                showClose: false,
                fileActionSettings: {
                    showRemove: true,
                    showUpload: false,
                    showZoom: true,
                    showDrag: false,
                },
                preferIconicPreview: true, // 开启用图标替换预览效果
                previewFileIconSettings: { // configure your icon file extensions
                    'doc': '<i class="fa fa-file-word-o text-primary"></i>',
                    'xls': '<i class="fa fa-file-excel-o text-success"></i>',
                    'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
                    'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
                    'txt': '<i class="fa fa-file-text-o text-info"></i>',
                    'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
                    'htm': '<i class="fa fa-file-code-o text-info"></i>',
                    'mov': '<i class="fa fa-file-movie-o text-warning"></i>',
                    'mp3': '<i class="fa fa-file-audio-o text-warning"></i>'
                },

                previewFileExtSettings: {
                    'doc': function (ext) {
                        return ext.match(/(doc|docx)$/i);
                    },
                    'xls': function (ext) {
                        return ext.match(/(xls|xlsx)$/i);
                    },
                    'ppt': function (ext) {
                        return ext.match(/(ppt|pptx)$/i);
                    },
                    'zip': function (ext) {
                        return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
                    },
                    'htm': function (ext) {
                        return ext.match(/(htm|html)$/i);
                    },
                    'mov': function (ext) {
                        return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
                    },
                    'mp3': function (ext) {
                        return ext.match(/(mp3|wav)$/i);
                    },
                    'txt': function (ext) {
                        return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
                    }
                },

                initialPreviewAsData: true,
                initialPreview: initialPreviewData,
                initialPreviewConfig: initialPreviewConfigData

            });
            $('.file-preview').attr("style", "overflow:scroll; max-height:150px;");
        },
        initFileInputDetail: function () {
            var initialPreviewData = [];
            var initialPreviewConfigData = [];
            if (emergency.$data.eventModel.fileList) {
                for (var i = 0; i < emergency.$data.eventModel.fileList.length; i++) {
                    var file = emergency.$data.eventModel.fileList[i];
                    initialPreviewData.push(baseUrl+file.originalPath);
                    var cc = {};
                    cc.caption = file.fileName;
                    cc.key = file.id;
                    cc.downloadUrl = baseUrl+file.originalPath;
                    cc.size = file.fileSize;
                    initialPreviewConfigData.push(cc);
                }
            }

            $("#event-files-detail").fileinput('destroy');
            $("#event-files-detail").fileinput({
                language: 'zh',
                theme: 'explorer-fa',
                showCaption: false,
                dropZoneEnabled: false,
                overwriteInitial: false,
                showRemove: false,
                showUpload: false,
                showClose: false,
                showBrowse: false,
                fileActionSettings: {
                    showRemove: false,
                    showUpload: false,
                    showZoom: true,
                    showDrag: false,
                },
                preferIconicPreview: true, // 开启用图标替换预览效果
                previewFileIconSettings: { // configure your icon file extensions
                    'doc': '<i class="fa fa-file-word-o text-primary"></i>',
                    'xls': '<i class="fa fa-file-excel-o text-success"></i>',
                    'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
                    'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
                    'txt': '<i class="fa fa-file-text-o text-info"></i>',
                    'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
                    'htm': '<i class="fa fa-file-code-o text-info"></i>',
                    'mov': '<i class="fa fa-file-movie-o text-warning"></i>',
                    'mp3': '<i class="fa fa-file-audio-o text-warning"></i>'
                },

                previewFileExtSettings: {
                    'doc': function (ext) {
                        return ext.match(/(doc|docx)$/i);
                    },
                    'xls': function (ext) {
                        return ext.match(/(xls|xlsx)$/i);
                    },
                    'ppt': function (ext) {
                        return ext.match(/(ppt|pptx)$/i);
                    },
                    'zip': function (ext) {
                        return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
                    },
                    'htm': function (ext) {
                        return ext.match(/(htm|html)$/i);
                    },
                    'mov': function (ext) {
                        return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
                    },
                    'mp3': function (ext) {
                        return ext.match(/(mp3|wav)$/i);
                    },
                    'txt': function (ext) {
                        return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
                    }
                },

                initialPreviewAsData: true,
                initialPreview: initialPreviewData,
                initialPreviewConfig: initialPreviewConfigData

            });
            $('.file-preview').attr("style", "overflow:scroll; max-height:230px;");
        },
        selectEventList: function () {
            var url = "/emergency/list";
            YF_HTTP
                .post(url, this.searchObj)
                .then(function (result) {
                    emergency.$data.eventList = result.data;
                    emergency.reloadEventPoint();
                });
        },
        saveUi: function (eventId) {
            if (eventId) {
                var url = "/emergency/get?eventId=" + eventId;
                YF_HTTP
                    .get(url)
                    .then(function (result) {
                        emergency.$data.eventModel = result.data;
                        $('#addEventSelect').select2().val(result.data.type).trigger('change');

                        if (emergency.$data.eventModel.status == "BA005") {
                            emergency.initFileInput();
                            $('#divAddEvent').modal('show');
                        } else {
                            emergency.initFileInputDetail();
                            $('#divDetail').modal('show');
                        }

                        if(emergency.$data.eventModel.longitude && emergency.$data.eventModel.longitude.trim() != '') {
                            var newPoint = new BMap.Point(emergency.$data.eventModel.longitude-0.04, emergency.$data.eventModel.latitude);
                            emergency.$data.map.centerAndZoom(newPoint, CONFIG.BAIDU_DISPLAY_LEVEL);
                        }

                    });
            } else {
                this.eventModel = {};
                emergency.initFileInput();
                this.eventModel.category = this.categoryList[0].configKey;
                $('#addEventSelect').select2().val(this.typeList[0].children[0].configKey).trigger('change');
                $('#divAddEvent').modal('show');
            }
            emergency.initDatetime();

        },
        saveEvent: function () {
            var files = $('#event-files').fileinput('getFileStack');
            if (files.length > 0) {
                $("#event-files").fileinput("upload");
            } else {
                this.eventModel.type = $("#addEventSelect").val();
                var url = "/emergency/save";
                YF_HTTP
                    .post(url, this.eventModel)
                    .then(function (result) {

                        Utils.showMsg("保存成功！", 2000, "success");
                        emergency.$data.eventModel = result.data;
                        emergency.selectEventList();
                    });
            }

        },
        notice: function (statusKey) {
            if (this.eventModel.status == "BA005") {
                var files = $('#event-files').fileinput('getFileStack');
                if (files.length > 0) {
                    $("#event-files").fileinput("upload");
                } else {
                    this.eventModel.type = $("#addEventSelect").val();
                    var url = "/emergency/save";
                    YF_HTTP
                        .post(url, this.eventModel)
                        .then(function (result) {
                            emergency.$data.eventModel = result.data;
                            emergency.selectEventList();
                        });
                }

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
        process: function () {
            var selectedGroupIds = $("#noticeGroupSelect").val().join(",");//获取多选输入框选中值的方式
            this.processModel.selectedGroupIds = selectedGroupIds;
            var selectOpt = [];
            var options = document.getElementById('noticeGroupSelect').options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].selected) {
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
                    Utils.showMsg("保存成功！", 2000, "success");
                    emergency.$data.eventModel = result.data;
                    emergency.selectEventList();
                    if (emergency.$data.processModel.node == "BD001") {
                        $('#divAddEvent').modal('hide');//关闭模态框
                        emergency.initFileInputDetail();
                        $('#divDetail').modal('show');
                    }
                })
        },
        reportUi: function () {
            this.processModel = {};
            $('#divContinue').modal('show');
        },
        report: function () {
            this.processModel.node = "BD005";
            this.processModel.eventId = this.eventModel.id;
            var url = "/emergency/addProcess";
            YF_HTTP
                .post(url, this.processModel)
                .then(function (result) {
                    $('#divContinue').modal('hide');//关闭模态框
                    Utils.showMsg("保存成功！", 2000, "success");
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
                .post(url, {})
                .then(function (result) {
                    emergency.$data.groupList = result.data;
                })
        },

        initMap: function () {
            // 百度地图API功能
            this.map = new BMap.Map("allmap"); // 创建Map实例
            this.map.centerAndZoom(
                new BMap.Point(CONFIG.BAIDU_LOCATION_X, CONFIG.BAIDU_LOCATION_Y), CONFIG.BAIDU_DISPLAY_LEVEL); // 初始化地图,设置中心点坐标和地图级别
            // 添加地图类型控件
            this.map.addControl(new BMap.MapTypeControl({
                mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
            }));
            this.map.setCurrentCity("成都"); // 设置地图显示的城市 此项是必须设置的
            this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
            var bottom_right_control = new BMap.ScaleControl({
                anchor: BMAP_ANCHOR_BOTTOM_LEFT
            });// 添加比例尺
            var top_right_navigation = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
                type: BMAP_NAVIGATION_CONTROL_SMALL
            }); // 仅包含平移和缩放按钮
            this.map.addControl(bottom_right_control);
            this.map.addControl(top_right_navigation);
            MapManager.setMap(this.map);
        },
        initArea: function (param) {
            var url = "/resource/area/listMap";
            YF_HTTP
                .post(url, {})
                .then(function (result) {
                    //点位上图
                    // console.log(result.data);
                    var areaList = result.data;

                    for (var i = 0; i < areaList.length; i++) {
                        if(areaList[i].dataList) {
                            var initMapDatas = [];
                            for (var j = 0; j < areaList[i].dataList.length; j++) {
                                var data = new BMap.Point(areaList[i].dataList[j].locationX,areaList[i].dataList[j].locationY);
                                initMapDatas.push(data);
                            }
                            var displayColor = "red";
                            if(areaList[i].areaColor && areaList[i].areaColor !='') {
                                displayColor = areaList[i].areaColor;
                            }

                            var styleOptions = {
                                strokeColor : displayColor, // 边线颜色。
                                fillColor : displayColor, // 填充颜色。当参数为空时，圆形将没有填充效果。
                                strokeWeight : 2, // 边线的宽度，以像素为单位。
                                strokeOpacity : 0.4, // 边线透明度，取值范围0 - 1。
                                fillOpacity : 0.2, // 填充的透明度，取值范围0 - 1。
                                strokeStyle : 'dashed' // 边线的样式，solid或dashed。
                            };
                            var polygon = new BMap.Polygon(initMapDatas,styleOptions);
                            polygon.areaType="area";
                            emergency.$data.map.addOverlay(polygon);
                            let name = areaList[i].name;
                            let linkMan = areaList[i].linkMan;
                            let linkPhone = areaList[i].linkPhone;
                            let note = areaList[i].note;

                            polygon.addEventListener('click',function(e){
                                curPolygon.setStrokeOpacity(0.6);
                                curPolygon.setFillOpacity(0.4);
                                let point = e.point;
                                var winContents = "<div class=\"form-group\" style=\"text-align: center;\"><label>" + name + "</label></div>";
                                if(linkMan && linkMan != "") {
                                    winContents = winContents + "<div class=\"form-group\">联系人：" + linkMan + "</div>";
                                }
                                if(linkPhone && linkPhone != "") {
                                    // winContents = winContents + "<div class=\"form-group\"> 电话：" + linkPhone + "&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-primary btn-sm\" onclick=\"makeCall("+linkPhone+")\"><i class=\"fa  fa-phone\"></i></button></div>";
                                    winContents = winContents + "<div class=\"form-group\"> 电话：" + linkPhone + "&nbsp;&nbsp;<img id=\"call-"+linkPhone+"\" src=\""+baseUrl+"/img/call.png\" style=\"cursor:pointer;\" onclick=\"makeCall("+linkPhone+")\"/><img id=\"callup-"+linkPhone+"\" src=\""+baseUrl+"/img/callup.png\" style=\"cursor:pointer;display:none;\" onclick=\"hangUp("+linkPhone+")\"></div>";

                                }
                                if(note && note != "") {
                                    winContents = winContents + "<div class=\"form-group\"> 备注：" + note + "</div>";
                                }
                                emergency.openAreaInfo(winContents,point);
                            });
                            let curPolygon = polygon;
                            polygon.addEventListener('mouseover',function(e){
                                // console.log("mouseover");
                                curPolygon.setStrokeOpacity(0.6);
                                curPolygon.setFillOpacity(0.4);
                            });
                            polygon.addEventListener('mouseout',function(e){
                                // console.log("mouseout");
                                curPolygon.setStrokeOpacity(0.4);
                                curPolygon.setFillOpacity(0.2);
                            });
                        }
                    }
                });
        },
        openAreaInfo: function (content,point) {
            var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
            emergency.$data.map.openInfoWindow(infoWindow, point); //开启信息窗口
        },
        initPoint: function (param) {
            var url = "/resource/point/listMap";
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    //点位上图
                    // console.log(result.data);
                    var pointList = result.data;
                    for (var i = 0; i < pointList.length; i++) {
                        if (JSON.stringify(param) == "{}" && pointList[i].type == "AD001") {
                            continue;
                        }
                        let myIcon;
                        let linkManLabel = "联系人";
                        let noteLabel = "备注";
                        switch (pointList[i].type) {
                            case "AD001":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/dw.gif", new BMap.Size(50, 30));
                                myIcon.setImageSize(new BMap.Size(50, 30));
                                linkManLabel = "书记";
                                noteLabel = "党员数量"
                                break;
                            case "AD002":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/wz.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD003":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/jyz.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD004":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/whpsy.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD005":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/whpcc.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD006":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/rymjd.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD007":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/wb.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD008":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/dyy.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD009":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/jd.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD010":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/ylcs.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD011":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/fxwz.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                            case "AD012":
                                myIcon = new BMap.Icon(baseUrl+"/img/resource/bncs.png", new BMap.Size(30, 30));
                                myIcon.setImageSize(new BMap.Size(30, 30));
                                break;
                        }

                        var point = new BMap.Point(pointList[i].locationX, pointList[i].locationY);
                        var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                        marker.pointType = pointList[i].type;
                        emergency.$data.map.addOverlay(marker);// 将标注添加到地图中

                        var winContents = "<div class=\"form-group\" style=\"text-align: center;\"><label>" + pointList[i].name + "</label></div>";
                        winContents = winContents + "<div class=\"form-group\">类型：" + pointList[i].typeName + "</div>";
                        if(pointList[i].linkMan && pointList[i].linkMan != "") {
                            winContents = winContents + "<div class=\"form-group\">"+linkManLabel+"：" + pointList[i].linkMan + "</div>";
                            //winContents = winContents + "<div class=\"form-group\"><div class=\"col-sm-3\" >联系人：</div><div class=\"col-sm-9\">" + pointList[i].linkMan + "</div></div>";
                        }
                        let callStyle="";
                        let callupStyle="display:none;";
                        if(pointList[i].linkPhone && pointList[i].linkPhone != "") {
                            winContents = winContents + "<div class=\"form-group\"> 电话：" + pointList[i].linkPhone + "&nbsp;&nbsp;<img id=\"call-"+pointList[i].linkPhone+"\" src=\""+baseUrl+"/img/call.png\" style=\"cursor:pointer;"+callStyle+"\" onclick=\"makeCall("+pointList[i].linkPhone+")\"/><img id=\"callup-"+pointList[i].linkPhone+"\" src=\""+baseUrl+"/img/callup.png\" style=\"cursor:pointer;"+callupStyle+"\" onclick=\"hangUp("+pointList[i].linkPhone+")\"></div>";
                            //winContents = winContents + "<div class=\"form-group\"><div class=\"col-sm-3\" >电话：</div><div class=\"col-sm-9\">" + pointList[i].linkPhone + "</div></div>";
                        }
                        if(pointList[i].address && pointList[i].address != "") {
                            winContents = winContents + "<div class=\"form-group\"> 地址：" + pointList[i].address + "</div>";
                            //winContents = winContents + "<div class=\"form-group\"><div class=\"col-sm-3\" >地址：</div><div class=\"col-sm-9\">" + pointList[i].address + "</div></div>";
                        }
                        if(pointList[i].note && pointList[i].note != "") {
                            winContents = winContents + "<div class=\"form-group\">"+noteLabel+"：" + pointList[i].note + "</div>";
                            //winContents = winContents + "<div class=\"form-group\"><div class=\"col-sm-3\" >备注：</div><div class=\"col-sm-9\">" + pointList[i].note + "</div></div>";
                        }


                        emergency.addClickHandler(winContents, marker);
                    }
                });
        },
        addClickHandler: function (content, marker) {
            marker.addEventListener("click", function (e) {
                emergency.openInfo(content, e)
            });
        },
        openInfo: function (content, e) {
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
            emergency.$data.map.openInfoWindow(infoWindow, point); //开启信息窗口
        },
        switchPoint: function (pointType) {
            if($("#"+pointType).css("background-color") =="rgb(60, 141, 188)") { //关闭
                $("#"+pointType).css("background-color","#4b646f");
                var allOverlay = emergency.$data.map.getOverlays();
                for (var i = 0; i < allOverlay.length ; i++) {

                    // console.log(allOverlay[i].pointType);
                    if(allOverlay[i].pointType && allOverlay[i].pointType == pointType) {
                        emergency.$data.map.removeOverlay(allOverlay[i]);
                    }

                }
            } else { //开启
                $("#"+pointType).css("background-color","rgb(60, 141, 188)");
                this.initPoint({type:pointType});
            }

        },
        switchArea: function (areaType) {
            if($("#"+areaType).css("background-color") =="rgb(60, 141, 188)") { //关闭
                $("#"+areaType).css("background-color","#4b646f");
                var allOverlay = emergency.$data.map.getOverlays();
                for (var i = 0; i < allOverlay.length ; i++) {

                    // console.log(allOverlay[i].areaType);
                    if(allOverlay[i].areaType && allOverlay[i].areaType == areaType) {
                        emergency.$data.map.removeOverlay(allOverlay[i]);
                    }

                }
            } else { //开启
                $("#"+areaType).css("background-color","rgb(60, 141, 188)");
                this.initArea({});
            }

        },
        // 多边形画完后 回调用
        overlaycomplete: function (e) {
            var that = this;
            emergency.$data.overlays.push(e.overlay);
            var path = e.overlay.getPath();
            for (var i = 0; i < path.length; i++) {
                alert("lng:" + path[i].lng + "\n lat:" + path[i].lat);
            }
        },
        //清空数据
        clearAll: function () {
            var that = this;
            for (var i = 0; i < this.$data.overlays.length; i++) {
                this.$data.map.removeOverlay(this.$data.overlays[i]);
            }
            this.$data.overlays.length = 0
            this.drawingManager = {};
        },
        switchPerson: function () {
            if($("#person").css("background-color") =="rgb(60, 141, 188)") { //关闭
                $("#person").css("background-color","#4b646f");
                //todo 断开mq，清除地图上已有人员图标
                this.openMqListener();
            } else { //开启
                $("#person").css("background-color","rgb(60, 141, 188)");
                this.openMqListener();
            }
        },
        openMqListener:function(){
		    if(!this.eventModel.gpsMqIsInit){
		        this.eventModel.gpsMqIsInit = true;
		        MqManager.initMq("/exchange/GpsTopicExchange/#",MqManager.mqGpsCompleteCallBack);
		    }
		    var type = 4

            setTimeout("MapToobar.initResourceChart("+type+")", 200);
		},
		getCurUser : function() {
            var url = "/emergency/getCurUser";
            YF_HTTP.post(url, this.searchObj).then(function(result) {
                emergency.$data.curuser = result.data;
                $("#organId").val(result.data.organId);
                $("#organPath").val(result.data.sysOrgan.path);

                MapToobar.initResourceDatas(true);
            });
        },
        pointMap: function() {
            let address = this.eventModel.address;
            if(!address || address.trim() == '' ) {
                Utils.alert("请输入正确的地址进行定位标注","warning");
            }
            let myGeo = new BMap.Geocoder();
            myGeo.getPoint(address, function(point){
                if (point) {
                    var newPoint = new BMap.Point(point.lng-0.04, point.lat);
                    emergency.$data.map.centerAndZoom(newPoint, CONFIG.BAIDU_DISPLAY_LEVEL);
                    let myIcon = new BMap.Icon(baseUrl+"/img/resource/sj.png", new BMap.Size(30, 30));
                    myIcon.setImageSize(new BMap.Size(30, 30));
                    let sgsMark = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                    sgsMark.pointType = "SJ";
                    emergency.$data.map.addOverlay(sgsMark);
                    emergency.$data.eventModel.longitude = point.lng;
                    emergency.$data.eventModel.latitude = point.lat;
                } else {
                    Utils.alert('地址解析失败,请手动定位!','warning');
                }
            },"成都市");
        },
        reloadEventPoint: function() {
            //删除事件图标
            let allOverlay = emergency.$data.map.getOverlays();
            for (let i = 0; i < allOverlay.length ; i++) {
                if(allOverlay[i].pointType && allOverlay[i].pointType == "SJ") {
                    emergency.$data.map.removeOverlay(allOverlay[i]);
                }
            }
            //加载事件图标
            let list = emergency.$data.eventList;
            for (let i = 0; i < list.length; i++) {
                var point = new BMap.Point(list[i].longitude, list[i].latitude);
                let myIcon = new BMap.Icon(baseUrl+"/img/resource/sj.png", new BMap.Size(30, 30));
                myIcon.setImageSize(new BMap.Size(30, 30));
                let sgsMark = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                sgsMark.pointType = "SJ";
                emergency.$data.map.addOverlay(sgsMark);
                if(list[i].code) {
                    let label = new BMap.Label(list[i].code, {
                        offset: new BMap.Size(-45, 27)
                    });
                    label.setStyle({
                        color : "black",
                        fontSize : "14px",
                        fontWeight: "bold",
                        border: '0',
                        padding:'0',
                        opacity:0.7,
                    });
                    sgsMark.setLabel(label); //为标注添加一个标签
                }
            }
        },

        /*initOCX:function() {
            MyActiveX1.setjobnum(1005);
            MyActiveX1.setextnum(1005);
            MyActiveX1.setusername("1005");
            MyActiveX1.setGrpID(3);
            MyActiveX1.setLevelNum(3);
            MyActiveX1.setRoleID(3);
            MyActiveX1.SetCompanyId(1704202325524228143242);
            MyActiveX1.SetGrpName("测试1");
            MyActiveX1.SetAuthority("77,78,79,80,81,82,83,84,85,86");
            MyActiveX1.SetVoiceFile("test.wav","d:\\test.wav",0);
            MyActiveX1.init("125.71.214.70",9033);
            MyActiveX1.SipRegister("125.71.214.70",5050,"zhaojie18628038488",30);
        },
        makeCall: function(phoneNum) {
            alert(phoneNum);
            MyActiveX1.MakeCall("13880403060",0);
        }*/
    }
});
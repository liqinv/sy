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
        processModel:{},
        //eventFileList:[],
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
            this.initFileInputCallback();
        },
        initDatetime: function() {
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
        initFileInputCallback: function() {
            $("#event-files").on("fileuploaded", function (event, data, previewId, index) {
                console.log(index+":::"+previewId+":::"+JSON.stringify(data.response));
                if (data.response.code == 200) {
                    if (!emergency.$data.eventModel.fileList) {
                        emergency.$data.eventModel.fileList = [];
                    }
                    emergency.$data.eventModel.fileList.push(data.response.data[0]);
                }
            });
            $("#event-files").on('fileerror', function(event, file, previewId, index) {
                console.log("fileerror");
            });
            $("#event-files").on("filebatchselected", function(event, files) {
                console.log("filebatchselected");
            });
            //初始化的文件删除回调
            $('#event-files').on('filedeleted', function(event, key) {
                console.log('filedeleted::::'+key);
                for(var i=0;i<emergency.$data.eventModel.fileList.length;i++) {
                    var file = emergency.$data.eventModel.fileList[i];
                    if (key == file.id)  {
                        emergency.$data.eventModel.fileList.splice(i,1);
                    }
                }
            });
            //文件全部上传完成后回调
            $('#event-files').on('filebatchuploadcomplete', function(event, files, extra) {
                console.log('File batch upload complete');
                emergency.$data.eventModel.type = $("#addEventSelect").val();
                var url = "/emergency/save";
                YF_HTTP
                    .post(url, emergency.$data.eventModel)
                    .then(function (result) {
                        Utils.showMsg("保存成功！",2000,"success");
                        emergency.$data.eventModel = result.data;
                        emergency.initFileInput();
                        emergency.selectEventList();

                    });
            });
        },
        initFileInput: function() {
            var initialPreviewData = [];
            var initialPreviewConfigData = [];
            if(emergency.$data.eventModel.fileList) {
                for(var i=0;i<emergency.$data.eventModel.fileList.length;i++) {
                    var file = emergency.$data.eventModel.fileList[i];
                    initialPreviewData.push(file.originalPath);
                    var cc = {};
                    cc.caption = file.fileName;
                    //cc.width = "120px";
                    cc.url="/common/fileRemove";
                    cc.key=file.id;
                    cc.extra={id: file.id};
                    cc.downloadUrl = file.originalPath;
                    cc.size = file.fileSize;
                    initialPreviewConfigData.push(cc);
                }
            }

            $("#event-files").fileinput('destroy');
            $("#event-files").fileinput({
                maxFileCount: 3,
                language: 'zh',
                theme: 'explorer-fa',
                uploadUrl: '/common/fileUpload',
                showCaption: false,
                enctype:'multipart/form-data',
                dropZoneEnabled: false,
                overwriteInitial: false,
                showRemove: false,
                showUpload: false,
                showClose: false,
                fileActionSettings:{
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
                    'doc': function(ext) {return ext.match(/(doc|docx)$/i);},
                    'xls': function(ext) {return ext.match(/(xls|xlsx)$/i);},
                    'ppt': function(ext) {return ext.match(/(ppt|pptx)$/i);},
                    'zip': function(ext) {return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);},
                    'htm': function(ext) {return ext.match(/(htm|html)$/i);},
                    'mov': function(ext) {return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);},
                    'mp3': function(ext) {return ext.match(/(mp3|wav)$/i);},
                    'txt': function(ext) {return ext.match(/(txt|ini|csv|java|php|js|css)$/i);}
                },

                initialPreviewAsData: true,
                initialPreview: initialPreviewData,
                initialPreviewConfig: initialPreviewConfigData

            });
            $('.file-preview').attr("style","overflow:scroll; max-height:150px;");
        },
        initFileInputDetail: function() {
            var initialPreviewData = [];
            var initialPreviewConfigData = [];
            if(emergency.$data.eventModel.fileList) {
                for(var i=0;i<emergency.$data.eventModel.fileList.length;i++) {
                    var file = emergency.$data.eventModel.fileList[i];
                    initialPreviewData.push(file.originalPath);
                    var cc = {};
                    cc.caption = file.fileName;
                    cc.key=file.id;
                    cc.downloadUrl = file.originalPath;
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
                fileActionSettings:{
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
                    'doc': function(ext) {return ext.match(/(doc|docx)$/i);},
                    'xls': function(ext) {return ext.match(/(xls|xlsx)$/i);},
                    'ppt': function(ext) {return ext.match(/(ppt|pptx)$/i);},
                    'zip': function(ext) {return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);},
                    'htm': function(ext) {return ext.match(/(htm|html)$/i);},
                    'mov': function(ext) {return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);},
                    'mp3': function(ext) {return ext.match(/(mp3|wav)$/i);},
                    'txt': function(ext) {return ext.match(/(txt|ini|csv|java|php|js|css)$/i);}
                },

                initialPreviewAsData: true,
                initialPreview: initialPreviewData,
                initialPreviewConfig: initialPreviewConfigData

            });
            $('.file-preview').attr("style","overflow:scroll; max-height:230px;");
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
                            emergency.initFileInput();
                            $('#divAddEvent').modal('show');
                        } else {
                            emergency.initFileInputDetail();
                            $('#divDetail').modal('show');
                        }
                    });
            } else {
                this.eventModel = {};
                emergency.initFileInput();
                this.eventModel.category = this.categoryList[0].configKey;
                $('#addEventSelect').select2().val( this.typeList[0].children[0].configKey).trigger('change');
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

                        Utils.showMsg("保存成功！",2000,"success");
                        emergency.$data.eventModel = result.data;
                        emergency.selectEventList();
                    });
            }

        },
        notice: function(statusKey) {
            if (this.eventModel.status == "BA005") {
                this.saveEvent();
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
                    if (emergency.$data.processModel.node == "BD001") {
                        $('#divAddEvent').modal('hide');//关闭模态框
                        emergency.initFileInputDetail();
                        $('#divDetail').modal('show');
                    }
                })
        },
        reportUi: function() {
            this.processModel = {};
            $('#divContinue').modal('show');
        },
        report: function() {
            this.processModel.node = "BD005";
            this.processModel.eventId = this.eventModel.id;
            var url = "/emergency/addProcess";
            YF_HTTP
                .post(url, this.processModel)
                .then(function (result) {
                    $('#divContinue').modal('hide');//关闭模态框
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
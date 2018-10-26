var gpsList = new Vue({
    el: "#gpsList",
    data: {
        gpsData: [],
        tree: null,
        searchObj: {
            pageNo: 1,
            name: '',
            path: '',
            searchCondition: ''
        },
        gpsModel: { },//新增对象
        gpsType: {},//机构类型
        isExistPermission: false, //判断是否存在权限
        permissionTreeList: [], //权限树形列表,
        clickOrgan: {},//机构树选中获取机构
    },
    methods: {
        prePage: function () {
            this.searchObj.pageNo = this.gpsData.prePage;
            this.selectgpsList();
        },
        currPage: function (pageIndex) {
            this.searchObj.pageNo = pageIndex;
            this.selectgpsList();
        },
        nextPage: function () {
            this.searchObj.pageNo = this.gpsData.nextPage;
            this.selectgpsList();
        },
        selectgpsList: function () {
            var url = "/device/gps/selectGps";
            YF_HTTP.post(url, this.searchObj)
                .then(function (result) {
                    gpsList.$data.gpsData = result.data;
                });
        },
        getOrganAll: function () {
            var url = "/sys/organ/getOrganAll";
            YF_HTTP.post(url)
                .then(function (result) {
                    if (result.data == null || result.data == undefined || result.data.length < 1) {
                        gpsList.$data.isExistPermission = false
                    } else {
                        gpsList.$data.isExistPermission = true;
                        $('#divOrganPermissionTree').treeview({
                            data: result.data,
                            onNodeSelected: function (event, data) {
                                gpsList.$data.clickOrgan = data;
                                gpsList.$data.searchObj.orgId = data.id;
                                gpsList.selectgpsList();
                            },
                            onNodeUnselected: function (event, data) {
                                gpsList.$data.searchObj.orgId = "";
                            }
                        });
                    }


                });
        },
        editOrgan: function () {
            var url = "/device/gps/edit";
            YF_HTTP
                .post(url, this.gpsModel)
                .then(function (result) {
                    if(result.description == "此设备已存在"){
                        Utils.showMsg("此设备编号已存在", "1500", "warning");
                        return;
                    }
                    $('#divEditOrgan').modal('hide');//关闭模态框
                    gpsList.selectgpsList();
                    gpsList.getOrganAll();
                })
        },
        deleteOrgan: function () {
            var url = "/device/gps/delete";
            YF_HTTP
                .post(url, this.gpsModel)
                .then(function (result) {
                    $('#divDeleteWarning').modal('hide');//关闭模态框
                    gpsList.selectgpsList();
                    gpsList.getOrganAll();
                    gpsList.$data.gpsModel = {};
                    Utils.showMsg("删除成功", 2000, 'success');
                })
        },
        addOrgan: function () {
            var url = "/device/gps/add";
            this.gpsModel.orgId = this.clickOrgan.id;
            YF_HTTP
                .post(url, this.gpsModel)
                .then(function (result) {
                    if(result.description == "此设备已存在"){
                        Utils.showMsg("此设备编号已存在", "1500", "warning");
                        return;
                    }
                    $('#divAddOrgan').modal('hide');//关闭模态框
                    gpsList.selectgpsList();
                    gpsList.getOrganAll();
                    gpsList.$data.gpsModel = {};
                })
        },
        selectConfig: function () {
            var url = "/device/gps/getType";
            var param = Qs.stringify({type: 3});
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    gpsList.$data.gpsType = result.data;
                    if(result.data && result.data[0]){
                        gpsList.$data.gpsModel.type = result.data[0].id;
                    }
                })
        },
        deleteConfirm: function (role) {
            this.gpsModel = role;
            Utils.confirm("确认删除？", "warning").then(function (isOk) {
                if (isOk) {
                    gpsList.deleteOrgan();
                }
            });
        },
        showEditGps: function (organ) {
            var url = "/device/gps/getGps?gpsId=" + organ.id;
            //获取此角色最新信息
            YF_HTTP
                .post(url)
                .then(function (result) {
                    gpsList.$data.gpsModel = result.data;
                    $('#divEditOrgan').modal('show');
                });
        },
        addJudge: function () {
            if (!gpsList.searchObj.orgId) {
                Utils.showMsg("请选择机构", "1500", "warning");
                return;
            }
            gpsList.$data.gpsModel={};
            gpsList.$data.gpsModel.type = '';
            $('#divAddOrgan').modal('show');
        }
    },
    mounted: function () {
        this.selectgpsList();
        this.selectConfig();
        this.getOrganAll();
    }
});











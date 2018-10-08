var organList = new Vue({
    el: "#organ",
    data: {
        organData: [],
        tree: null,
        searchObj: {
            pageNo: 1,
            name: '',
            path: '',
            searchCondition: ''
        },
        organModel: { },//新增对象
        organType: {},//机构类型
        isExistPermission: false, //判断是否存在权限
        permissionTreeList: [], //权限树形列表,
        clickOrgan: {},//机构树选中获取机构
    },
    methods: {
        prePage: function () {
            this.searchObj.pageNo = this.organData.prePage;
            this.selectOrganList();
        },
        currPage: function (pageIndex) {
            this.searchObj.pageNo = pageIndex;
            this.selectOrganList();
        },
        nextPage: function () {
            this.searchObj.pageNo = this.organData.nextPage;
            this.selectOrganList();
        },
        selectOrganList: function () {
            var url = "/sys/organ/selectOrgan";
            YF_HTTP.post(url, this.searchObj)
                .then(function (result) {
                    organList.$data.organData = result.data;
                });
        },
        getOrganAll: function () {
            var url = "/sys/organ/getOrganAll";
            YF_HTTP.post(url)
                .then(function (result) {
                    if (result.data == null || result.data == undefined || result.data.length < 1) {
                        organList.$data.isExistPermission = false
                    } else {
                        organList.$data.isExistPermission = true;
                        $('#divOrganPermissionTree').treeview({
                            data: result.data,
                            onNodeSelected: function (event, data) {
                                organList.$data.clickOrgan = data;
                                organList.$data.searchObj.path = data.path;
                                organList.selectOrganList();
                            },
                            onNodeUnselected: function (event, data) {
                                organList.$data.searchObj.path = "";
                            }
                        });
                    }


                });
        },
        editOrgan: function () {
            var url = "/sys/organ/edit";
            YF_HTTP
                .post(url, this.organModel)
                .then(function (result) {
                    $('#divEditOrgan').modal('hide');//关闭模态框
                    organList.selectOrganList();
                    organList.getOrganAll();
                })
        },
        deleteOrgan: function () {
            var url = "/sys/organ/delete";
            YF_HTTP
                .post(url, this.organModel)
                .then(function (result) {
                    $('#divDeleteWarning').modal('hide');//关闭模态框
                    organList.selectOrganList();
                    organList.getOrganAll();
                    organList.$data.organModel = {};
                    Utils.showMsg("删除成功", 2000, 'success');
                })
        },
        addOrgan: function () {
            var url = "/sys/organ/add";
            this.organModel.parentId = this.clickOrgan.id;
            YF_HTTP
                .post(url, this.organModel)
                .then(function (result) {
                    $('#divAddOrgan').modal('hide');//关闭模态框
                    organList.selectOrganList();
                    organList.getOrganAll();
                    organList.$data.organModel = {};
                })
        },
        selectConfig: function () {
            var url = "/common/configList";
            var param = Qs.stringify({type: 3});
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    organList.$data.organType = result.data;
                    organList.$data.organModel.type = result.data[0].configKey;
                })
        },
        deleteConfirm: function (role) {
            this.organModel = role;
            Utils.confirm("确认删除？", "warning").then(function (isOk) {
                if (isOk) {
                    organList.deleteOrgan();
                }
            });
        },
        showEditOrgan: function (organ) {
            var url = "/sys/organ/getOrgan?organVoId=" + organ.id;
            //获取此角色最新信息
            YF_HTTP
                .post(url)
                .then(function (result) {
                    organList.$data.organModel = result.data;
                    $('#divEditOrgan').modal('show');
                });
        },
        addJudge: function () {
            if (!organList.searchObj.path) {
                Utils.showMsg("请选择机构", "1500", "warning");
                return;
            }
            organList.$data.organModel={};
            organList.$data.organModel.type = 'AC001';
            $('#divAddOrgan').modal('show');
        }
    },
    mounted: function () {
        this.selectOrganList();
        this.selectConfig();
        this.getOrganAll();
    }
});











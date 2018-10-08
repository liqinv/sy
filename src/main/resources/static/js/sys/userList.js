var userList = new Vue({
    el: "#user",
    data: {
        userData: [],
        // userEdit: {}, //编辑对象
        // userDel: {}, //删除对象
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: '',
            sysOrgan: {
                path: ""
            }
        },
        userModel: {},
        jobList: [],
        typeList: [],
        statusList: [],
        permissionTreeList: [], //权限树形列表,
        clickOrgan: {},//选中机构时机构对象
        userBy: {},//查询单个
        treeData: {},//机构树数组
        roleList: {}//角色
    },
    methods: {
        selectUserList: function () {
            var url = "/sys/user/selectUser";
            YF_HTTP
                .post(url, this.searchObj)
                .then(function (result) {
                    userList.$data.userData = result.data;
                });
        },
        prePage: function () {
            this.searchObj.pageNo = this.userData.prePage;
            this.selectUserList();
        },
        currPage: function (pageIndex) {
            this.searchObj.pageNo = pageIndex;
            this.selectUserList();
        },
        nextPage: function () {
            this.searchObj.pageNo = this.userData.nextPage;
            this.selectUserList();
        },
        localList: function () {
            this.searchObj.pageNo = 1;
            this.selectUserList();
        },
        editUser: function () {
            var url = "/sys/user/edit";
            userList.$data.userModel.userRoleKeyId=[userList.$data.userModel.roleId];
            YF_HTTP
                .post(url, this.userModel)
                .then(function (result) {
                    $('#divEditUser').modal('hide');//关闭模态框
                    userList.selectUserList();
                })
        },
        deleteUser: function () {
            var url = "/sys/user/delete";
            // var param = Qs.stringify({userId: this.userDel.id});
            YF_HTTP
                .post(url, this.userModel)
                .then(function (result) {
                    $('#divDeleteWarning').modal('hide');//关闭模态框
                    userList.selectUserList();
                    userList.$data.userModel = {};
                    Utils.showMsg("删除成功", 2000, 'success');
                })
        },
        addUser: function () {
            var url = "/sys/user/add";
            this.userModel.organId = this.clickOrgan.id;
            userList.$data.userModel.userRoleKeyId=[userList.$data.userModel.roleId];
            YF_HTTP
                .post(url, this.userModel)
                .then(function (result) {
                    $('#divAddUser').modal('hide');//关闭模态框
                    userList.selectUserList();
                    userList.$data.userModel = {};
                })
        },
        selectConfig: function (type) {
            var url = "/common/configList";
            var param = Qs.stringify({type: type});
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    if (type == 1) {
                        userList.$data.jobList = result.data;
                        userList.$data.userModel.job = result.data[0].configKey;
                    } else if (type == 2) {
                        userList.$data.typeList = result.data;
                        userList.$data.userModel.type = result.data[0].configKey;
                    }
                })
        },
        getOrganAll: function () {
            var url = "/sys/organ/getOrganAll";
            YF_HTTP.post(url)
                .then(function (result) {
                    userList.$data.treeData = result.data;
                    $('#divUserPermissionTree').treeview({
                        data: result.data,
                        onNodeSelected: function (event, data) {
                            userList.$data.clickOrgan = data;
                            userList.$data.searchObj.sysOrgan.path = data.path;
                            userList.selectUserList();
                        },
                        onNodeUnselected: function (event, data) {
                            userList.$data.searchObj.sysOrgan.path = "";
                        }
                    });
                    $('#divUserPermissionTree1').treeview({
                        data: userList.$data.treeData,
                        isDropdown: true,
                        dropdownWidth: "310px",
                        dropdownHeight: "290px",
                        dropdownId: "treeInput",
                        //initValue: userList.$data.userEdit.organName,
                        onNodeSelected: function (event, data) {
                            userList.$data.userModel.organName=data.name;
                            userList.$data.userModel.organId=data.id;
                            $("#treeInput").val(userList.$data.userModel.organName);
                        },
                    });
                });
        },
        deleteConfirm: function (role) {
            this.userModel = role;
            Utils.confirm("确认删除？", "warning").then(function (isOk) {
                if (isOk) {
                    userList.deleteUser();
                }
            });
        },
        showEditUser: function (user) {
            userList.$data.userBy.id = user.id;
            userList.$data.userModel.organId = user.organId;
            var url = "/sys/user/getUser";
            //获取此角色最新信息
            YF_HTTP
                .post(url, this.userBy)
                .then(function (result) {
                    $('#divEditUser').modal('show');
                    userList.$data.userModel = result.data;
                    userList.$data.userModel.roleId = result.data.roleVoList[0].id;
                    $("#treeInput").val(userList.$data.userModel.organName);
                    //默认选中树节点
                    $('#divUserPermissionTree1').treeview('selectNode', [ userList.$data.userModel.organId, { silent: true } ]);
                });
        },
        selectRole: function () {
            var url = "/sys/role/selectRoleListAll";
            YF_HTTP
                .post(url)
                .then(function (result) {
                    userList.$data.roleList = result.data;
                    userList.$data.userModel.roleId = result.data[0].id;
                })
        },
        addJudge: function () {
            userList.userModel={};
            if (!userList.searchObj.sysOrgan.path) {
                Utils.showMsg("请选择机构", "1500", "warning");
                return;
            }
            userList.$data.userModel.job = 'AA001';
            userList.$data.userModel.type = 'AB002';
            userList.$data.userModel.roleId = 1;
            $('#divAddUser').modal('show');
        }
    },

    mounted: function () {
        this.selectConfig(1);
        this.selectConfig(2);
        this.selectRole();
        this.selectUserList();
        this.getOrganAll();

    }
});

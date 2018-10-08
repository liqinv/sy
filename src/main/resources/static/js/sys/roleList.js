var roleApp = new Vue({
    el: "#roleApp",
    data: {
        roleList: {}, //列表对象
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: '',
        },
        roleModel: {},//临时缓存用
        isExistPermission: false, //判断是否存在权限
        permissionTreeList: [] //权限树形列表
    },
    computed:{
        searchDateRange:function () {
            if(this.searchObj.startDate && this.searchObj.endDate){
                return this.searchObj.startDate + ' / '+this.searchObj.endDate;
            }
            return "";
        }
    },
    mounted: function () {
        this.localList();
    },
    methods: {
        rangDateChange:function(event){
            if(event.target.value == ''){
                this.searchObj.startDate = "";
                this.searchObj.endDate = "";
            }
        },
        prePage: function () {
            this.searchObj.pageNo = this.roleList.prePage;
            this.selectRoleList();
        },
        currPage: function (pageIndex) {
            this.searchObj.pageNo = pageIndex;
            this.selectRoleList();
        },
        nextPage: function () {
            this.searchObj.pageNo = this.roleList.nextPage;
            this.selectRoleList();
        },
        localList: function () {
            this.searchObj.pageNo = 1;
            this.selectRoleList();
        },
        selectRoleList: function () {
            var url = "/sys/role/selectRoleList";
            YF_HTTP
                .post(url, this.searchObj)
                .then(function (result) {
                    roleApp.$data.roleList = result.data;
                });
        },
        addRole: function () {
            var url = "/sys/role/addRole";
            YF_HTTP
                .post(url, this.roleModel)
                .then(function (result) {
                    $('#divAddRole').modal('hide');//关闭模态框
                    roleApp.selectRoleList();
                    roleApp.$data.roleModel.name = "";
                    roleApp.$data.roleModel.note = "";
                })
        },
        showEditRole: function (roleId) {
            var url = "/sys/role/getRoleById?roleId=" + roleId;
            //获取此角色最新信息
            YF_HTTP
                .get(url)
                .then(function (result) {
                    roleApp.$data.roleModel = result.data;
                });
        },
        editRole: function () {
            var url = "/sys/role/editRole";
            YF_HTTP
                .post(url, this.roleModel)
                .then(function (result) {
                    $('#divEditRole').modal('hide');//关闭模态框
                    roleApp.selectRoleList();
                })
        },
        deleteConfirm: function(role){
            this.roleModel = role;
            Utils.confirm("确认删除【"+this.roleModel.name+"】角色吗？",'warning').then(function(isOk){
                if(isOk) {
                    roleApp.deleteRole();
                }
            });
        },
        deleteRole: function () {
            var url = "/sys/role/deleteRole";
            var param = Qs.stringify({roleId: this.roleModel.id});
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    if(result.data == 2){
                        Utils.showMsg("此角色正在被使用，无法删除",3000,'info');
                    }else{
                        roleApp.selectRoleList();
                        roleApp.$data.roleDel = {};
                    }

                })
        },
        selectPermissionList: function (role) {
            this.roleModel = role;
            var url = "/sys/perms/selectPermissionList";
            var param = Qs.stringify({roleId: this.roleModel.id});
            YF_HTTP
                .post(url, param)
                .then(function (result) {
                    roleApp.$data.permissionTreeList = result.data;
                })
        },
        viewPermission: function (role) {
            this.roleModel = role;
            var url = "/sys/perms/selectPermissionListByRoleId";
            var data = {
                roleId: this.roleModel.id
            };
            YF_HTTP
                .post(url, Qs.stringify(data))
                .then(function (result) {
                    if (result.data == null || result.data == undefined || result.data.length < 1) {
                        roleApp.$data.isExistPermission = false
                    } else {
                        roleApp.$data.isExistPermission = true;
                        $('#divRolePermissionTree').treeview({data: result.data});
                    }

                })
        },
        permissionRole: function () {
            var url = "/sys/role/permissionRole";
            var data = {
                paraStr: JSON.stringify(this.permissionTreeList),
                roleId: this.roleModel.id
            };
            YF_HTTP
                .post(url, Qs.stringify(data))
                .then(function (result) {
                    Utils.showMsg("权限设置成功",2000,'success');
                    $('#divRolePermission').modal('hide');
                })
        },
        setCheck: function (menu, md, ac, type) {
            if (type == 1) {
                //菜单
                menu.check = !menu.check;
                for (var i in menu.nodes) {
                    var itemMD = menu.nodes[i];
                    itemMD.check = menu.check;
                    for (var j in itemMD.nodes) {
                        var itemAC = itemMD.nodes[j];
                        itemAC.check = menu.check;
                    }
                }
            } else if (type == 2) {
                //模块
                md.check = !md.check;
                for (var i in md.nodes) {
                    var itemAC = md.nodes[i];
                    itemAC.check = md.check;
                }
                if (md.check) {
                    menu.check = true;
                } else {
                    //判断同级其它是否有选中
                    var isCheckMD = false;
                    for (var i in menu.nodes) {
                        var itemMD = menu.nodes[i];
                        if (itemMD.check) {
                            isCheckMD = true;
                            break;
                        }
                    }
                    if (!isCheckMD) {
                        //没有选中，则设置父级不选中
                        menu.check = false;
                    }
                }
            } else if (type == 3) {
                //功能点
                ac.check = !ac.check;
                if (ac.check) {
                    md.check = true;
                    menu.check = true;
                } else {
                    //判断同级其它是否有选中
                    var isCheckAC = false;
                    for (var i in md.nodes) {
                        var itemAC = md.nodes[i];
                        if (itemAC.check) {
                            isCheckAC = true;
                            break;
                        }
                    }
                    if (!isCheckAC) {
                        //没有选中，则设置父级不选中
                        md.check = false;
                        //判断父级的同级是否有选中
                        var isCheckMD = false;
                        for (var i in menu.nodes) {
                            var itemMD = menu.nodes[i];
                            if (itemMD.check) {
                                isCheckMD = true;
                                break;
                            }
                        }
                        if (!isCheckMD) {
                            //没有选中，则设置父级不选中
                            menu.check = false;
                        }
                    }
                }
            }
        }
    }
});
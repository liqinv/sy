var permissionApp = new Vue({
    el: "#permissionApp",
    data: {
        searchObj: {  //搜索对象
            searchCondition: ''
        },
        permission: {
            resourceUrl: '',
            permission: ''
        },//缓存对象
        permissionTreeList: [], //权限树形列表
        childCount:0
    },
    computed:{
        urlChange:function(){
            return this.permission.resourceUrl;
        }
    },
    watch:{
        'urlChange': function(newVal,oldVal){
            this.permission.permission = newVal;
        }
    },
    mounted: function () {
        this.localList();
    },
    methods: {
        localList: function () {
            this.selectPermissionList();
        },
        selectPermissionList: function () {
            var url = "/sys/perms/selectPermissionTreeSource";
            YF_HTTP
                .post(url)
                .then(function (result) {
                    permissionApp.$data.permissionTreeList = result.data;
                })
        },
        addRootInit: function () {
            this.permission = {};
            this.permission.level = 1;
            this.permission.resourceType = 1;
            this.permission.leaf = 0;
            this.permission.sort = 0;
        },
        addPermission: function () {
            var url = "/sys/perms/addPermission";
            YF_HTTP
                .post(url, this.permission)
                .then(function (result) {
                    $('#divAddPermission').modal('hide');//关闭模态框
                    permissionApp.selectPermissionList();
                    permissionApp.$data.permission = {};
                })
        },
        addInit: function (level,parentId,childCount,childIsMenu) {
            this.childCount = childCount;
            this.permission = {};
            this.permission.parentId = parentId;
            this.permission.level = level;
            this.permission.resourceType = (childIsMenu?1:2);
            this.permission.leaf = 0;
            this.permission.sort = 0;
        },
        deleteConfirm: function (permission) {
            this.permission = permission;
            Utils.confirm("确认删除【" + this.permission.name + "】权限吗？", 'warning').then(function (isOk) {
                if (isOk) {
                    permissionApp.deletePermission();
                }
            });
        },
        deletePermission: function () {
            var url = "/sys/perms/deletePermission";
            YF_HTTP
                .post(url, this.permission)
                .then(function (result) {
                    if(result.data >0){
                        permissionApp.selectPermissionList();
                        permissionApp.$data.permission = {
                            resourceUrl: '',
                            permission: ''
                        };
                    }
                })
        }
    }
});
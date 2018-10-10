var groupList = new Vue({
    el: "#groupList",
    data: {
        groupList: {}, //列表对象
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: '',
        },
        groupModel: {}, //临时缓存用
        userList: {} //用户列表
    },
    mounted: function () {
        this.localList();
        this.selectUserList();

    },
    methods: {
        prePage: function () {
            this.searchObj.pageNo = this.groupList.prePage;
            this.selectGroupList();
        },
        currPage: function (pageIndex) {
            this.searchObj.pageNo = pageIndex;
            this.selectGroupList();
        },
        nextPage: function () {
            this.searchObj.pageNo = this.groupList.nextPage;
            this.selectGroupList();
        },
        localList: function () {
            this.searchObj.pageNo = 1;
            this.selectGroupList();
        },
        selectGroupList: function () {
            var url = "/group/selectGroupList";
            YF_HTTP
                .post(url, this.searchObj)
                .then(function (result) {
                    groupList.$data.groupList = result.data;
                });
        },
        addUi: function() {
            this.groupModel={};
            $('#addUserSelect').select2().val(null).trigger('change');
            $('#divAddGroup').modal('show');
        },
        addGroup: function () {
            var selectedIds = $("#addUserSelect").val().join(",");//获取多选输入框选中值的方式
            this.groupModel.selectedUserIds = selectedIds;
            var url = "/group/add";
            YF_HTTP
                .post(url, this.groupModel)
                .then(function (result) {
                    $('#divAddGroup').modal('hide');//关闭模态框
                    groupList.selectGroupList();
                    groupList.$data.groupModel.name = "";
                    groupList.$data.groupModel.note = "";
                })
        },
        showEditGroup: function (groupId) {
            var url = "/group/get?groupId=" + groupId;
            YF_HTTP
                .get(url)
                .then(function (result) {
                    groupList.$data.groupModel = result.data;
                    $('#editUserSelect').select2().val(result.data.selectedUserIds.split(",")).trigger('change');
        });
        },
        editGroup: function () {
            var selectedIds = $("#editUserSelect").val().join(",");//获取多选输入框选中值的方式
            this.groupModel.selectedUserIds = selectedIds;
            var url = "/group/edit";
            YF_HTTP
                .post(url, this.groupModel)
                .then(function (result) {
                    $('#divEditGroup').modal('hide');//关闭模态框
                    groupList.selectGroupList();
                })
        },
        deleteGroup: function (group) {
            Utils.confirm("确认删除【"+group.name+"】分组吗？",'warning').then(function(isOk){
                if(isOk) {
                    var url = "/group/delete";
                    var param = Qs.stringify({groupId: group.id});
                    YF_HTTP
                        .post(url, param)
                        .then(function (result) {
                            groupList.selectGroupList();
                        })
                }
            });

        },
        selectUserList: function () {
            var url = "/group/selectUser";
            YF_HTTP
                .post(url, {})
                .then(function (result) {
                    groupList.$data.userList = result.data;
                });
        },
    }
});
var resourceList = new Vue({
    el: "#resourceList",
    data: {
        resourceList: {}, //列表对象
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: '',
        },
        resourceModel: {}, //临时缓存用
        typeList: {}
    },
    mounted: function () {
        this.localList();
        this.initType();

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
                        $('#divSave').modal('show');
                    });
            } else {
                this.resourceModel = {};
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
    }
});
var leftMenu = new Vue({
    el:"#leftMenu",
    data:{
        currentUrl: window.location.pathname,
        menuTree:{},
        baseUrl:baseUrl
    },

    mounted:function() {
        this.selectMenuTree();
        if(this.currentUrl.indexOf("/emergency/main") >= 0) {
            $("#layoutBody").addClass("sidebar-collapse");
        }
    },
    methods:{
        classJudge: function (leaf,permission) {
            var content = "";
            if(leaf == 0) {
                content = "treeview ";

            }
            if (this.currentUrl.indexOf(permission) >= 0) {
                content = content + "active menu-open";
            }
            console.log(content);
            return content;
        },
        selectMenuTree:function(){
            var url = baseUrl + "/sys/perms/selectMenuTree";
            axios.post(url).then(function(result){
                leftMenu.$data.menuTree = result.data.data;
            },function(){
                console.error(CONFIG.NETWORK_ERROR);
            })
        },
        selectGroupList: function () {
            var url = "/other/role2";
            YF_HTTP.get(url)
                .then(function (result) {
                    if (result.data.code == 200) {
                        alert(result.data);
                    }
                });
        }
    }
});
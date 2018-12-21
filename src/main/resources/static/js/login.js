new Vue({
    el:"#loginForm",
    data: {
        // username: "",
        // password: ""
    },
    methods:{
        login:function(){
            axios.post(baseUrl+"/login",Qs.stringify({username:this.username,password:this.password}))
                .then(function (result) {
                    var data = result.data;
                    if(data.code == 200){
                        window.location.href = baseUrl + data.data;
                    } else{
                        $("#loginError").html("提示："+data.description).show();
                    }
                }).catch(function () {
                $("#loginError").html(CONFIG.NETWORK_ERROR).show();
            });
        }
    }
});

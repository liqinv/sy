var pwdApp = new Vue({
    el: "#pwdApp",
    data: {
        oldPwd: '',
        newPwd1: '',
        newPwd2: ''
    },
    methods: {
        setPwd: function () {
            if(this.newPwd1 != this.newPwd2){
                Utils.showMsg("新密码和确认新密码不一致",3000,'warning');
                return;
            }
            var url = "/sys/user/editPwd";
            var data = {
                oldPwd:this.oldPwd,
                newPwd:this.newPwd1
            };
            YF_HTTP
                .post(url, Qs.stringify(data))
                .then(function (result) {
                    if(result.data == 1){
                        pwdApp.$data.oldPwd = '';
                        pwdApp.$data.newPwd1 = '';
                        pwdApp.$data.newPwd2 = '';
                        alert("密码修改成功！请重新登录。");
                        window.location.href = baseUrl ;
                    }
                });
        }
    }
});
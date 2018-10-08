var YF_HTTP = axios.create({
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: baseUrl,

    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout: 0,// default is `0` (no timeout)

    // `headers` are custom headers to be sent
    // headers:{'Content-Type':'application/json;charset=UTF-8'},

    // `withCredentials` indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    // withCredentials: false, // default
});

// Add a request interceptor
/*YF_HTTP.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});*/

// Add a response interceptor
YF_HTTP.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.status == 200) {
        if (response.data.code == 200) {
            return response.data;
        } else {
            var logicMsg = response.data.description;
            if (!logicMsg) {
                //shiro登录验证处理
                if (response.data.indexOf("loginForm") > 0) {
                    logicMsg = "登录信息过期，请重新登录！";
                    Utils.alert(logicMsg,"warning").then(function(isOk){
                        if(isOk) {
                            window.location.href = baseUrl;
                        }
                    });
                } else if (response.data.indexOf("403") > 0) {
                    logicMsg = "您没有权限操作此功能，请联系管理员！";
                    Utils.alert(logicMsg,"warning");
                }
            }

            return Promise.reject("业务处理异常:::"+logicMsg);
        }
    } else {
        //console.log("response status:::"+response.status);
        Utils.alert("response status:::"+response.status,"error");
        return Promise.reject("response status:::"+response.status);
    }
}, function (error) {
    // Do something with response error
    //console.log(CONFIG.NETWORK_ERROR+":::"+error);
    Utils.alert(CONFIG.NETWORK_ERROR+":::"+error,"error");
    return Promise.reject(error);
});
var Utils = {
    /**
     * 消息提示框
     * @param text    消息内容（必填）
     * @param icon    消息图标（可选） "warning", "error", "success","info"
     */
    alert:function (text,icon) {
        var promise = new Promise(function(resolve) {
            swal({
                text: text,
                icon: icon,
                button: "确定",
                closeOnClickOutside: false,
            }).then(function(data) {
                resolve(data);
            });
        });
        return promise;
    },
    /**
     * 消息确认框
     * @param text        消息内容（必填）
     * @param icon        消息图标（可选） "warning", "error", "success","info"
     */
    confirm:  function (text,icon) {
        var promise = new Promise(function(resolve) {
            swal({
                text: text,
                icon: icon,
                buttons: {
                    cancel: "取消",
                    confirm: "确定",
                },
                dangerMode: true,
                closeOnClickOutside: false,
            }).then(function(data) {
                resolve(data);
            });
        });
        return promise;
    },
    /**
     * 定时关闭消息框
     * @param text      消息内容（必填）
     * @param timer     显示时间（必填，单位：毫秒）
     * @param icon      消息图标（可选） "warning", "error", "success","info"
     */
    showMsg: function (text,timer,icon) {
        swal({
            text: text,
            buttons: false,
            timer: timer,
            icon:icon,
        });
    },

    dateFormat:function(date) {
        var year=date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
        // 拼接
        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },

};
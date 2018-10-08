<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate ="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
<div layout:fragment="content">
    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>首页</h1>
    </section>
    <!-- Main content -->
    <section id="mainid" class="content container-fluid">
        <h2><a href="/logout">logout</a></h2>
        <h3 shiro:hasPermission="/other/role1"><a  href="/other/role1">role1</a></h3>
        <h3 shiro:hasPermission="/other/role2"><a  href="/other/role2">role2</a></h3>
        <h3 shiro:hasPermission="/other/main"><a  href="/other/main">main</a></h3>
        <h3  v-on:click="testalert()">提示框</h3>
        <h3  v-on:click="testconfirm()">确认框</h3>
        <h3  v-on:click="testmsg()">定时消息框</h3>
    </section>
</div>
<th:block layout:fragment="javascript">
    <script>
        var mainid = new Vue({
            el:"#mainid",

            methods:{
                testalert:function(){
                    Utils.alert("保存成功","success");
                },
                testconfirm: async function () {
                    var p = await Utils.confirm("确认删除？");
                    if (p) {
                        alert("确认");
                    } else {
                        alert("取消");
                    }
                },
                testmsg:function(){
                    Utils.showMsg("3秒后消失",3000,"success");
                },
            }
        });
    </script>
</th:block>
</body>
</html>
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta content="Copyright &copy;www.sc-yongfeng.com 版权所有" name="copyright"/>
    <meta content="权限管理" name="keywords"/>
    <title>应急指挥-登录</title>
    <link th:href="@{/bootstrap/dist/css/bootstrap.min.css}" rel="stylesheet">
    <link th:href="@{/css/sign.css}" rel="stylesheet">
    <link rel="stylesheet" th:href="@{/adminlte/font-awesome/css/font-awesome.min.css}">
    <link rel="stylesheet" th:href="@{/adminlte/Ionicons/css/ionicons.min.css}">
    <link rel="stylesheet" th:href="@{/adminlte/dist/css/AdminLTE.min.css}">
    <!-- HTML5 shim 和 Respond.js 是为了让 IE9 支持 HTML5 元素和媒体查询（media queries）功能 -->
    <!--[if lt IE 9]>
    <script type="text/javascript" th:src="@{/js/common/html5shiv.min.js}"></script>
    <script type="text/javascript" th:src="@{/js/common/respond.min.js}"></script>
    <![endif]-->
    <script th:inline="javascript">
        var baseUrl = [[${#httpServletRequest.contextPath}]];
    </script>
</head>
<body class="hold-transition login-page">
<div class="login-box">
    <div class="login-logo">
        <div class="form-group">
        <a href="#"><b>石羊街道</b></a>
        </div>
        <div class="form-group">
        <a href="#"><b>应急指挥系统</b></a>
        </div>
    </div>
    <div class="login-box-body">
        <p class="login-box-msg"></p>
        <form id="loginForm" method="post" v-on:submit.prevent="login()">
            <div class="form-group has-feedback">
                <input type="text" v-model="username"  class="form-control" placeholder="账号" required>
                <span class="glyphicon glyphicon-user form-control-feedback"></span>
            </div>
            <div class="form-group has-feedback">
                <input type="password" v-model="password" class="form-control" placeholder="密码" required>
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <div>
                <button class="btn btn-primary btn-block" type="submit">登录</button>
            </div>
            <div class="social-auth-links text-center" style='color: red;' id="loginError"></div>
        </form>
    </div>
</div>

<script type="text/javascript" th:src="@{/vue/vue.js}"></script>
<script type="text/javascript" th:src="@{/vue/polyfill.min.js}"></script>
<script type="text/javascript" th:src="@{/vue/axios.min.js}"></script>
<script type="text/javascript" th:src="@{/vue/qs.min.js}"></script>
<script type="text/javascript" th:src="@{/js/common/jquery/jquery-1.12.4.min.js}"></script>
<script type="text/javascript" th:src="@{/bootstrap/dist/js/bootstrap.min.js}"></script>
<script type="text/javascript" th:src="@{/js/config.js}"></script>
<script type="text/javascript" th:src="@{/js/login.js}"></script>
</body>
</html>
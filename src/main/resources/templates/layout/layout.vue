<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta content="Copyright &copy;www.sc-yongfeng.com 版权所有" name="copyright"/>
    <meta content="权限管理" name="keywords"/>
    <title>永峰基础框架</title>
    <link rel="stylesheet" th:href="@{/js/common/viewer/viewer.min.css}"/>
    <link rel="stylesheet" th:href="@{/bootstrap/dist/css/bootstrap.min.css}">
    <link rel="stylesheet" th:href="@{/adminlte/font-awesome/css/font-awesome.min.css}">
    <link rel="stylesheet" th:href="@{/adminlte/Ionicons/css/ionicons.min.css}">
    <link rel="stylesheet" th:href="@{/adminlte/components/select2/css/select2.min.css}">
    <link rel="stylesheet" th:href="@{/adminlte/dist/css/AdminLTE.min.css}">
    <link rel="stylesheet" th:href="@{/adminlte/dist/css/skins/_all-skins.min.css}">
    <link rel="stylesheet" th:href="@{/css/index.css}">
    <!-- HTML5 shim 和 Respond.js 是为了让 IE8 支持 HTML5 元素和媒体查询（media queries）功能 -->
    <!--[if lt IE 9]>
    <script type="text/javascript" th:src="@{/js/common/html5shiv.min.js}"></script>
    <script type="text/javascript" th:src="@{/js/common/respond.min.js}"></script>
    <![endif]-->
    <script th:inline="javascript">
        var baseUrl = [[${#servletContext.contextPath}]];
    </script>
</head>
<body class="hold-transition skin-blue sidebar-mini" id="layoutBody">
<div class="wrapper">
    <!-- Main Header -->
    <header class="main-header">
        <!-- Logo -->
        <a href="index2.html" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-mini">石羊</span>
            <span class="logo-lg"><b>石羊街办</b></span>
        </a>

        <!-- Header Navbar -->
        <nav class="navbar navbar-static-top" role="navigation">
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button"></a>
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <li class="dropdown user user-menu">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <img th:src="@{/adminlte/dist/img/avatar5.png}" class="user-image" alt="User Image">
                            <span class="hidden-xs"><shiro:principal property="name"/></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="user-header">
                                <img th:src="@{/adminlte/dist/img/avatar5.png}" class="img-circle" alt="User Image">

                                <p>
                                    <shiro:principal property="name"/> - <shiro:principal property="organName"/>
                                    <!--<small><shiro:principal property="roleName"/></small>-->
                                </p>
                            </li>
                            <li class="user-body">
                                <div class="row">
                                    <div class="col-xs-4 text-center">
                                        <a th:href="@{/sys/user/pwd}">修改密码</a>
                                    </div>
                                </div>
                            </li>
                            <li class="user-footer">
                                <div class="pull-right">
                                    <a th:href="@{/logout}" class="btn btn-default btn-flat">退出系统</a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar"  id="leftMenu">
        <section class="sidebar">
            <ul class="sidebar-menu" data-widget="tree">
                <li class="header" style="font-size: 14px;padding:10px 25px 10px 20px" v-on:click="selectGroupList()">导航菜单</li>

                <li :class="classJudge(first.leaf,first.permission)" v-for="first in menuTree">
                    <a v-bind:href="baseUrl+first.resourceUrl">
                        <i :class="first.icon"></i>
                        <span>{{first.name}}</span>
                        <span  v-if="first.leaf == 0" class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
                    </a>
                    <ul v-if="first.leaf == 0" class="treeview-menu" >
                        <li v-for="second in first.nodes" v-bind:class="{active : currentUrl.indexOf(second.permission) >= 0 }" >
                            <a v-bind:href="baseUrl+second.resourceUrl" ><i :class="second.icon"></i> {{second.name}}</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </section>
        <!-- /.sidebar -->
    </aside>
    <!-- 正文 -->
    <div layout:fragment="content" class="content-wrapper">

    </div>

    <!-- Main Footer -->
    <!--<footer class="main-footer">
        <strong>Copyright &copy; 2018 <a href="#">YongFeng Tech</a>.</strong> All rights reserved.
    </footer>-->
    <script type="text/javascript" th:src="@{/vue/vue.js}"></script>
    <script type="text/javascript" th:src="@{/vue/polyfill.min.js}"></script>
    <script type="text/javascript" th:src="@{/vue/axios.min.js}"></script>
    <script type="text/javascript" th:src="@{/vue/qs.min.js}"></script>
    <script type="text/javascript" th:src="@{/js/common/jquery/jquery-1.12.4.min.js}"></script>
    <script type="text/javascript" th:src="@{/bootstrap/dist/js/bootstrap.min.js}"></script>
    <script type="text/javascript" th:src="@{/js/common/ajaxfileupload.js}"></script>
    <script type="text/javascript" th:src="@{/js/common/viewer/viewer.min.js}"></script>
    <script type="text/javascript" th:src="@{/js/common/moment/moment.min.js}"></script>
    <script type="text/javascript" th:src="@{/bootstrap/bootstrap-daterangepicker/daterangepicker.js}"></script>
    <script type="text/javascript" th:src="@{/bootstrap/bootstrap-datepicker/js/bootstrap-datepicker.min.js}"></script>
    <script type="text/javascript" th:src="@{/js/common/jquery/jquery.slimscroll.min.js}"></script>
    <script type="text/javascript" th:src="@{/js/common/fastclick.js}"></script>
    <script type="text/javascript" th:src="@{/adminlte/dist/js/adminlte.min.js}"></script>
    <script type="text/javascript" th:src="@{/js/config.js}"></script>
    <script type="text/javascript" th:src="@{/js/utils.js}"></script>
    <script type="text/javascript" th:src="@{/js/layout/layout.js}"></script>
    <script type="text/javascript" th:src="@{/bootstrap/sweetalert/sweetalert.min.js}"></script>
    <!-- 存放具体业务页面需要引入的javascript文件 -->
    <th:block layout:fragment="javascript"></th:block>
</div>
</body>
</html>
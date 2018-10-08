<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>Demo演示</title>
    <th:block layout:fragment="stylelink">
        <link rel="stylesheet" th:href="@{/bootstrap/bootstrap-treeview/bootstrap-treeview.min.css}"/>
        <link rel="stylesheet" th:href="@{/bootstrap/bootstrap-daterangepicker/daterangepicker.css}"/>
    </th:block>
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                Demo
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">系统管理</a></li>
                <li class="active">Demo 演示</li>
            </ol>
        </section>
        <section class="content" id="testApp">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box box-purple">
                        <div class="box-header">
                            <button shiro:hasPermission="/sys/role/addRole" type="button" class="pull-right margin-r-5 btn btn-primary" data-toggle="modal" data-target="#divAddRole"><i class="fa fa-plus"></i> 新增</button>
                            <div class="input-group margin-r-5 pull-right" style="width: 200px;">
                                <input type="text" v-model="searchObj.searchCondition" class="form-control">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-social-icon btn-primary" v-on:click="localList()"><i class="fa fa-search"></i></button>
                                </span>
                            </div>
                        </div>
                        <!-- /.box-header -->
                        <div class="box-body">
                            <div id="example2_wrapper" class="dataTables_wrapper form-inline dt-bootstrap">
                                <div class="row">
                                    <div class="col-sm-6"></div>
                                    <div class="col-sm-6"></div>
                                </div>
                                <div class="row">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="box box-info">
                        <div class="box-header with-border">
                            <h3 class="box-title">日历控件演示</h3>
                        </div>
                        <div class="form-horizontal">
                            <div class="box-body">
                                <div class="form-group">
                                    <label for="singleDate" class="col-sm-2 control-label">单个日期</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="singleDate" placeholder="请选择日期">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="dateRang" class="col-sm-2 control-label">日期范围</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control pull-right" id="dateRang" v-bind:value="searchDateRange" v-on:input="rangDateChange($event)" placeholder="日期范围">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="box-footer">
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div>
    <th:block layout:fragment="javascript">
        <script th:src="@{/bootstrap/bootstrap-treeview/bootstrap-treeview.min.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-daterangepicker/daterangepicker.js}"></script>
        <script th:src="@{/js/sys/test.js}"></script>
    </th:block>
</div>
</body>
</html>
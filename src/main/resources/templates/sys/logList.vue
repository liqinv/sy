<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}">
<head>
    <title>日志列表</title>
    <th:block layout:fragment="stylelink">
        <link rel="stylesheet" th:href="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.css}">
        <link rel="stylesheet" th:href="@{/bootstrap/bootstrap-daterangepicker/daterangepicker.css}">
    </th:block>
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                日志管理
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">系统管理</a></li>
                <li class="active">日志管理</li>
            </ol>
        </section>
        <section class="content" id="logList">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box box-purple">
                        <!-- /.box-header -->
                        <div class="box-header">
                            <div class="input-group margin-r-5 pull-right" style="width: 200px;">
                                <input type="text" v-model="searchObj.searchCondition" class="form-control">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-social-icon btn-primary" v-on:click="selectlogList()"><i class="fa fa-search"></i></button>
                                </span>
                            </div>
                            <div class="input-group pull-right margin-r-5" style="width: 250px;">
                                <div class="input-group">
                                    <div class="input-group-addon">
                                        <i class="fa fa-calendar"></i>
                                    </div>
                                    <input type="text" class="form-control pull-right" id="dateRang" :value="searchDateRange" v-on:input="rangDateChange($event)" placeholder="日期范围">
                                </div>
                                <!-- /.input group -->
                            </div>
                        </div>
                        <div class="box-body">
                            <div class="dataTables_wrapper form-inline dt-bootstrap">
                                <div class="row">
                                    <div class="col-sm-6"></div>
                                    <div class="col-sm-6"></div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <table class="table table-bordered table-hover">
                                            <thead>
                                            <tr>
                                                <th class="sorting" rowspan="1" colspan="1">操作用户</th>
                                                <th class="sorting" rowspan="1" colspan="1">用户机构</th>
                                                <th class="sorting" rowspan="1" colspan="1">具体操作</th>
                                                <th class="sorting" rowspan="1" colspan="1">操作时间</th>
                                                <th class="sorting" rowspan="1" colspan="1">客户IP</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr class="odd" v-for="r in logData.list">
                                                <td>{{r.userName}}</td>
                                                <td>{{r.organName}}</td>
                                                <td>{{r.operation}}</td>
                                                <td>{{r.oprerationTime}}</td>
                                                <td>{{r.ipAddress}}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <page-div v-bind:pageobj="logData" v-on:prepage="prePage" v-on:currpage="currPage" v-on:nextpage="nextPage"></page-div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <th:block layout:fragment="javascript">
        <script th:src="@{/bootstrap/datatables.net/jquery.dataTables.min.js}"></script>
        <script th:src="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.js}"></script>
        <script th:src="@{/js/component/page-component.js}"></script>
        <script th:src="@{/js/sys/logList.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-daterangepicker/daterangepicker.js}"></script>

    </th:block>
</div>
</body>
</html>
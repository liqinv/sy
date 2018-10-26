<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}" xmlns:shiro="http://www.w3.org/1999/xhtml">
<head>
    <title>设备列表</title>
    <th:block layout:fragment="stylelink">
        <link rel="stylesheet" th:href="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.css}">
    </th:block>
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                设备管理
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">设备管理</a></li>
            </ol>
        </section>
        <section class="content" id="gpsList">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box box-purple">
                        <!-- /.box-header -->
                        <div class="box-header">
                            <button type="button" class="pull-right btn btn-primary" v-on:click="addJudge()">
                                <i class="fa fa-plus"></i> 新增
                            </button>
                            <div class="input-group margin-r-5 pull-right" style="width: 200px;">
                                <input type="text" v-model="searchObj.searchCondition" class="form-control">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-social-icon btn-primary" v-on:click="selectgpsList()">
                                        <i class="fa fa-search"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                        <div class="box-body">
                            <div class="dataTables_wrapper form-inline dt-bootstrap">
                                <div class="row">
                                    <div class="col-sm-3">
                                        <!--机构树-->
                                        <div id="divOrganPermissionTree" v-show="isExistPermission" style="border: 1px solid #ddd;max-height: 617px;overflow:auto;"></div>
                                    </div>
                                    <div class="col-sm-9">
                                        <table class="table table-bordered table-hover">
                                            <thead>
                                            <tr>
                                                <th class="sorting" rowspan="1" colspan="1">设备名称</th>
                                                <th class="sorting" rowspan="1" colspan="1">设备编号</th>
                                                <th class="sorting" rowspan="1" colspan="1">设备类型</th>
                                                <th class="sorting" rowspan="1" colspan="1">RTMP地址</th>
                                                <th style="width: 200px">操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr class="odd" v-for="r in gpsData.list">
                                                <td>{{r.gpsName}}</td>
                                                <td>{{r.number}}</td>
                                                <td>{{r.typeName}}</td>
                                                <td>{{r.iconUrl}}</td>
                                                <td>
                                                    <span shiro:hasPermission="/device/gps/edit" class="span-a" v-on:click="showEditGps(r)">修改</span>
                                                    <span shiro:hasPermission="/device/gps/delete" class="span-a" v-on:click="deleteConfirm(r)">删除</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <page-div v-bind:pageobj="gpsData" infowidthclass="col-sm-4" pagewidthclass="col-sm-5" v-on:prepage="prePage" v-on:currpage="currPage" v-on:nextpage="nextPage"></page-div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- 新增弹框 -->
            <div class="modal fade" id="divAddOrgan" style="display: none;" data-backdrop="static">
                <div class="modal-dialog ">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">新增设备</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="addOrgan()" class="form-horizontal">
                                <div class="box-body">
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>设备名称</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="gpsModel.gpsName" class="form-control" placeholder="设备名称" maxlength="30" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>设备编号</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="gpsModel.number" class="form-control" placeholder="设备编号" maxlength="30" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>设备类型</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <select v-model="gpsModel.typeId" class="form-control" required="required">
                                                <option v-for="send  in gpsType" name="typeId" :value="send.id">
                                                    {{send.name}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>RTMP地址</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="gpsModel.iconUrl" class="form-control" placeholder="RTMP地址" min="1" max="50">
                                        </div>
                                    </div>
                                </div>
                                <div class="box-footer">
                                    <button type="submit" class="btn btn-primary pull-right"><i class="fa fa-save"></i>保存
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 修改弹框 -->
            <div class="modal fade " id="divEditOrgan" style="display: none;" data-backdrop="static">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">修改设备</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="editOrgan()" class="form-horizontal">
                                <div class="box-body">
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>设备名称</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="gpsModel.gpsName" class="form-control" placeholder="设备名称" maxlength="30" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>设备编号</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="gpsModel.number" class="form-control" placeholder="设备编号" maxlength="30" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>设备类型</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <select v-model="gpsModel.typeId" class="form-control"  required="required">
                                                <option v-for="send  in gpsType" name="typeId" :value="send.id">
                                                    {{send.name}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>RTMP地址</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="gpsModel.iconUrl" class="form-control" placeholder="RTMP地址" maxlength="50">
                                        </div>
                                    </div>

                                </div>
                                <div class="box-footer">
                                    <button type="submit" class="btn btn-primary pull-right"><i class="fa fa-save"></i>保存
                                    </button>
                                </div>
                            </form>
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
        <script th:src="@{/js/device/gpsList.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-treeview/bootstrap-treeview.js}"></script>

    </th:block>
</div>
</body>
</html>
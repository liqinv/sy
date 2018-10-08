<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}" xmlns:shiro="http://www.w3.org/1999/xhtml">
<head>
    <title>机构列表</title>
    <th:block layout:fragment="stylelink">
        <link rel="stylesheet" th:href="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.css}">
    </th:block>
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                机构管理
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">系统管理</a></li>
                <li class="active">机构管理</li>
            </ol>
        </section>
        <section class="content" id="organ">
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
                                    <button type="button" class="btn btn-social-icon btn-primary" v-on:click="selectOrganList()">
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
                                                <th class="sorting" rowspan="1" colspan="1">机构名称</th>
                                                <th class="sorting" rowspan="1" colspan="1">机构简称</th>
                                                <th class="sorting" rowspan="1" colspan="1">机构类型</th>
                                                <th class="sorting" rowspan="1" colspan="1">上级机构</th>
                                                <th class="sorting" rowspan="1" colspan="1">创建时间</th>
                                                <th style="width: 200px">操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr class="odd" v-for="r in organData.list">
                                                <td>{{r.name}}</td>
                                                <td>{{r.shortName}}</td>
                                                <td>{{r.typeString}}</td>
                                                <td>{{r.parentName}}</td>
                                                <td>{{r.createTime}}</td>
                                                <td>
                                                    <span shiro:hasPermission="/sys/organ/edit" class="span-a" v-on:click="showEditOrgan(r)">修改</span>
                                                    <span shiro:hasPermission="/sys/organ/delete" class="span-a" v-on:click="deleteConfirm(r)">删除</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <page-div v-bind:pageobj="organData" infowidthclass="col-sm-4" pagewidthclass="col-sm-5" v-on:prepage="prePage" v-on:currpage="currPage" v-on:nextpage="nextPage"></page-div>
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
                            <h4 class="modal-title">新增机构</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="addOrgan()" class="form-horizontal">
                                <div class="box-body">
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>上级机构</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="clickOrgan.name" class="form-control" readonly="readonly">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>机构名称</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="organModel.name" class="form-control" placeholder="机构名称" maxlength="30" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>机构简称</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="organModel.shortName" class="form-control" placeholder="机构简称" maxlength="30" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>机构类型</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <select v-model="organModel.type" class="form-control">
                                                <option v-for="send  in organType" name="sendSymbolId" :value="send.configKey">
                                                    {{send.configValue}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>排序号</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="number" v-model="organModel.sort" class="form-control" placeholder="排序号" required="required" min="1" max="999">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>备注</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <textarea v-model="organModel.note" class="form-control" rows="3" placeholder="备注" maxlength="200"></textarea>
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
                            <h4 class="modal-title">修改机构</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="editOrgan()" class="form-horizontal">
                                <div class="box-body">
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>上级机构</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input v-model="organModel.parentName" class="form-control" readonly="readonly">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>机构名称</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="organModel.name" class="form-control" placeholder="机构名称" maxlength="30" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>机构简称</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <input type="text" v-model="organModel.shortName" class="form-control" placeholder="机构简称" maxlength="30" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>机构类型</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <select v-model="organModel.type" class="form-control">
                                                <option v-for="send  in organType" name="sendSymbolId" :value="send.configKey">
                                                    {{send.configValue}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-3 control-label">
                                            <label>备注</label>
                                        </div>
                                        <div class="col-sm-7">
                                            <textarea v-model="organModel.note" class="form-control" rows="3" placeholder="备注" maxlength="200"></textarea>
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
        <script th:src="@{/js/sys/organList.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-treeview/bootstrap-treeview.js}"></script>

    </th:block>
</div>
</body>
</html>
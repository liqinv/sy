<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>人员分组</title>
    <link rel="stylesheet" th:href="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.css}">
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                人员分组
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">人员分组</a></li>
            </ol>
        </section>
        <section class="content" id="groupList">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box box-purple">
                        <div class="box-header">
                            <button shiro:hasPermission="/group/add" type="button" class="pull-right margin-r-5 btn btn-primary" v-on:click="addUi()"><i class="fa fa-plus"></i> 新增</button>
                            <div class="input-group margin-r-5 pull-right" style="width: 200px;">
                                <input type="text" v-model="searchObj.searchCondition" class="form-control" maxlength="10" placeholder="请输入关键字">
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
                                    <div class="col-sm-12">
                                        <table class="table table-bordered table-hover">
                                            <thead>
                                            <tr>
                                                <th>群组名称</th>
                                                <th>群组人员</th>
                                                <th>备注</th>
                                                <th style="width: 200px">创建人</th>
                                                <th style="width: 200px">创建时间</th>
                                                <th style="width: 120px">操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr class="odd" v-for="r in groupList.list">
                                                <td>{{r.name}}</td>
                                                <td>{{r.selectedUserNames}}</td>
                                                <td>{{r.note}}</td>
                                                <td>{{r.createUserName}}</td>
                                                <td>{{r.createTime}}</td>
                                                <td>
                                                    <span shiro:hasPermission="/group/edit" class="span-a" data-toggle="modal" data-target="#divEditGroup" v-on:click="showEditGroup(r.id)">修改</span>
                                                    <span shiro:hasPermission="/group/delete" class="span-a" v-on:click="deleteGroup(r)">删除</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <page-div v-bind:pageobj="groupList" v-on:prepage="prePage" v-on:currpage="currPage" v-on:nextpage="nextPage"></page-div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!--
            * 模态窗口，默认有三个大小：small,standart,large
            * small：[modal fade bs-example-modal-sm] ; [modal-dialog modal-sm]
            * standart: [modal fade] ; [modal-dialog]
            * large: [modal fade bs-example-modal-lg] ; [modal-dialog modal-lg]
            -->
            <!-- 新增弹框 -->
            <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divAddGroup" style="display: none;">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">新增分组</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="addGroup()">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label>组名</label>
                                        <input type="text" v-model="groupModel.name" class="form-control" placeholder="组名" maxlength="30" required="required">
                                    </div>
                                    <div class="form-group">
                                        <label>人员</label>
                                        <select id="addUserSelect" class="form-control" multiple="multiple" data-placeholder="选择人员" required="required" style="width: 100%;">
                                            <option v-for="user  in userList" :value="user.id">{{user.name}}</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>备注</label>
                                        <textarea v-model="groupModel.note" class="form-control" rows="3" maxlength="200" placeholder="备注"></textarea>
                                    </div>
                                </div>
                                <div class="box-footer">
                                    <button type="submit" class="btn btn-primary pull-right"><i class="fa fa-save"></i> 保存</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 修改弹框 -->
            <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divEditGroup" style="display: none;">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">修改分组</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="editGroup()">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label>组名</label>
                                        <input type="text" v-model="groupModel.name" class="form-control" placeholder="组名" maxlength="30" required="required">
                                    </div>
                                    <div class="form-group">
                                        <label>人员</label>
                                        <select id="editUserSelect" class="form-control" multiple="multiple" data-placeholder="选择人员" required="required" style="width: 100%;">
                                            <option v-for="user  in userList" :value="user.id">{{user.name}}</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>备注</label>
                                        <textarea v-model="groupModel.note" class="form-control" rows="3" maxlength="200" placeholder="备注"></textarea>
                                    </div>
                                </div>
                                <div class="box-footer">
                                    <button type="submit" class="btn btn-primary pull-right"><i class="fa1 fa-save"></i>保存</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div>
    <th:block layout:fragment="javascript">
        <script th:src="@{/js/component/page-component.js}"></script>
        <script th:src="@{/js/group/groupList.js}"></script>
        <script th:src="@{/adminlte/components/select2/js/select2.full.min.js}"></script>

    </th:block>
</div>
</body>
</html>
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>角色列表</title>
    <th:block layout:fragment="stylelink">
        <link rel="stylesheet" th:href="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.css}">
        <link rel="stylesheet" th:href="@{/bootstrap/bootstrap-treeview/bootstrap-treeview.min.css}"/>
    </th:block>
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                角色管理
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">系统管理</a></li>
                <li class="active">角色管理</li>
            </ol>
        </section>
        <section class="content" id="roleApp">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box box-purple">
                        <div class="box-header">
                            <button shiro:hasPermission="/sys/role/addRole" type="button" class="pull-right margin-r-5 btn btn-primary" data-toggle="modal" data-target="#divAddRole" v-on:click="roleModel={};"><i class="fa fa-plus"></i> 新增</button>
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
                                                <th style="width: 200px">角色名</th>
                                                <th>备注</th>
                                                <th style="width: 200px">创建者</th>
                                                <th style="width: 280px">操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr class="odd" v-for="r in roleList.list">
                                                <td>{{r.name}}</td>
                                                <td>{{r.note}}</td>
                                                <td>{{r.createUserName}}</td>
                                                <td>
                                                    <span shiro:hasPermission="/sys/role/editRole" class="span-a" data-toggle="modal" data-target="#divEditRole" v-on:click="showEditRole(r.id)">修改</span>
                                                    <span shiro:hasPermission="/sys/role/deleteRole" class="span-a" v-on:click="deleteConfirm(r)">删除</span>
                                                    <span shiro:hasPermission="/sys/role/permissionRole" class="span-a" data-toggle="modal" data-target="#divRolePermission" v-on:click="selectPermissionList(r)">权限</span>
                                                    <span shiro:hasPermission="/sys/perms/selectPermissionListByRoleId" class="span-a" data-toggle="modal" data-target="#divShowRolePermission" v-on:click="viewPermission(r)">查看权限</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <page-div v-bind:pageobj="roleList" v-on:prepage="prePage" v-on:currpage="currPage" v-on:nextpage="nextPage"></page-div>
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
            <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divAddRole" style="display: none;">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">新增角色</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="addRole()">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label>角色名</label>
                                        <input type="text" v-model="roleModel.name" class="form-control" placeholder="角色名" maxlength="10" required="required">
                                    </div>
                                    <div class="form-group">
                                        <label>备注</label>
                                        <textarea v-model="roleModel.note" class="form-control" rows="3" maxlength="200" placeholder="备注"></textarea>
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
            <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divEditRole" style="display: none;">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">修改角色</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="editRole()">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label>角色名</label>
                                        <input type="text" v-model="roleModel.name" class="form-control" placeholder="角色名" maxlength="10" required="required">
                                    </div>
                                    <div class="form-group">
                                        <label>备注</label>
                                        <textarea v-model="roleModel.note" class="form-control" rows="3" maxlength="200" placeholder="备注"></textarea>
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

            <!-- 权限设置弹框 -->
            <div class="modal fade" id="divRolePermission" data-backdrop="static" style="display: none;">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title"><i class="fa fa-wrench"></i> 设置【{{roleModel.name}}】权限</h4>
                        </div>
                        <div class="modal-body">
                            <table class="table table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th>菜单</th>
                                    <th>模块</th>
                                    <th>功能点</th>
                                </tr>
                                </thead>
                                <tbody v-for="menu in permissionTreeList">
                                    <tr v-for="(md,index) in menu.nodes">
                                        <td v-bind:rowspan="menu.nodes.length" v-if="index==0" style="width: 150px;">
                                            <span v-bind:class="[menu.check?'span-per-s':'span-per','']" v-on:click="setCheck(menu,null,null,1)">{{menu.name}} <i v-if="menu.check" class="fa fa-check-circle"></i></span>
                                        </td>
                                        <td style="width: 150px">
                                            <span v-bind:class="[md.check?'span-per-s':'span-per','']" v-on:click="setCheck(menu,md,null,2)">{{md.name}} <i v-if="md.check" class="fa fa-check-circle"></i></span>
                                        </td>
                                        <td>
                                            <template v-for="ac in md.nodes">
                                                <span v-bind:class="[ac.check?'span-per-s':'span-per','']" v-on:click="setCheck(menu,md,ac,3)">{{ac.name}} <i v-if="ac.check" class="fa fa-check-circle"></i></span>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="permissionRole()"><i class="fa1 fa-save"></i>保存</button>
                        </div>
                    </div>
                </div>
            </div>

            <!--权限查看-->
            <div class="modal fade" id="divShowRolePermission" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">角色【{{roleModel.name}}】拥有的权限</h4>
                        </div>
                        <div class="modal-body">
                            <div id="divRolePermissionTree" v-show="isExistPermission" style="height: 400px;overflow-y :scroll;">
                            </div>
                            <p v-show="!isExistPermission">此角色没有权限</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default pull-right" data-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </div>
    <th:block layout:fragment="javascript">
        <script th:src="@{/bootstrap/bootstrap-treeview/bootstrap-treeview.js}"></script>
        <script th:src="@{/js/component/page-component.js}"></script>
        <script th:src="@{/js/sys/roleList.js}"></script>
    </th:block>
</div>
</body>
</html>
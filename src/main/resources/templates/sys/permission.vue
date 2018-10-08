<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>权限列表</title>
    <th:block layout:fragment="stylelink">
        <link rel="stylesheet" th:href="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.css}">
        <style>
            .fw{
                font-weight: normal;
            }
            .mb{
                margin-bottom: 7px;
            }
        </style>
    </th:block>
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                权限列表
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">系统管理</a></li>
                <li class="active">权限列表</li>
            </ol>
        </section>
        <section class="content" id="permissionApp">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box box-purple">
                        <div class="box-header">
                            <button shiro:hasPermission="/sys/role/addRole" type="button" class="pull-right margin-r-5 btn btn-primary" data-toggle="modal" data-target="#divAddPermission" v-on:click="addRootInit()"><i class="fa fa-plus"></i> 新增菜单</button>
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
                                                <th>菜单</th>
                                                <th>模块</th>
                                                <th>功能点</th>
                                            </tr>
                                            </thead>
                                            <tbody v-for="menu in permissionTreeList">
                                            <tr v-if="menu.childIsMenu" v-for="(md,index) in menu.nodes">
                                                <td v-bind:rowspan="menu.nodes.length" v-if="index==0" style="width: 150px;">
                                                    <span class="span-per2"><i class="fa1 fa-close text-red" v-on:click="deleteConfirm(menu)"></i>{{menu.name}}</span>
                                                    <span data-toggle="modal" data-target="#divAddPermission" v-on:click="addInit(2,menu.id,menu.nodes.length,menu.childIsMenu)"><i class="fa fa-plus"></i></span>
                                                </td>
                                                <td style="width: 300px">
                                                    <span class="span-per2"><i class="fa1 fa-close text-red" v-on:click="deleteConfirm(md)"></i>{{md.name}}</span>
                                                    <span data-toggle="modal" data-target="#divAddPermission" v-on:click="addInit(3,md.id,md.nodes.length,false)"><i class="fa fa-plus"></i></span>
                                                </td>
                                                <td>
                                                    <template v-for="ac in md.nodes">
                                                        <span class="span-per2"><i class="fa1 fa-close text-red" v-on:click="deleteConfirm(ac)"></i>{{ac.name}}</span>
                                                    </template>
                                                </td>
                                            </tr>
                                            <tr v-if="!menu.childIsMenu">
                                                <td style="width: 150px;">
                                                    <span class="span-per2"><i class="fa1 fa-close text-red" v-on:click="deleteConfirm(menu)"></i>{{menu.name}}</span>
                                                    <span data-toggle="modal" data-target="#divAddPermission" v-on:click="addInit(2,menu.id,menu.nodes.length,menu.childIsMenu)"><i class="fa fa-plus"></i></span>
                                                </td>
                                                <td style="width: 300px">
                                                    <template v-for="md in menu.nodes">
                                                        <span class="span-per2"><i class="fa1 fa-close text-red" v-on:click="deleteConfirm(md)"></i>{{md.name}}</span>
                                                    </template>
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
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
            <div class="modal fade" data-backdrop="static" id="divAddPermission" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">新增菜单</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="addPermission()">
                                <div class="box-body">
                                    <div class="form-group col-sm-6">
                                        <label for="name">名称</label>
                                        <input type="text" id="name" v-model="permission.name" class="form-control" placeholder="菜单/功能点名称" maxlength="10" required="required">
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <label for="icon">图标</label>
                                        <input type="text" id="icon" v-model="permission.icon" class="form-control" placeholder="图标样式，参照AdminLTE Icon" maxlength="20">
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <label for="resourceUrl">访问地址</label>
                                        <input type="text" id="resourceUrl" v-model="permission.resourceUrl" class="form-control" placeholder="功能的访问地址" maxlength="100" required="required">
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <label for="permission">权限标识</label>
                                        <input type="text" id="permission" v-model="permission.permission" class="form-control" placeholder="与访问地址保持一致,请勿使用汉字" maxlength="60" required="required">
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <label for="level">层级</label>
                                        <input type="number" id="level" v-model="permission.level" class="form-control" disabled="disabled" placeholder="权限处于树形结构的第几层级" maxlength="1" required="required">
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <label for="sort">排序号</label>
                                        <input type="number" id="sort" v-model="permission.sort" class="form-control" placeholder="用于同级别的权限排序" maxlength="2" required="required">
                                    </div>

                                    <div class="form-group col-sm-6">
                                        <label>类型</label>
                                        <div class="mb">
                                            <label class="fw">
                                                <input type="radio" name="resourceType" value="1" v-model="permission.resourceType" v-bind:disabled="permission.level == 1 || permission.level == 3 || childCount>0">
                                                菜单
                                            </label>
                                            <label class="fw">
                                                <input type="radio" name="resourceType" value="2" v-model="permission.resourceType" v-bind:disabled="permission.level == 1 || permission.level == 3 || childCount>0">
                                                功能点
                                            </label>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-6">
                                        <label>是否是最后一级</label>
                                        <div class="mb">
                                            <label class="fw">
                                                <input type="radio" name="leaf" v-model="permission.leaf" value="1">
                                                是
                                            </label>
                                            <label class="fw">
                                                <input type="radio" name="leaf" v-model="permission.leaf" value="0" checked="checked">
                                                否
                                            </label>
                                            <span class="margin text-red ft-size-10">注：此项只针对菜单有效</span>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-12">
                                        <label for="note">备注</label>
                                        <textarea class="form-control" id="note" rows="3" cols="40" v-model="permission.note" ></textarea>
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
                                        <input type="text" v-model="permission.name" class="form-control" placeholder="角色名" maxlength="10" required="required">
                                    </div>
                                    <div class="form-group">
                                        <label>备注</label>
                                        <textarea v-model="permission.note" class="form-control" rows="3" maxlength="200" placeholder="备注"></textarea>
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
        <script th:src="@{/js/sys/permissionList.js}"></script>
    </th:block>
</div>
</body>
</html>
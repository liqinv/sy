<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>社区列表</title>
    <link rel="stylesheet" th:href="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.css}">
    <link rel="stylesheet" th:href="@{/adminlte/components/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css}">
    <link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />
    <style type="text/css">
        #selectmap {
            width: 100%;
            height: 420px;
            overflow: hidden;
            margin: 0;
            font-family: "微软雅黑";
            position: relative;
        }
    </style>
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                社区管理
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">社区管理</a></li>
            </ol>
        </section>
        <section class="content" id="areaList">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box box-purple">
                        <div class="box-header">
                            <button shiro:hasPermission="/resource/area/add" type="button" class="pull-right margin-r-5 btn btn-primary" v-on:click="saveUi()"><i class="fa fa-plus"></i> 新增</button>

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
                                                <th>名称</th>
                                                <th>联系人</th>
                                                <th>联系电话</th>
                                                <th>备注</th>
                                                <th style="width: 200px">创建时间</th>
                                                <th style="width: 120px">操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr class="odd" v-for="r in areaList.list">
                                                <td>{{r.name}}</td>
                                                <td>{{r.linkMan}}</td>
                                                <td>{{r.linkPhone}}</td>
                                                <td>{{r.note}}</td>
                                                <td>{{r.createTime}}</td>
                                                <td>
                                                    <span shiro:hasPermission="/resource/area/edit" class="span-a" v-on:click="saveUi(r.id)">修改</span>
                                                    <span shiro:hasPermission="/resource/area/delete" class="span-a" v-on:click="deleteArea(r)">删除</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <page-div v-bind:pageobj="areaList" v-on:prepage="prePage" v-on:currpage="currPage" v-on:nextpage="nextPage"></page-div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 保存弹框 -->
            <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divSave" style="display: none;">
                <div class="modal-dialog modal-sm" style="width:850px;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">保存社区</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="save()">
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <div class="form-group">
                                                <label>名称</label>
                                                <input type="text" v-model="areaModel.name" class="form-control" placeholder="名称" maxlength="30" required="required">
                                            </div>
                                            <div class="form-group">
                                                <label>联系人</label>
                                                <input type="text" v-model="areaModel.linkMan" class="form-control" placeholder="联系人" maxlength="10">
                                            </div>
                                            <div class="form-group">
                                                <label>联系电话</label>
                                                <input type="text" v-model="areaModel.linkPhone" class="form-control" placeholder="联系电话" maxlength="20">
                                            </div>
                                            <div class="form-group">
                                                <label>区域颜色</label>
                                                <div class="input-group my-colorpicker2">
                                                    <input type="text" id="ac" v-model="areaModel.areaColor" class="form-control" readonly>
                                                    <div class="input-group-addon">
                                                        <i v-bind:style="{'background-color': areaModel.areaColor}"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label>备注</label>
                                                <textarea v-model="areaModel.note" class="form-control" rows="6" maxlength="200" placeholder="备注"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-sm-7">
                                            <div class="form-group">
                                                <label>区域标识</label>&nbsp;&nbsp;<button type="button" class="btn btn-primary btn-xs" v-on:click="clearArea()"><i class="fa  fa-close"></i> 清空</button>
                                                <div id="selectmap"></div>
                                            </div>

                                        </div>
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

        </section>
    </div>
    <th:block layout:fragment="javascript">
        <script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=EDksscNlh4crvQIrlgHuKOPZ"></script>
        <script type="text/javascript" src="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>

        <script th:src="@{/js/component/page-component.js}"></script>
        <script th:src="@{/js/resource/areaList.js}"></script>
        <script th:src="@{/adminlte/components/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js}"></script>

    </th:block>
</div>
</body>
</html>
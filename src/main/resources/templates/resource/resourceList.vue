<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>资源列表</title>
    <link rel="stylesheet" th:href="@{/bootstrap/datatables.net-bs/dataTables.bootstrap.min.css}">
    <link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />
    <style type="text/css">
        #selectmap {
            width: 100%;
            height: 415px;
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
                资源管理
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">资源管理</a></li>
            </ol>
        </section>
        <section class="content" id="resourceList">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box box-purple">
                        <div class="box-header">
                            <button shiro:hasPermission="/resource/point/add" type="button" class="pull-right margin-r-5 btn btn-primary" v-on:click="saveUi()"><i class="fa fa-plus"></i> 新增</button>

                            <div class="input-group margin-r-5 pull-right" style="width: 200px;">

                                <input type="text" v-model="searchObj.searchCondition" class="form-control" maxlength="10" placeholder="请输入关键字">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-social-icon btn-primary" v-on:click="localList()"><i class="fa fa-search"></i></button>
                                </span>
                            </div>
                            <div class="input-group margin-r-5 pull-right" style="width: 200px;">
                                <select v-model="searchObj.type" class="form-control" v-on:change="localList()">
                                    <option value="">全部类型</option>
                                    <option v-for="type  in typeList" :value="type.configKey">{{type.configValue}}
                                    </option>
                                </select>
                            </div>
                            <div class="input-group margin-r-5 pull-right" style="width: 100px;">
                                <select v-model="searchObj.pointStatus" class="form-control" v-on:change="localList()">
                                    <option value="">全部</option>
                                    <option value="1">已标注</option>
                                    <option value="2">未标注</option>
                                </select>
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
                                                <th>类型</th>
                                                <th>联系人</th>
                                                <th>联系电话</th>
                                                <th>标注状态</th>
                                                <th>地址</th>
                                                <th style="width: 200px">创建时间</th>
                                                <th style="width: 120px">操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr class="odd" v-for="r in resourceList.list">
                                                <td>{{r.name}}</td>
                                                <td>{{r.typeName}}</td>
                                                <td>{{r.linkMan}}</td>
                                                <td>{{r.linkPhone}}</td>
                                                <td v-if="r.pointStatus==1">已标注</td><td v-else>未标注</td>
                                                <td>{{r.address}}</td>
                                                <td>{{r.createTime}}</td>
                                                <td>
                                                    <span shiro:hasPermission="/resource/point/edit" class="span-a" v-on:click="saveUi(r.id)">修改</span>
                                                    <span shiro:hasPermission="/resource/point/delete" class="span-a" v-on:click="deleteResource(r)">删除</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <page-div v-bind:pageobj="resourceList" v-on:prepage="prePage" v-on:currpage="currPage" v-on:nextpage="nextPage"></page-div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 保存弹框 -->
            <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divSave" style="display: none;">
                <div class="modal-dialog modal-sm" style="width:800px;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 class="modal-title">保存资源</h4>
                        </div>
                        <div class="modal-body">
                            <form role="form" v-on:submit.prevent="save()">
                                <div class="box-body">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <div class="form-group">
                                                <label>名称</label>
                                                <input type="text" v-model="resourceModel.name" class="form-control" placeholder="名称" maxlength="30" required="required">
                                            </div>
                                            <div class="form-group">
                                                <label>类型</label>
                                                <select v-model="resourceModel.type" class="form-control" required="required">
                                                    <option v-for="type  in typeList" :value="type.configKey">{{type.configValue}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label>联系人</label>
                                                <input type="text" v-model="resourceModel.linkMan" class="form-control" placeholder="联系人" maxlength="10">
                                            </div>
                                            <div class="form-group">
                                                <label>联系电话</label>
                                                <input type="text" v-model="resourceModel.linkPhone" class="form-control" placeholder="联系电话" maxlength="20">
                                            </div>
                                            <div class="form-group">
                                                <label>地址</label>
                                                <!--<input type="text" v-model="resourceModel.address" class="form-control" placeholder="地址" maxlength="20"><i class="fa fa-bolt"></i>-->
                                                <div class="input-group">
                                                    <input type="text" id="ac" v-model="resourceModel.address" class="form-control" placeholder="地址" maxlength="50">
                                                    <div class="input-group-addon" title="点击标注" style="cursor:pointer;" v-on:click="pointMap()">
                                                        <i class="fa fa-map-marker"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label>备注</label>
                                                <textarea v-model="resourceModel.note" class="form-control" rows="2" maxlength="200" placeholder="备注"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-sm-7">
                                            <div class="form-group">
                                                <label>位置标识</label>&nbsp;&nbsp;<button type="button" class="btn btn-primary btn-xs" v-on:click="clearPoint()"><i class="fa  fa-close"></i> 清空</button>
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
        <script th:src="@{/js/resource/resourceList.js}"></script>

    </th:block>
</div>
</body>
</html>
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>应急指挥</title>
    <link rel="stylesheet" th:href="@{/bootstrap/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css}">
    <link rel="stylesheet" th:href="@{/bootstrap/bootstrap-fileinput/css/fileinput.min.css}">
    <link rel="stylesheet" th:href="@{/bootstrap/bootstrap-fileinput/themes/explorer-fa/theme.min.css}">

    <link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />
    <link rel="stylesheet" th:href="@{/css/main.css}">

</head>
<body>
<div>
    <div layout:fragment="content" id="emergency">
        <div id="allmap"></div>
        <div class="row">
            <div class="col-md-3" style="position:absolute;top:80px;left:70px;">
                <div class="box box-default box-solid">
                    <div class="box-header with-border">

                        <div class="input-group margin-r-5 pull-left" style="width: 200px;">
                            <input type="text" v-model="searchObj.searchCondition" class="form-control" maxlength="10" placeholder="请输入关键字">
                            <span class="input-group-btn">
                                    <button type="button" class="btn btn-social-icon btn-primary" v-on:click="selectEventList()"><i class="fa fa-search"></i></button>
                                </span>
                        </div>
                        <button type="button" class="pull-left margin-r-5 btn btn-primary" v-on:click="saveUi()"><i class="fa fa-plus"></i></button>
                        <div class="box-tools pull-right">
                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="box-body" style="overflow:scroll; max-height:500px;">
                        <div class="box-footer box-comments">
                            <div class="box-comment" v-for="r in eventList" v-on:click="saveUi(r.id)" style="cursor:pointer;" >
                                <!--<span class="username">
                                {{r.statusName}}
                                    <span class="text-muted pull-right"><i class="fa fa-clock-o"></i>{{r.happenTime}}</span>
                                </span>
                                <a href="#" class="name">{{r.name}}</a>
                                <br/>
                                {{r.content}}-->
                                <div class="form-group">
                                    <span>{{r.code}}</span>
                                    <span v-if="r.status == 'BA001'" class="label label-warning pull-right">{{r.statusName}}</span>
                                    <span v-if="r.status == 'BA002' || r.status == 'BA004'" class="label label-success pull-right">{{r.statusName}}</span>
                                    <span v-if="r.status == 'BA003'" class="label label-danger pull-right">{{r.statusName}}</span>
                                    <span v-if="r.status == 'BA005'" class="label label-default pull-right">{{r.statusName}}</span>
                                </div>
                                <div class="">
                                    <a href="#" class="name">{{r.name}}</a>
                                </div>
                                <div class="form-group">
                                    <span>{{r.content}}</span>
                                </div>
                                <div class="">
                                    <span class="text-muted pull-right"><i class="fa fa-clock-o"></i> {{r.happenTime}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 保存弹框 -->
        <div class="modal fade" data-backdrop="static" id="divAddEvent" style="display: none;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">紧急事件</h4>
                    </div>
                    <div class="modal-body">
                        <form role="form" v-on:submit.prevent="saveEvent()">
                            <div class="box-body">
                                <div class="form-group col-sm-12">
                                    <label for="name">名称</label>
                                    <input type="text" id="name" v-model="eventModel.name" class="form-control" maxlength="50" required="required">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>类别</label>
                                    <select v-model="eventModel.category" class="form-control" required="required">
                                        <option v-for="category  in categoryList" :value="category.configKey">{{category.configValue}}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>类型</label>
                                    <select id="addEventSelect" class="form-control" required="required" style="width: 100%;">
                                        <optgroup v-for="one  in typeList" :label="one.configValue">
                                            <option v-for="two  in one.children" :value="two.configKey">{{two.configValue}}</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="reportName">报送人姓名</label>
                                    <input type="text" id="reportName" v-model="eventModel.reportName" class="form-control" maxlength="10" required="required">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="reportPhone">报送人电话</label>
                                    <input type="text" id="reportPhone" v-model="eventModel.reportPhone" class="form-control" maxlength="15" required="required">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="address">地点</label>
                                    <input type="text" id="address" v-model="eventModel.address" class="form-control" maxlength="10" required="required">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="happenTime">发生时间</label>
                                    <div class="input-group date form_datetime" data-date-format="yyyy-mm-dd hh:ii" id="happenTime">
                                        <input class="form-control" type="text" v-model="eventModel.happenTime" required="required" readonly>
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="content">情况描述</label>
                                    <textarea class="form-control" id="content" rows="3" cols="40" v-model="eventModel.content"></textarea>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="note">备注</label>
                                    <textarea class="form-control" id="note" rows="3" cols="40" v-model="eventModel.note"></textarea>
                                </div>
                                <div class="form-group col-sm-12">
                                    <!--<label>文件上传</label>-->
                                    <div class="file-loading">
                                        <input id="event-files" type="file" multiple>
                                    </div>
                                </div>
                            </div>
                            <div class="box-footer">
                                <button v-if="eventModel.id == null || eventModel.status=='BA005'" type="submit" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-save"></i> 保存</button>
                                <button v-on:click="notice('BD001')" v-if="eventModel.id != null && eventModel.status == 'BA005'" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-exclamation-circle"></i> 应急准备</button>
                                <button v-on:click="notice('BD002')" v-if="eventModel.id != null && eventModel.status == 'BA001'" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-close"></i> 应急取消</button>
                                <button v-on:click="notice('BD003')" v-if="eventModel.id != null && eventModel.status == 'BA001'" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-exclamation-triangle"></i> 应急启动</button>
                                <button v-on:click="notice('BD004')" v-if="eventModel.id != null && eventModel.status == 'BA003'" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-close"></i> 应急解除</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- 详情弹框 -->
        <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divDetail" style="display: none;">
            <div class="modal-dialog modal-sm" style="width:850px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">应急指挥</h4>
                    </div>
                    <div class="modal-body">
                        <div class="box-body">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group  col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            名称
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.name}}</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            类别
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.categoryName}}</label>
                                        </div>
                                    </div><br/>
                                    <div class="form-group col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            类型
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.typeName}}</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            报送人姓名
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.reportName}}</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            报送人电话
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.reportPhone}}</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            地点
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.address}}</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            发生时间
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.happenTime}}</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            情况描述
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.content}}</label>
                                        </div>
                                    </div>
                                    <br/>
                                    <div class="form-group col-sm-12">
                                        <div class="col-sm-5 control-label">
                                            备注
                                        </div>
                                        <div class="col-sm-7">
                                            <label>{{eventModel.note}}</label>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-12">
                                        <!--<div class="col-sm-5 control-label">
                                            附件
                                        </div>-->
                                        <div class="file-loading">
                                            <input id="event-files-detail" type="file" multiple>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6" style="overflow:scroll; max-height:500px;">
                                    <ul class="timeline">
                                        <!-- timeline item -->
                                        <li v-for="process in eventModel.processVoList">
                                            <!-- timeline icon -->
                                            <i v-if="process.node == 'BD001'" class="bg-blue fa fa-exclamation"></i>
                                            <i v-if="process.node == 'BD002'" class="bg-blue fa fa-close"></i>
                                            <i v-if="process.node == 'BD003'" class="bg-blue fa fa-exclamation-triangle"></i>
                                            <i v-if="process.node == 'BD004'" class="bg-blue fa fa-close"></i>
                                            <i v-if="process.node == 'BD005'" class="bg-blue fa fa-envelope"></i>
                                            <div class="timeline-item">
                                                <span class="time"><i class="fa fa-clock-o"></i> {{process.createTime}}</span>

                                                <h3 class="timeline-header"><a href="#">{{process.nodeName}}</a></h3>

                                                <div class="timeline-body">
                                                    <template v-if="process.node == 'BD005'">
                                                        续报内容：{{process.note}}
                                                    </template>
                                                    <template v-else>
                                                        短信内容：{{process.sms}}
                                                        <br/><br/>
                                                        <a href="#" class="name">短信通知：{{process.note}}</a>
                                                    </template>
                                                </div>

                                                <div class="timeline-footer">

                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="box-footer">
                            <button v-on:click="notice('BD001')" v-if="eventModel.id != null && eventModel.status == 'BA005'" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-exclamation-circle"></i> 应急准备</button>
                            <button v-on:click="notice('BD002')" v-if="eventModel.id != null && eventModel.status == 'BA001'" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-close"></i> 应急取消</button>
                            <button v-on:click="notice('BD003')" v-if="eventModel.id != null && eventModel.status == 'BA001'" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-exclamation-triangle"></i> 应急启动</button>
                            <button v-on:click="notice('BD004')" v-if="eventModel.id != null && eventModel.status == 'BA003'" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-close"></i> 应急解除</button>
                            <button v-on:click="reportUi()" v-if="eventModel.id != null && (eventModel.status == 'BA001' || eventModel.status == 'BA003')" type="button" class="btn btn-primary pull-right margin-r-5"><i class="fa fa-external-link"></i> 续报</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 应急通知弹框 -->
        <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divNotice" style="display: none;">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">{{noticeModel.name}}通知</h4>
                    </div>
                    <div class="modal-body">
                        <form role="form" v-on:submit.prevent="process()">
                            <div class="box-body">

                                <div class="form-group">
                                    <label>通知群组</label>
                                    <select id="noticeGroupSelect" class="form-control" multiple="multiple" data-placeholder="选择群组" required="required" style="width: 100%;">
                                        <option v-for="group  in groupList" :value="group.id">{{group.name}}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>短信内容</label>
                                    <textarea v-model="processModel.sms" class="form-control" rows="3" maxlength="200" placeholder="短信内容" required="required"></textarea>
                                </div>
                            </div>
                            <div class="box-footer">
                                <button type="submit" class="btn btn-primary pull-right"><i class="fa fa-save"></i> 提交</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- 续报弹框 -->
        <div class="modal fade bs-example-modal-sm" data-backdrop="static" id="divContinue" style="display: none;">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span></button>
                        <h4 class="modal-title">续报</h4>
                    </div>
                    <div class="modal-body">
                        <form role="form" v-on:submit.prevent="report()">
                            <div class="box-body">
                                <div class="form-group">
                                    <label for="address">内容</label>
                                    <textarea v-model="processModel.note" class="form-control" rows="3" maxlength="200" placeholder="续报内容" required="required"></textarea>
                                </div>

                            </div>
                            <div class="box-footer">
                                <button type="submit" class="btn btn-primary pull-right"><i class="fa fa-save"></i> 提交</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!--右侧工具栏-->
        <div class="right-tools">
            <ul>
                <!--<li title="点位"><img v-on:click="mapOnToolsPoint();" src="/adminlte/dist/img/avatar5.png"/></li>
                <li title="开启划多边形"><img v-on:click="mapOnToolsArea();" src="/adminlte/dist/img/avatar5.png"/></li>
                <li title="关闭划多边形"><img v-on:click="clearAll();" src="/adminlte/dist/img/avatar5.png"/></li>
                <li title="关闭划多边形"><img v-on:click="openMqListener();" src="/adminlte/dist/img/avatar5.png"/></li>-->

                <li id="area" title="社区" style="background-color:#3c8dbc;" v-on:click="switchArea('area');"><img th:src="@{/img/resource/sq-1.png}"/></li>
                <li id="AD001" title="党委" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD001');"><img th:src="@{/img/resource/dw-1.png}"/></li>
                <li id="AD002" title="应急物资存放点" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD002');"><img th:src="@{/img/resource/wz-1.png}"/></li>

                <li id="person" title="人员" style="background-color:#4b646f;" v-on:click="switchPerson();"><img th:src="@{/img/resource/ry-1.png}"/></li>

                <li id="AD003" title="危化（加油加气站）" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD003');"><img th:src="@{/img/resource/jyz-1.png}"/></li>
                <li id="AD004" title="重点危化品使用单位" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD004');"><img th:src="@{/img/resource/whpsy-1.png}"/></li>
                <li id="AD005" title="危化品储存单位" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD005');"><img th:src="@{/img/resource/whpcc-1.png}"/></li>
                <li id="AD006" title="人员密集场所" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD006');"><img th:src="@{/img/resource/rymjd-1.png}"/></li>
                <li id="AD007" title="网吧" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD007');"><img th:src="@{/img/resource/wb-1.png}"/></li>
                <li id="AD008" title="电影院" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD008');"><img th:src="@{/img/resource/dyy-1.png}"/></li>
                <li id="AD009" title="酒店" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD009');"><img th:src="@{/img/resource/jd-1.png}"/></li>
                <li id="AD010" title="娱乐场所" style="background-color:#3c8dbc;" v-on:click="switchPoint('AD010');"><img th:src="@{/img/resource/ylcs-1.png}"/></li>
            </ul>
        </div>
    </div>
    <th:block layout:fragment="javascript">
        <script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=EDksscNlh4crvQIrlgHuKOPZ"></script>
        <script type="text/javascript" src="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>
        <script th:src="@{/js/common/point_convertor.js}"></script>
        <script th:src="@{/js/common/map_baidu.js}"></script>
       <script th:src="@{/js/common/toobar.js}"></script>

        <script th:src="@{/js/emergency/main.js}"></script>
        <script th:src="@{/adminlte/components/select2/js/select2.full.min.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-fileinput/js/fileinput.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-fileinput/js/locales/zh.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-fileinput/themes/explorer-fa/theme.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-fileinput/themes/fa/theme.js}"></script>


        <script th:src="@{/js/common/sockjs-0.3.4.js}"></script>
        <script th:src="@{/js/common/stomp.js}"></script>
        <script th:src="@{/js/common/mq.js}"></script>
    </th:block>


</div>
</body>
</html>
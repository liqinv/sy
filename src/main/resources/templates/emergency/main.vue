<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>人员分组</title>
    <link rel="stylesheet" th:href="@{/bootstrap/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css}">
    <style type="text/css">
        #allmap {
            width: 100%;
            height: 685px;
            overflow: hidden;
            margin: 0;
            font-family: "微软雅黑";
            position: relative
        }
    </style>
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
                        <!-- /.box-tools -->
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body" style="overflow:scroll; max-height:300px;">
                        <div class="box-footer box-comments">
                            <div class="box-comment" v-for="r in eventList" v-on:click="saveUi(r.id)">
                              <span class="username">
                                {{r.statusName}}
                                  <span class="text-muted pull-right"><i class="fa fa-clock-o"></i>{{r.happenTime}}</span>
                              </span><!-- /.username -->
                                <a href="#" class="name">{{r.name}}</a>
                                <br/>
                                {{r.content}}
                            </div>
                            <!-- /.box-comment -->
                            <!--<div class="box-comment">
                              <span class="username">
                                Nora Havisham
                                <span class="text-muted pull-right">8:03 PM Today</span>
                              </span>&lt;!&ndash; /.username &ndash;&gt;
                                The point of using Lorem Ipsum is that it has a more-or-less
                                normal distribution of letters, as opposed to using
                                'Content here, content here', making it look like readable English.
                            </div>-->
                            <!-- /.box-comment -->
                        </div>
                    </div>
                    <!-- /.box-body -->
                </div>
                <!-- /.box -->
            </div>
        </div>

        <!-- 新增弹框 -->
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
                                    <input type="text" id="name" v-model="eventModel.name" class="form-control"  maxlength="50" required="required">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>类别</label>
                                    <select v-model="eventModel.category" class="form-control" required="required">
                                        <option v-for="category  in categoryList"  :value="category.configKey">{{category.configValue}}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label>类型</label>
                                    <select id="addEventSelect"  class="form-control"  required="required" style="width: 100%;">
                                        <optgroup v-for="one  in typeList" :label="one.configValue">
                                            <option v-for="two  in one.children" :value="two.configKey">{{two.configValue}}</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="reportName">报送人姓名</label>
                                    <input type="text" id="reportName" v-model="eventModel.reportName" class="form-control"  maxlength="10" required="required">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="reportPhone">报送人电话</label>
                                    <input type="text" id="reportPhone" v-model="eventModel.reportPhone" class="form-control"  maxlength="15" required="required">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="address">地点</label>
                                    <input type="text" id="address" v-model="eventModel.address" class="form-control"  maxlength="10" required="required">
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="happenTime">发生时间</label>
                                    <div class="input-group date form_datetime" data-date-format="yyyy-mm-dd hh:ii" id="happenTime">
                                        <input class="form-control"  type="text" v-model="eventModel.happenTime"  required="required" readonly>
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>
                                        <span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="content">情况描述</label>
                                    <textarea class="form-control" id="content" rows="3" cols="40" v-model="eventModel.content" ></textarea>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label for="note">备注</label>
                                    <textarea class="form-control" id="note" rows="3" cols="40" v-model="eventModel.note" ></textarea>
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
    </div>



    <th:block layout:fragment="javascript">
        <script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=EDksscNlh4crvQIrlgHuKOPZ"></script>
        <script th:src="@{/js/emergency/main.js}"></script>
        <script th:src="@{/adminlte/components/select2/js/select2.full.min.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js}"></script>
        <script th:src="@{/bootstrap/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js}"></script>
        <script>
            $(function () {
                $("#addEventSelect").select2();

                $("#happenTime").datetimepicker({
                    language:  'zh-CN',
                    autoclose: true,
                    todayHighlight: true,
                    minuteStep: 10
                }).on("changeDate", function(e) {
                    console.log(e.date);
                    var selectTime = Utils.dateFormat(e.date);
                    emergency.$data.eventModel.happenTime = selectTime.substring(0,selectTime.length-3)+":00";
                });
            })
        </script>
    </th:block>
</div>
</body>
</html>
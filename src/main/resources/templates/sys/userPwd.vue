<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/web/thymeleaf/layout"
      layout:decorate="~{/layout/layout}"
      xmlns:shiro="http://www.pollix.at/thymeleaf/shiro">
<head>
    <title>密码修改</title>
    <th:block layout:fragment="stylelink">
    </th:block>
</head>
<body>
<div>
    <div layout:fragment="content">
        <section class="content-header">
            <h1>
                密码修改
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> 首页</a></li>
                <li><a href="#">系统管理</a></li>
                <li class="active">密码修改</li>
            </ol>
        </section>
        <section class="content" id="pwdApp">
            <div class="row">
                <div class="col-md-4 col-md-offset-4">
                    <div class="box box-purple">
                        <div class="box-header">

                        </div>
                        <div class="box-body">
                            <form role="form" v-on:submit.prevent="setPwd()">
                                <div class="box-body">
                                    <div class="form-group">
                                        <label for="oldpwd">旧密码</label>
                                        <input type="password" v-model="oldPwd" class="form-control" maxlength="50" id="oldpwd" required="required" >
                                    </div>
                                    <div class="form-group">
                                        <label for="newpwd1">新密码</label>
                                        <input type="password" v-model="newPwd1" class="form-control" maxlength="50" id="newpwd1" required="required">
                                    </div>
                                    <div class="form-group">
                                        <label for="newpwd2">确认新密码</label>
                                        <input type="password" v-model="newPwd2" class="form-control" maxlength="50" id="newpwd2" required="required">
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
        <script th:src="@{/js/sys/pwd.js}"></script>
    </th:block>
</div>
</body>
</html>
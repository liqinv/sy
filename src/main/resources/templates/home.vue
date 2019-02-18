<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
	  xmlns:th="http://www.thymeleaf.org">
<html>
<head>
	<meta charset="UTF-8">
	<title>石羊政府</title>
	<link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<script type="text/javascript" th:src="@{/js/jquery-3.3.1.min.js}"></script>
<script type="text/javascript">
    $(function(){
        var dw = $(document.body).width();
        $(document.body).mousemove(function(){
            var mx = event.x;
            var ox = $("#right").width();
            var ow = dw-ox;
            if(mx > ow && mx<=dw){
                $("#right").show();
            }else{
                $("#right").hide();
            }
        });
    });

</script>
<body class="main-bg">
<div class="left">
	<div class="title">
		<i></i>
	</div>
	<div class="content">
		<div class="panel">
			<div class="panel-item">
				<div class="panel-title">管理</div>
				<div class="panel-info">
					<ul>
						<li><i class="panel-logo"><img src="img/dang_logo.png" /></i><a target="_blank"
																					  href="http://171.221.172.73:8088/">智慧党建平台</a></li>
						<li><i class="panel-logo"><img src="img/dang_logo.png" /></i><a target="_blank"
																					  href="https://182.140.197.53/">全国党员管理信息系统</a></li>
						<li><i class="panel-logo"><img src="img/dang_logo.png" /></i><a target="_blank"
																					  href="http://www.cddyjy.com/">党员E家</a></li>
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					  href="http://171.221.172.73:8078/sy/">应急指挥调度系统</a></li>

						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://10.31.110.40:8080/tgdld/login.jsp">大联动 微治理</a></li>
						<li><i class="panel-logo"><img src="img/cg_logo.png" /></i><a target="_blank"
																					   href="http://10.190.239.84:6888/eGovaMIS/desktop.htm">成都市数字化城市管理信息系统</a></li>
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://125.70.9.164:1003/cmcs/index/login/InitLogin.do">成都市城管信用监管业务平台
						</a></li>
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://10.190.230.60:8093/cmnFrame/mainCmn.do">市委书记信箱系统

						</a></li>
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://10.190.232.83:8000/login">市人民政府网络理政平台
						</a></li>
					</ul>
				</div>
			</div>
			<div class="panel-item">
				<div class="panel-title">服务</div>
				<div class="panel-info">
					<ul>
						<li><i class="panel-logo"><img src="img/gx_logo.png" /></i><a target="_blank"
																						href="http://sy.cdht.gov.cn/syxxgk/index.jhtml/">高新区信息公开</a></li>
						<li><i class="panel-logo"><img src="img/gx_logo.png" /></i><a target="_blank"
																						href="http://www.cdht.gov.cn/admin/cms/login.do">高新区门户集群系统</a></li>
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="https://www.chinaylzl.com/Gover">四川省养老助残信息管理系统</a></li>
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="https://zw.cdfgj.gov.cn/publicCAS/CasAuth/admin">中国残疾人服务平台</a></li>
						<li><i class="panel-logo"><img src="img/cg_logo.png" /></i><a target="_blank"
																					  href="http://cd.scwjxx.cn/">城乡一体计划生育服务管理系统</a></li>
						<li><i class="panel-logo"><img src="img/gs_logo.png" /></i><a target="_blank"
																					  href="http://www.cdgs.gov.cn/gsmh/index.jsp">成都工商信息</a></li>
						<li><i class="panel-logo"><img src="img/dang_logo.png" /></i><a target="_blank"
																						href="http://jcpt.chengdu.gov.cn/cdform/">成都市基层公开综合服务平台</a></li>
					</ul>
				</div>
			</div>
			<div class="panel-item">
				<div class="panel-title">便民</div>
				<div class="panel-info">
					<ul>
						<li><i class="panel-logo"><img src="img/rs_logo.png" /></i><a target="_blank"
																					  href="http://10.163.27.62/cdsb/index.do">社保3版</a></li>
						<li><i class="panel-logo"><img src="img/rs_logo.png" /></i><a target="_blank"
																					   href="http://10.163.34.198/cdsi2/">社保2版</a></li>
						<li><i class="panel-logo"><img src="img/rs_logo.png" /></i><a target="_blank" href="http://10.163.27.179/cdcard/login.jsp">成都市社会保障卡务系统</a></li>
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://sy.chinazhix.cn/sy/login.html">城乡代扣平台</a></li>
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://api.ldbzcd.com:8088/laodongjianguan/admin.php/index/index">企业用工信息自主申报平台</a></li>
					<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://10.163.27.93:8010/sjpt/login.jsp?ret_url=http%3A%2F%2F10.163.27.93%3A8010%2Fsjpt%2FindexAction.do%3Findexstyle%3Dds">省转移接续和协查认证省级平台</a></li>
							<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://10.163.34.248/casserver/login?service=http%3A%2F%2F10.163.34.198%2Fcdsi2%2Findex.do">成都市人力资源和社会保障管理信息系统</a></li>
																					   														   
						<li><i class="panel-logo"><img src="img/sys_logo.png" /></i><a target="_blank"
																					   href="http://si.12333.gov.cn/index.jhtml">异地定点医疗机构查询</a></li>
			
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="right" id="right">
	<div class="logo">
		<img src="img/dangqi.png" />
	</div>
	<div class="menu">
		<ul>
			<li class="actievd">首页</li>
		</ul>
	</div>
</div>
</body>
</html>
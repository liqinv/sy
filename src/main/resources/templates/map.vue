<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org">
<html>
<head>
    <meta charset="UTF-8">
    <title>党委地图</title>
    <style type="text/css">
        body, html,#allmap {width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
    </style>
    <script th:inline="javascript">
        var baseUrl = [[${#httpServletRequest.contextPath}]];
    </script>
</head>

<script type="text/javascript" th:src="@{/js/jquery-3.3.1.min.js}"></script>
<script type="text/javascript" th:src="@{/vue/polyfill.min.js}"></script>
<script type="text/javascript" th:src="@{/vue/axios.min.js}"></script>
<script type="text/javascript" th:src="@{/vue/qs.min.js}"></script>
<script type="text/javascript" th:src="@{/js/config.js}"></script>
<script type="text/javascript" th:src="@{/js/utils.js}"></script>
<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=EDksscNlh4crvQIrlgHuKOPZ"></script>

<body>
<div id="allmap"></div>
</body>
</html>
<script type="text/javascript">
    // 百度地图API功能
    var map = new BMap.Map("allmap"); // 创建Map实例
    map.centerAndZoom(
        new BMap.Point(CONFIG.BAIDU_LOCATION_X, CONFIG.BAIDU_LOCATION_Y), CONFIG.BAIDU_DISPLAY_LEVEL); // 初始化地图,设置中心点坐标和地图级别
    // 添加地图类型控件
    map.addControl(new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
    }));
    map.setCurrentCity("成都"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    var bottom_right_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT
    });// 添加比例尺
    var top_right_navigation = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
    }); // 仅包含平移和缩放按钮
    map.addControl(bottom_right_control);
    map.addControl(top_right_navigation);

    YF_HTTP
        .get("/map/data")
        .then(function (result) {
            var pointList = result.data;
            for (var i = 0; i < pointList.length; i++) {
                var myIcon = new BMap.Icon(baseUrl+"/img/resource/dw.png", new BMap.Size(25, 25));
                myIcon.setImageSize(new BMap.Size(25, 25));

                var point = new BMap.Point(pointList[i].locationX, pointList[i].locationY);
                var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                marker.pointType = pointList[i].type;
                map.addOverlay(marker);// 将标注添加到地图中

                var winContents = "<div class=\"form-group\" style=\"text-align: center;\"><label>" + pointList[i].name + "</label></div>";
                if(pointList[i].linkMan && pointList[i].linkMan != "") {
                    winContents = winContents + "<div class=\"form-group\">联系人：" + pointList[i].linkMan + "</div>";
                    //winContents = winContents + "<div class=\"form-group\"><div class=\"col-sm-3\" >联系人：</div><div class=\"col-sm-9\">" + pointList[i].linkMan + "</div></div>";
                }
                if(pointList[i].linkPhone && pointList[i].linkPhone != "") {
                    winContents = winContents + "<div class=\"form-group\"> 电话：" + pointList[i].linkPhone + "</div>";
                    //winContents = winContents + "<div class=\"form-group\"><div class=\"col-sm-3\" >电话：</div><div class=\"col-sm-9\">" + pointList[i].linkPhone + "</div></div>";
                }
                if(pointList[i].address && pointList[i].address != "") {
                    winContents = winContents + "<div class=\"form-group\"> 地址：" + pointList[i].address + "</div>";
                    //winContents = winContents + "<div class=\"form-group\"><div class=\"col-sm-3\" >地址：</div><div class=\"col-sm-9\">" + pointList[i].address + "</div></div>";
                }
                if(pointList[i].note && pointList[i].note != "") {
                    winContents = winContents + "<div class=\"form-group\"> 备注：" + pointList[i].note + "</div>";
                    //winContents = winContents + "<div class=\"form-group\"><div class=\"col-sm-3\" >备注：</div><div class=\"col-sm-9\">" + pointList[i].note + "</div></div>";
                }
                addClickHandler(winContents, marker);
            }
        });
    function addClickHandler(content, marker) {
        marker.addEventListener("click", function (e) {
            openInfo(content, e)
        });
    };
    function openInfo(content, e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    };
</script>
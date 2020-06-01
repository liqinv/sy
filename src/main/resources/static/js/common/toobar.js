// key: resource \ search \ alarm \ group
var AlarmResManager = new Object();
var areaCode={
		"6512":"新测试机构公安分局"
	};

//资源类型 （统一标识）
var ResourceTypes = {
	TW: 1	/*天网*/
}
//全局变量，默认的图层名称
var layerName = {
	markerLayer: "markerLayer",
	policeLayer : "policeLayer",
	intercomLayer : "intercomLayer",
	policeCarLayer : "policeCarLayer",
	vectorLayer: "vectorLayer",
	editVectorLayer: "editVectorLayer",
	heatLayer: "heatLayer",
	vectorGBLayer:"vectorGBLayer",
	vectorSHDWLayer:"vectorSHDWLayer",
	partMarkerLayer:"partMarkerLayer",//部件
	vectorSJLayer:"vectorSJLayer", // 此处用作 警务站图层
	serPointLayer:"serPointLayer",//便民服务点
	alarmLayer:"alarmLayer",//警情
	gatherLayer:"gatherLayer"//聚合图层
};
// 资源数据
var ResourceDatas = {
		gatherDatas: new Object(), /*存放聚合上图的资源数据*/
		gbGatherDatas: new Object(), /*存放聚合上图的资源数据*/
		chartDatas: new Object(), /*存放目前界面所有上图的资源数据*/
		GPSDatas: new Object(), /*存放其他地方 需要GPS推送上图的资源数据*/
		datas: new Object(), /*地图初始化的各种资源数据*/
		delResDatas: [], /*隐藏的各种资源数据*/
		gpsControl: false, /*MQ推送GPS数据的控制，默认情况关闭*/
		//mqGpsArray: new Object(), /*记录MQ推送过来的gpsId数据*/
		mqGpsArray: [], /*记录MQ推送过来的gpsId数据*/
		initGpsChart: false,/*初始化MQ推送GPS数据的上图控制，默认情况关闭*/
		gpsRedrawFlag: false,/*MQ推送GPS重绘控制，默认情况false*/
		gpsResDatas:new Object(), /*随gps移动的资源数据，如警车、警员*/
		policeControl: false, /*GPS推送时，警员是否上图控制，默认否*/
		intercomControl: false, /*GPS推送时，对讲机是否上图控制，默认否*/
		policeCarControl: false, /*GPS推送时，警车是否上图控制，默认否*/
		alarmDeviceControl: false, /*一键报警设备是否上图,默认否*/
		orgResourceControl: false, /*警务站是否上图,默认否*/
		gbControl: false, /*天网是否上图,默认否*/
		zdryControl: false,		/*重点人员上图控制，默认否*/
		trailPlayBackDatas: new Object(), /*GPS推送时，警车是否上图控制，默认否*/
		dataKey: new Object(), /* 此条件只针对handleType == 1，隐藏与显示 操作入口*/
		GBSelected: new Object(), /*天网是否被选择,格式：{naming: name}*/
		GPSSelected: new Object(), /*gps数据是否被选择,格式：{hight: en}*/
		GBHight:new Object(), /*天网和社会点位高亮对象,格式：{hight: en}*/
		DBinDatas:new Object(), /*单兵图传对象,格式：{pId: en}*/
		DBLoadDatas:new Object(), /*首次加载获取存在的单兵对象,格式：{pId: en}*/
		OpreatePoliceList:[],  /*处置人员列表*/
		OpreateIntercomList:[],/*处置对讲机列表*/
		AlarmDeivces:[],  /*报警设备列表*/
		OpretePoliceFlag:false, //加载处置人员列表开关
		toobarList:{},			/*工具栏所有资源列表*/
		PGroupDatas:{},			/*综合指挥人员分组列表集合*/
		GBGroupDatas:{},		/*综合指挥天网分组列表集合*/
		SHDWGroupDatas:{},		/*综合指挥社会点位分组列表集合*/
		ResNavDatas:{},			/*综合指挥类型工具栏集合*/
		PoliceCaseDatas:{},     /*警员案件对象*/
		alarmControl: false, /*警情是否上图,默认否*/
};
/**
 * 存储资源是否显示，是否上图
 */
var resourceConfig={
	config:new Object()
}

var localOrganName = "";
//搜索结果出来的集合
var searchResourceDatas={
		policeDataArray:[],//存储警员数据的集合
		policeCarDataArray:[],//存储警车数据的集合
		bayonetDataArray:[],//存储卡口数据集合
		gbdataArray:[],//存储天网数据集合
		gbPageArray:[],//天网分页用的集合
		searchChartDatas:[]//存储当前上图的对象集合
};

//存储资源的上图状态
var resourceChartStatus={
		partsControl:false,/*部件上图状态*/
		cameraControl:false,/*天网上图状态*/
		areaControl:false,/*责任网格上图状态*/
		elementControl:false,/*万米单元网格上图状态*/
        shdwControl:false,/*社会点位上图状态*/
        bmfwControl:false/*便民服务点上图状态*/
};
//存储GPS、天网、部件、事件feature上图集合
var resourceFeatureDatas={
	partFeatures : [],
	SJFeatures : [],
	GBFeatures : [],
	policeFeatures:[],
	intercomFeatures:[],
	policeCarFeatures:[],
	alarmFeatures:[],
	serPointFeatures:[],
	vectorLayerFeatures:[]
};

/**
 * 存储GPS上图信息
 */
var mqGpsDatas={
	policeDatas:new Object()
}


var policeTypes=[];//存储警员类型集合
var tempOnLineFresh;//设置警员上线定时器变量
var tempOffLineFresh;//设置警员下线定时器变量
var tempType;//当前选择列表类型（综合指挥人、车、天网、社会点位）

var filterArray=[];//存储过滤集合

//分页查询数据列表
var ListDatas = {};
//临时查询列表，临时查询列表可用于带过滤的查询
var tempListDatas;

var searchObj = null; // 搜索绘制控件对象
var eyeObj = new Object(); // 鹰眼功能全局对象

//var selectFeature;//label点击事件对象
var popup111;

/* 针对天网的全局变量*/
var pageNo=1;//当前页码
var totalNum;//总页数
//坐标点距离换算 成 米的量度
var finalDistance = 100000;

//搜索功能全局数据对象
var searchEntity = new MapEntity();
//针对责任网格设置当前选中责任网格id
var gridCurrenId;

/**
 * 专题部分
 */
var MapToobar = {
		isCluster:true,
		/**
		 * 初始化 资源数据
		 * @param isInitDatas 是否初始化参数
		 * @param orgId 组织机构id
		 * @param callback 回调函数
		 * @param filter 过滤函数，返回false即可过滤掉某一条数据
		 */
		initResourceDatas: function(isInitDatas, orgId, callback,filter){
			if(isInitDatas == null || isInitDatas == false){
				return;
			}
			var types;
			/*if($("#organId").val() == "1"){
				types = [1,7];
			}else{*/
			//types = [1,1.2,4,5.1,5.2,7,100,200];
			types = [4];
			//}
			for (var i = 0; i < types.length; i++){
				MapToobar.resourceRequest(orgId,types[i], null, callback,filter);
			}
		},
		/**
		 * 搜索资源数据(搜索地图基础资源)
		 * @searchValue 搜索内容
		 * @type 资源类型参数(单个类型 或者 类型数组) 格式："Government@Changchun.2" 或者 ["Government@Changchun.2","School@Changchun.2"]
		 * @queryCompleted 查询完成的回调函数
		 * @queryFailed 查询失败的回调函数
		 */
		initSearchValue: function(searchValue, type, queryCompleted, queryFailed){
			if(searchValue == "" && !type) return;
			var params = {
				searchValue: searchValue,
				type: type
			};
			if(!queryCompleted) queryCompleted = MapToobar.queryCommonCompleted;
			var en = new MapEntity();
			en.params = params;
			en.callback = queryCompleted;
			en.failCallback = queryFailed;
			MapManager.queryMapBaseResource(en);
		},
		/**
		 *  绘制控件专题(点搜索、线搜索、多边形搜索等)
		 * @param entitys 需要搜索的对象(数组);
		 * @param layerName 图层名称
		 * @param showType 搜索类型：1，点周边；2，线周边；3，矩形搜索；4，多边形搜索
		 * @param queryResType 搜索的资源类型 1：天网 ；2： 卡口; 3：卡点   注意：11及以上表示需通过地图方式查询地图原始资源
		 * @param radius 搜索半径
		 * @param isSearchMap 是否查询地图原始资源
		 * @param isNowSearch是否直接搜索（只针对 点周边、线周边）
		 * @returns
		 */
		initSearchFeature: function(entitys,layerName, showType,queryResType, radius, isSearchMap, isNowSearch){
			var en = new MapEntity();
			en.layerName = layerName;
			en.type = "searchObj";
			en.radius = (radius ? radius : 2000)/finalDistance,/*缓冲区半径大小*/
			en.lineSegment = 50,/*缓冲区指定点的数量*/
			en.showType = showType;
			en.queryResType = queryResType;
			en.areaType = entitys[0];
			en.targetData = entitys[1];
			en.callback = MapManager.drawSearchCompleted; //搜索完成后的回调函数
			en.isSearchMap = isSearchMap ? isSearchMap : true;
			en.isNowSearch = isNowSearch ? isNowSearch : false;
			MapManager.drawDragMode(en);
			searchEntity = en;
			return searchEntity;
		},
		/**
		 *  几何图形搜索专题
		 *  @param poly 搜索基准点
		 * @param entitys 需要搜索的对象(数组);entitys的第一值表示搜索类型：1，点周边；2，线周边；3，矩形搜索；4，多边形搜索
		 * @param layerName 执行绘制要素的图层
		 * @param queryResType 需查询资源类型(1：天网、2： 卡口、 3：卡点、警员、警车等等，(数组))
		 * @param isSearchMap 是否查询地图原始资源
		 * @param isShowSearchDialog是否展示搜索结果对话框
		 * @returns
		 */
		initPolySearchFeature: function(poly, entitys,layerName, queryResType, isSearchMap, isShowSearchDialog){
			/*保存绘制所用到的属性*/
			var en = new MapEntity();
			en.searchResultGeo = poly;
			en.layerName = layerName;
			en.queryResType = queryResType;
			en.areaType = entitys[0];
			en.targetData = entitys[1];
			en.callback = MapManager.drawSearchCompleted; //搜索完成后的回调函数
			en.isSearchMap = isSearchMap ? isSearchMap : true;
			en.isShowSearchDialog = isShowSearchDialog == false ? isShowSearchDialog : true;
			searchEntity = en;
			MapToobar.queryByGeo(en);
			return searchEntity;
		},


	/**
	 *  绘制控件专题
	 * @param map  地图对象
	 * @param layer 执行绘制要素的图层
	 * @param handler 要素绘制事件处理器，指定当前绘制的要素类型和操作方法
	 * @param options 设置该类及其父类开放的属性
	 * @param isActivate 是否立即生效
	 * @param drawCompleted 绘制完成后的回调方法
	 * @returns
	 */
	initDrawFeature: function(map,layer,handler, options, isActivate, drawCompleted){
		var drawFeature = MapHandler.createDrawFeature(map, layer, isActivate, handler, options);
		drawFeature.events.on({"featureadded": drawCompleted} );
		return drawFeature;
	},
	/**
	 * 描点专题
	 * @param map 地图对象
	 * @param layer 执行绘制要素的图层
	 * @param options 设置该类及其父类开放的属性
	 * @param isActivate 是否立即生效
	 * @param drawPointCompleted 绘制完成后的回调方法
	 * @returns
	 */
	initPointFeature: function(map,layer, options, isActivate, drawPointCompleted){
		if(!map) map = MapManager.getMap();
		if(!layer){
			 layer = MapHandler.getVectorLayerByName("resourceLayer");
		}
		var handler = SuperMap.Handler.Point;
		var drawFeature = MapToobar.initDrawFeature(map,layer,handler, options, isActivate, drawPointCompleted);
		return drawFeature;
	},
	/**
	 *  绘制控件专题(点搜索、线搜索、多边形搜索等)
	 * @param entitys 需要搜索的对象(数组);entitys的第一值表示搜索类型：1，点周边；2，线周边；3，矩形搜索；4，多边形搜索
	 * @param map  地图对象
	 * @param layer 执行绘制要素的图层
	 * @param handler 要素绘制事件处理器，指定当前绘制的要素类型和操作方法
	 * @param queryResType 需查询资源类型(1：天网、2： 卡口、 3：卡点、警员、警车等等，(数组))
	 * @param options 设置该类及其父类开放的属性
	 * @param isActivate 是否立即生效
	 * @param isSearchMap 是否查询地图原始资源
	 * @param isNowSearch是否直接搜索（只针对 点周边、线周边）
	 * @returns
	 */
	initPointSearch: function(point,entitys,queryResourceType,layer,sUrl,distance,lineSegment,handler, queryResType,options, isActivate, isSearchMap, isNowSearch){
		var searchFeature = new Object();
		var searchMLayer = MapHandler.getMarkerLayerByName(layerName.markerLayer);
		if(searchMLayer && searchMLayer[0]) searchMLayer = searchMLayer[0];
		/*保存绘制所用到的属性*/
		searchFeature.attrs = {
				searchEntitys: entitys, /*需要搜索的对象(数组)*/
				searchLayer: layer, /*搜索缓冲区显示的图层*/
				searchMarkerLayer: searchMLayer,
				searchHandler: handler,/*搜索类型*/
				searchUrl: sUrl,/*分析缓冲区的url*/
				searchDistance: (distance ? distance : 2000)/finalDistance,/*缓冲区半径大小*/
				searchLineSegment: lineSegment ? lineSegment : 25,/*缓冲区指定点的数量*/
				searchQueryResType: queryResType, /*需查询资源类型(数组)*/
				markerDispaly: [], /**/
				isSearchMap: isSearchMap ? isSearchMap : true, /*是否查询地图原始资源*/
				flag: true,
				isNowSearch: isNowSearch  ? isSearchMap : false
		};
		searchObj = searchFeature;
		searchObj.attrs.searchSourceGeo = point;
		if(searchObj && searchObj.attrs) {
			searchObj.attrs.searchGeo = point; /* 缓冲区搜索源（要素）*/
			MapManager.bufferAnalystProcess(searchObj.attrs.searchUrl,
					point,
					searchObj.attrs.searchDistance,
					searchObj.attrs.searchLineSegment,
					MapToobar.bufferAnalystCompleted, null);

		}
		return searchFeature;
	},
	/**
	 *  绘制控件专题(点搜索、线搜索、多边形搜索等)
	 *  @param point 搜索基准点
	 * @param entitys 需要搜索的对象(数组);entitys的第一值表示搜索类型：1，点周边；2，线周边；3，矩形搜索；4，多边形搜索
	 * @param map  地图对象
	 * @param layer 执行绘制要素的图层
	 * @param isSearchMap 是否查询地图原始资源
	 * @param callback 完成后的回调函数
	 * @returns
	 */
	initPointSearchFeature: function(point, entitys,layer,sUrl,distance,lineSegment,isSearchMap, callback){
		var searchMLayer = MapHandler.getMarkerLayerByName(layerName.markerLayer);
		if(searchMLayer && searchMLayer[0]) searchMLayer = searchMLayer[0];
		/*保存绘制所用到的属性*/
		var searchFeature = new Object();
		searchFeature.attrs = {
				searchEntitys: entitys, /*需要搜索的对象(数组)*/
				searchLayer: layer, /*搜索缓冲区显示的图层*/
				searchMarkerLayer: searchMLayer,
				searchHandler: MapConstant.Point,/*搜索类型*/
				searchUrl: sUrl,/*分析缓冲区的url*/
				searchDistance: (distance ? distance : 2000) / finalDistance,/*缓冲区半径大小*/
				searchLineSegment: lineSegment ? lineSegment : 25,/*缓冲区指定点的数量*/
				isSearchMap: isSearchMap ? isSearchMap : true, /*是否查询地图原始资源*/
				flag: true,
				isNowSearch: isNowSearch == false  ? false : true
		};
		searchObj = searchFeature;
		searchObj.attrs.searchSourceGeo = point;
		if(searchObj && searchObj.attrs) {
			searchObj.attrs.searchGeo = point; /* 缓冲区搜索源（要素）*/
			MapManager.bufferAnalystProcess(searchObj.attrs.searchUrl,
					point,
					searchObj.attrs.searchDistance,
					searchObj.attrs.searchLineSegment,
					callback,
					null);
		}

		return searchFeature;
	},


	/**
	 * 收藏列表专题 （总入口）
	 */
	initGroupManager: function(){
		openGroupInfoWin();
	},
	/**
	 * 地图改变的监听事件
	 */
	mapChangeListener: function(){
		//天网
		//MapToobar.initLocalResourceChart(2, ResourceTypes.TW);
		//console.log("当前地图层级:",MapManager.getMap().getZoom());
	},
	/**
	 * 天网上图
	 * @param handleType 操作类型 handleType = 1，表示隐藏与显示； 2，表示滚动、拖动地图操作
	 * @param type 类型
	 */
	initLocalResourceChart: function(handleType,type){

		if(!handleType) handleType = 1;
		if(!type) type = 1;
		var gbType = type; //天网类型
		if(type == 1 || type == "1")
			gbType = 1.1;//天网类型

		var resDatas = ResourceDatas.datas;
		var resSatus = null; // 资源显示状态
		if(resDatas[type]){
			resSatus = resDatas[type]["status"];
			if(handleType == 1) //控制资源的显示与隐藏
				ResourceDatas.datas[type]["status"] = !ResourceDatas.datas[type]["status"];
		}
		if((MapVesion != "SuperMap" && (((type == 507 || type == 508) && MapManager.getZoom() < 8)
				|| (type != 507 && type != 508 && MapManager.getZoom() < 12)))
				|| (MapVesion != "SuperMap" && MapManager.getZoom() < 8)){
			//清除vector上图
			MapToobar.clearVectorLayer(layerName.vectorGBLayer);
			//计算上图资源的个数
			if(type == 1){
				try{
					countResChart(gbType);
				}catch(e){}
			}
			return;
		}
		// 上图
		if((resSatus == false && handleType == 1) || (resSatus == true && handleType == 2)){
			//组合字符串，用于比较 搜索条件是否与上一次一致，如果一致则不再请求服务
			var dataKey = type +"-"+MapManager.getZoom()+ "-"+JSON.stringify({points: MapManager.getBounds()});
			if(handleType == 1 && ResourceDatas.dataKey[type] == dataKey){// 此条件只针对handleType == 1，隐藏与显示 操作入口
				var gatherDatas = new Object();
				//更新全局变量中的聚合数据
				if(ResourceDatas.gatherDatas && ResourceDatas.gatherDatas[type]){
					gatherDatas = ResourceDatas.gatherDatas[type];
				}else{
					return;
				}
				if(MapManager.getZoom() < mapGatherMinZoom){ //mapGatherMinZoom最小聚合层数，配置文件设置
					//清除vector上图
					MapToobar.clearVectorLayer(layerName.vectorGBLayer);
					resourceFeatureDatas.GBFeatures.length =0;
					return;
				}
				MapToobar.gatherResourceChart(gbType, gatherDatas);
				return;
			}else{
				ResourceDatas.dataKey[type] = dataKey;
			}
			//获取地图当前可视区范围 转换为四个顶点
			var boundsPointArray = MapManager.getBounds();
			// 可视区范围 格式有误则跳出
			if(!boundsPointArray || boundsPointArray.length < 4)
				return;
			// 组装请求参数
			var param = {
					userId: $("#userId").val(), // 当前操作人Id
					zoom: MapManager.getZoom(), //当前操作地图的层数
					bounds: JSON.stringify({points: boundsPointArray}), //操作地图的可视范围
					type: type,//资源类型 （备用）
					random: Math.random()
				};
			var rurl = basePath+MapResourceUrl.requestGatherResource;
			$.ajax({
				url:  rurl,
				type: "post",
				dataType: "json",
				data: param,
				success: function(res){
					if(res.code == 200){
						var curStatus = MapToobar.chartTbStatusByType(type);// 资源显示状态
						if(MapManager.getZoom() < mapGatherMinZoom){ //mapGatherMinZoom最小聚合层数，配置文件设置
							//清除vector上图
							MapToobar.clearVectorLayer(layerName.vectorGBLayer);
							resourceFeatureDatas.GBFeatures.length =0;
							return;
						}
						if(curStatus == null || curStatus == undefined) {
							curStatus = ResourceDatas.datas[type]["status"];
						}
						ResourceDatas.gbGatherDatas[type] = res.data["dataMap"];
						if(curStatus == true){
							if(type == 1)
								MapToobar.gatherResourceChart(1.1, res.data["baseList"]);
							else
								MapToobar.gatherResourceChart(type, res.data["baseList"]);
						}
					}
				},
				error: function(res){
				}
			});
		}else{
			//清除vector上图
			MapToobar.clearVectorLayer(layerName.vectorGBLayer);
			resourceFeatureDatas.GBFeatures.length =0;
			//计算上图资源的个数
			if(type == 1){
				try{
					countResChart(gbType);
				}catch(e){}
			}
		}
	},

	/**
	 * 资源上图
	 * @param type 1：天网、2： 卡口、 3：卡点、4：警员:5：警车、6：巡区:、7：社区、8：辖区等等
	 * @param resDatas 格式为：[type,datas,status]
	 * @param layer
	 */
	initResourceChart: function(type, resDatas){
		//天网上图方式(聚合)
		/*if(type == 1){
			MapToobar.initLocalResourceChart(1, type);
			return;
		}*/
		/*如果不是警务联动和一键报警模块，人员不上图*/
		/*if(type==4 && !$("#alarmSwitch").val()){
			return;
		}*/
		/*如果不是警务联动和一键报警模块，gps不上图*/
		if(type==4.6 && !$("#alarmSwitch").val()){
			return;
		}
		/*如果不是警务联动和一键报警模块，车辆不上图*/
		if(type==5 && !$("#alarmSwitch").val()){
			return;
		}
		/*在系统管理员账号机构管理板块，机构不上图*/
		if(type==5.1 && $("#mechanismInp").val()){
			return;
		}
		/*在系统管理员账号机构管理板块，机构不上图*/
		if(type==1 && $("#videoInp").val()){
			return;
		}
		/*在地图资源管理板块，不上图*/
		if(type==200 && $("#resourceMapInp").val()){
			return;
		}
		/**针对城管、暂时不用聚合方式*/
		if(!resDatas) {
			resDatas = ResourceDatas.datas;
		}
		var resSatus=null;
		var resData = null; // 当前类型资源数据 对象
		/**resDatas  */
		if(resDatas[type]){
			resData = resDatas[type]["data"];
			if(resSatus == null || resSatus == undefined) {
				resSatus = resDatas[type]["status"];
			}else{
				resSatus = !resSatus;
			}
			ResourceDatas.datas[type]["status"] = !ResourceDatas.datas[type]["status"];
		}else if(resSatus != null && resSatus != undefined) {
			resSatus = !resSatus;
		}
		if(type == 200||type == 7) resSatus = false;
		var isEx = false;
		if(!resSatus){//隐藏对应类型的资源数据
			if(type == 100){
				resourceChartStatus.elementControl=false;
				MapManager.cancelSatelliteMap();
				// map.removeLayer(miliLineLayer);
				miliLayer=undefined;
				miliLineLayer=undefined;
			}
			if(type == 4) ResourceDatas.policeControl = false;
			else if(type == 5) ResourceDatas.policeCarControl = false;
			else if(type == 4.6) ResourceDatas.intercomControl = false;
			var den = new MapEntity();
			den.type = type;

			if(type < 6) {
				 //删除原图marker
				 if(ResourceDatas.GPSSelected["hight"]){
					 var en = ResourceDatas.GPSSelected["hight"];
					 if(en.type == type){
						 if(type == 5.2) {
							 en.iconUrl=MapHandler.getImgUrl(5.23);
						 }
						 ResourceDatas.GPSSelected["hight"] = null;
					 }
				 }
				if(type == 1 || type == 1.2){
					if(type == 1){
						den.layerName = layerName.vectorGBLayer;
						resourceFeatureDatas.GBFeatures.length =0;
					}else{
						den.layerName = layerName.vectorSHDWLayer;
					}
				}else if(type == 4){
					den.layerName = layerName.policeLayer;
					resourceFeatureDatas.policeFeatures.length =0;
					ResourceDatas.mqGpsArray.length = 0;
				}else if(type == 4.6){
					den.layerName = layerName.intercomLayer;
					resourceFeatureDatas.intercomFeatures.length =0;
					ResourceDatas.mqGpsArray.length = 0;
				}else if(type == 5){
					den.layerName = layerName.policeCarLayer;
					resourceFeatureDatas.policeCarFeatures.length =0;
					ResourceDatas.mqGpsArray.length = 0;
				}else if(type == 5.2){//一键报警设备
					//MapToobar.clearVectorLayer(layerName.partMarkerLayer);
					den.layerName = layerName.partMarkerLayer;
					ResourceDatas.alarmDeviceControl = false;
					resourceFeatureDatas.partFeatures.length = 0;
				}else if(type == 5.1){//警务站
					//MapToobar.clearVectorLayer(layerName.vectorSJLayer);
					den.layerName = layerName.vectorSJLayer;
					ResourceDatas.orgResourceControl = false;
					resourceFeatureDatas.SJFeatures.length = 0;
				}
				MapToobar.clearVectorLayer(den.layerName);
			}else{
				den.layerName = layerName.vectorLayer;
				MapManager.clearOverlayByType(den);
				//删除图层标签
				var denTitle = new MapEntity();
				denTitle.type = "title"+type;
				denTitle.layerName = layerName.vectorLayer;
				MapManager.clearOverlayByType(denTitle);
			}
		}else{
			if(type == 100){//万米单元网格上图
				resourceChartStatus.elementControl=true;
				var opacity=MapManager.getLayerOpacity() *1;
				MapManager.setSatelliteMap({code:0,url:MapManager.getMiliUrl(),type:1,opacity:opacity})
				//var path=$("#organPath").val();
				//var milidatas=resDatas[100].data;
				//if(!milidatas){
				//	return;
				//}
				//for(var j in milidatas){
				//	if(milidatas[j].detailInfo.organPath==path){
				//		var chartCode=milidatas[j].detailInfo.chartCode;
				//		var lineCode=chartCode*1+1;
				//		var layersIDS=[chartCode,lineCode];
				//		for(var j=0;j<layersIDS.length;j++){
				//			var opacity;
				//			MapManager.chartMiliMeterByCodeAndUrl(layersIDS[j],MapManager.getMiliUrl(),1,opacity)
				//		}
				//		break;
				//	}
				//}
			}
			if(type == 200){//清除后重新上图,地图级别变化时会重新上图
				MapManager.clearOverlayByType({type:200,layerName:layerName.serPointLayer});
			}
			MapToobar.doResourceChart(resData, layerName.vectorLayer);
			if(type ==1 && resourceFeatureDatas.GBFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.GBFeatures,layerName.vectorGBLayer);

			}else if(type == 4 && resourceFeatureDatas.policeFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.policeFeatures,layerName.policeLayer);

			 }else if(type == 4.6 && resourceFeatureDatas.intercomFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.intercomFeatures,layerName.intercomLayer);

			}else if(type == 5 && resourceFeatureDatas.policeCarFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.policeCarFeatures,layerName.policeCarLayer);
			}else if(type == 5.2 && resourceFeatureDatas.partFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.partFeatures,layerName.partMarkerLayer);
			}else if(type == 110 && resourceFeatureDatas.alarmFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.alarmFeatures,layerName.alarmLayer);
			}else if(type == 5.1 && resourceFeatureDatas.SJFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.SJFeatures,layerName.vectorSJLayer);
			}
			if(type == 4) ResourceDatas.policeControl = true;
			else if(type == 4.6) ResourceDatas.intercomControl = true;
			else if(type == 5) ResourceDatas.policeCarControl = true;
			else if(type == 5.2) ResourceDatas.alarmDeviceControl = true;
			else if(type == 110) ResourceDatas.alarmControl = true;
			else if(type == 5.1) ResourceDatas.orgResourceControl = true;
 		}
	},
	/**
	 * 资源上图
	 * @param type 1：天网、2： 卡口、 3：卡点、4：警员:5：警车、6：巡区:、7：社区、8：辖区等等
	 * @param resDatas 格式为：[type,datas,status]
	 * @param layer
	 */
	initMyResourceChart: function(type, flag){
		var resDatas = null;
		/**针对城管、暂时不用聚合方式*/
		if(!resDatas) {
			resDatas = ResourceDatas.datas;
		}
		var resData = null; // 当前类型资源数据 对象
		/**resDatas  */
		if(resDatas[type]){
			resData = resDatas[type]["data"];
		}else{
			resData = resDatas['5.2']?resDatas['5.2']["data"]:[];
//          resData = resDatas['5.2']["data"];
		}
		if(flag == undefined || flag == false){//隐藏对应类型的资源数据
			var den = new MapEntity();
			den.type = type;
			if(type < 5.2) {
				 //删除原图marker
				MapToobar.clearVectorLayer(den.layerName);
			}else{
				den.layerName = layerName.vectorLayer;
				//删除图层标签
				var denTitle = new MapEntity();
				denTitle.type = "title"+type;
				denTitle.layerName = layerName.vectorLayer;
				if((type+"").indexOf("200.") != -1){
					den.layerName = layerName.serPointLayer;
					denTitle.layerName = layerName.serPointLayer;
				}else if((type+"").indexOf("5.2") != -1){
                    den.layerName = layerName.partMarkerLayer;
                    denTitle.layerName = layerName.partMarkerLayer;
				}
				MapManager.clearOverlayByType(den);
				//删除图层标签
				MapManager.clearOverlayByType(denTitle);
			}
		}else{
			if(type == 200){//清除后重新上图,地图级别变化时会重新上图
				MapManager.clearOverlayByType({type:200,layerName:layerName.serPointLayer});
			}
			var deviceData = [];
			$.each(resData,function (index,item) {
				// if(item.type+""+item.detailInfo.deviceTypeId ==""+type){
				// 	deviceData.push(item);
				// }
				if(item.type == type){
					deviceData.push(item);
				}
            })
			MapToobar.doResourceChart(deviceData, layerName.vectorLayer);
 		}
	},
	/**
    * 接收gps推送过来的下线状态
    * @param ob ===> gpsOffLine 下线唯一标识
    */
    pushGpsOffline:function(gpsId){
        var pId;
        //1、清除地图图标
        var resdatas=ResourceDatas.gpsResDatas;
        for(var j in resdatas){
            if(!resdatas[j] && resdatas[j] instanceof Function){return;};
            var enty=resdatas[j][gpsId];
            if(enty){
                pId = enty.id;
                if(enty.type == 4){
                    enty.layerName = layerName.policeLayer;
                }else if(enty.type == 5){
                    enty.layerName = layerName.policeCarLayer;
                }
                MapToobar.clearVectorMarkersByIdType(enty);
                break;
            }
        }
        //2、改变地图数据longitude,latitude 为 ""
        if(pId){
            var pmdata = ResourceDatas.datas[4].data;
            pmdata[pId].longitude = "";
            pmdata[pId].latitude = "";
        }
        //3、改变数量和列表
        /*if(typeof(refreshOffLineNum) == "function"){
            refreshOffLineNum(gpsId);
        }*/
    },
    /**
	 * 获取当前地图层级的节点数
     * @param zoom
     * @returns {*}
     */
	getCurrentNode:function(zoom){
		//860:1-5,861:6-10,862:11-14
		var node1 = MapManager.getGatherLevel().split(",");
		for(var i=0;i<node1.length;i++){
			var node2 =  node1[i].split(":");
			if(MapToobar.isRange(zoom,node2[1])){
				return node2[0];
			}
		}
	},
    /**
	 * 判断地图层级是否在这个区间
     * @param zoom 13
     * @param range 11-14
     * @returns {boolean}
     */
	isRange:function(zoom,range){
		var result = range.split("-");
		if(zoom >= parseInt(result[0]) && zoom <= parseInt(result[1])){
			return true;
		}else{
			return false;
		}
	},
	moveChanged:function(){
		if(enableEvent){
			if(MapVesion=="openLayers"){
				if(MapManager.getZoom() > 5){
					console.log("当前层数:"+MapManager.getZoom());
					$(".ty-more-right-now").each(function(){
						if($(this).attr("value").indexOf("200.") != -1){
							setTimeout("MapToobar.initMyResourceChart('"+$(this).attr("value")+"', false)", 100);
							setTimeout("MapToobar.initMyResourceChart('"+$(this).attr("value")+"', true)", 200);
						}
					});
				}
			}else {
				if(MapManager.getZoom() > 5){
					console.log("当前层数:"+MapManager.getZoom());
					$(".ty-more-right-now").each(function(){
						if($(this).attr("value").indexOf("200.") != -1){
							setTimeout("MapToobar.initMyResourceChart('"+$(this).attr("value")+"', false)", 100);
							setTimeout("MapToobar.initMyResourceChart('"+$(this).attr("value")+"', true)", 200);
						}
					});
				}
			}
		}
	},
	zooChanged:function(){

		if(enableEvent){

			//MapToobar.initResourceChart(200);
			if(MapVesion=="baidu"||MapVesion=="openLayers"){
				var zoomChangeNode = MapToobar.getCurrentNode(MapManager.getZoom());
				var orgId = $('#organId').val();
				if(MapToobar.isLastTwoZoom(MapManager.getZoom())){
					currentNode = zoomChangeNode;
					MapManager.clearOverlays({layerName:layerName.gatherLayer});
					$(".ty-more-right-now").each(function(){
						setTimeout("MapToobar.requestGatherInitResource('"+$(this).attr("id")+"', "+orgId+","+$(this).hasClass("ty-more-right-now")+")",100);
					});
				}else{
					if(zoomChangeNode!=currentNode){
						MapManager.clearOverlays({layerName:layerName.gatherLayer});
						currentNode = zoomChangeNode;
						$(".ty-more-right-now").each(function(){
							setTimeout("MapToobar.requestGatherInitResource('"+$(this).attr("id")+"', "+orgId+","+$(this).hasClass("ty-more-right-now")+")",100);
						});
					}
				}
			}else if(MapVesion=="SuperMap"){
				var zoomChangeNode = MapToobar.getCurrentNode(MapManager.getZoom());
				var orgId = $('#organId').val();
				if(MapToobar.isLastTwoZoom(MapManager.getZoom())){
					MapManager.clearOverlays({layerName:layerName.gatherLayer});
					$(".ty-more-right-now").each(function(){
						setTimeout("MapToobar.requestGatherInitResource('"+$(this).attr("id")+"', "+orgId+","+$(this).hasClass("ty-more-right-now")+")",100);
					});
				}else{
					if(zoomChangeNode!=currentNode){
						MapManager.clearOverlays({layerName:layerName.gatherLayer});
						currentNode = zoomChangeNode;
						console.log(currentNode);
						$(".ty-more-right-now").each(function(){
							setTimeout("MapToobar.requestGatherInitResource('"+$(this).attr("id")+"', "+orgId+","+$(this).hasClass("ty-more-right-now")+")",100);
						});
					}
				}
			}
		}
	},
    /**
	 * 聚合上图
	 * id,选中的类id
	 * orgId 机构id 忽略
	 * flag 标记符
     */
	requestGatherInitResource:function(clickId,orgId,flag){
		var zoom =  MapManager.getZoom();
		var result = clickId.split("_");
		var locations = MapManager.getBounds();
		var param = {
			"orgId": $('#organId').val(),
			"zoom": zoom,
			"type": result[1]+"."+result[2],
			"id": result[3],
			"locations":locations
		};
		var type = parseFloat(param.type+param.id+"");
        if(!flag){
        	//最后两层
        	if(!MapToobar.isLastTwoZoom(MapManager.getZoom())){
                var en = {
                    layerName:layerName.gatherLayer,
                    type:parseFloat(type+param.id+"")
                }
                MapManager.clearOverlayByType(en);
			}else {
                var en = {
                    layerName:layerName.gatherLayer,
                    type:type
                }
                MapManager.clearOverlayByType(en);
			}

        }else{
            MapToobar.dragGatherPoint(param,clickId);
		}
	},
	dragGatherPoint:function(param,clickId){
        $.ajax({
            url:basePath + "web/gather/requestGatherResources.do",
            type:"post",
            dataType:"json",
            data:{
                parameter:JSON.stringify(param)
            },
            success:function(msg){
                if(msg.totalRows==MapManager.getZoom()){
                    MapToobar.gatherInitResourceChart(msg.data,parseFloat(param.type+param.id+""),
                        parseFloat(parseFloat(param.type+param.id+"")+param.id+""),clickId);
                }
            }
        });
	},
	configEndNode:function(){
		var gatherLevel = MapManager.getGatherLevel();
        return parseInt(gatherLevel.substr(gatherLevel.lastIndexOf("-")+1,gatherLevel.length))
	},
	isLastTwoZoom:function(zoom){
		if(MapVesion=="baidu"&&(zoom>MapToobar.configEndNode()||!MapToobar.isCluster)){
			return true;
		}else if(MapVesion =="openLayers"&&(zoom>MapToobar.configEndNode()||!MapToobar.isCluster)){
			return true;
		}else if(MapVesion=="SuperMap"&&(zoom>MapToobar.configEndNode()||!MapToobar.isCluster)){
			return true;
		}
		return false;
	},
	gatherInitResourceChart:function(data,type,clusterType,clickId){
        if(data){
        	var features= [], feaObj = null;
            $.each(data, function (index, v) {
            	//最后两层上图
				if (data[0].hasOwnProperty("hasVideo")){
                    MapToobar.isCluster = false;
                    var en = {
                        longitude: v.longitude,
                        id: v.id,
                        type: type,
                        latitude: v.latitude,
                        isWork: false,
                        layerName: layerName.gatherLayer,
                        titleStyle:{
                            fontColor : "black",
                            fontSize : "18px",
                            offset:'center',
                            fontWeight:'bold'
                        },
                        showType:"Feature",
                    };
                    if(!v.hasVideo){
                        en.iconUrl =  basePath+"images/res/deviceNo.png";
					}else{
                        en.iconUrl =  basePath+"images/res/device.png";
					}
                    en.action="click";
                    en.detailInfo = {
                        address:v.address,
                        flag:v.hasVideo,
                        hasVideo:v.hasVideo,
                        name:v.name,
                        number:v.number,
                        latitude: v.latitude,
                        longitude: v.longitude,
                        id: v.id,
                    };
                    en.content = buildTitleInfo(en);
                    en.callback = MapToobar.openInfoWindow;
				}else{
                    MapToobar.isCluster = true;
                    var en = {
                        longitude: v.longitude,
                        id: v.CODE,
						orgId:v.id,
                        clickId:clickId,
                        type: clusterType,
                        latitude: v.latitude,
                        isWork: false,
                        layerName: layerName.gatherLayer,
                        titleStyle:{
                            fontColor : "white",
                            fontSize : "18px",
                            offset:'center',
                            fontWeight:'bold'
                        },
                        showType:"Feature",
						width:76,
						height:76
                    };
                    if(v.num){
                        en.name =v.num+"";
                        en.isTitle=true;
                    }
                    en.action="click";
                    en.callback = MapToobar.clickNextNode;
					//en.iconUrl = en.iconUrl ? en.iconUrl : MapHandler.getImgUrl(clusterType);
                    var zoomChangeNode = MapToobar.getCurrentNode(MapManager.getZoom());
                    currentNode = zoomChangeNode;
                    console.log("当前节点：",currentNode);
                    if(currentNode==1){
                    	en.iconUrl= MapHandler.getImgUrl(5.2101);
                    }else if(currentNode==860){
                    	en.iconUrl= MapHandler.getImgUrl(5.2202);
                    }else if(currentNode==861){
                    	en.iconUrl= MapHandler.getImgUrl(5.2303);
                    }else if(currentNode==862){
                    	en.iconUrl= MapHandler.getImgUrl(5.2505);
                    }else{
                    	//默认的图标
                    	en.iconUrl= MapHandler.getImgUrl(5.211);
                    }
				}
				feaObj = MapManager.doResourceChart(en);
                if(feaObj != null){
                	features.push(feaObj);
                }
            })
			MapHandler.createAllFeature(features,layerName.gatherLayer)

        }
        enableEvent = true;
	},
	/**
	 * 资源上图（地图基础资源）
	 * @type 资源类型参数(单个类型 或者 类型数组) 格式："Government@Changchun.2" 或者 ["Government@Changchun.2","School@Changchun.2"]
	 * 		注意：当type 为 单个类型时，可进行该类型资源的 显示与隐藏 功能切换
	 * @param handleType 操作类型 handleType = 1，表示隐藏与显示； 2，表示滚动、拖动地图操作
	 */
	initBaseResourceChart: function(type, handleType){
		if(!type) return;
		if(!handleType) handleType = 1;
		var resDatas = ResourceDatas.datas;
		var params = null;
		if(type instanceof Array) {
			for(var j = 0; j < type.length; j++){
				if(!type[j]) continue;
				params.push({name: type[j], attributeFilter: "SmID > 0"});

				var isExt = false; //是否存在
				for(var i in resDatas){
					if(resDatas[i] instanceof Function){
						continue;
					}
					if(i == type[j]){
						isExt = true;
						ResourceDatas.datas[i]["status"] = true;
						break;
					}
				}
				var typeDatas = {
						type: type[j],
						status: true,
						data: null
				};
				if(isExt == false){
					ResourceDatas.datas[type[j]] = typeDatas;
				}
				//清理之前的显示数据
				MapManager.clearResourceChartByType({type: type[j]});
			}
			var en = new MapEntity();
			en.params = params;
			en.callback = MapToobar.queryCommonCompleted;
			MapManager.queryMapBaseResource(en);
		}else{
			params = {type: type, imgUrl: ""};
			var resSatus = false; // 资源显示状态
			if(resDatas[type]) {
				resSatus = resDatas[type]["status"];
				if(handleType == 1) resDatas[type]["status"] = !resDatas[type]["status"];
			}else{
				resDatas[type] = {
						type: type,
						status: true,
						data: null
				};
			}

			if(handleType == 2 && resSatus == false){
				return;
			}

			//清理之前的显示数据
			MapManager.clearResourceChartByType({type: type});

			//显示
			if((resSatus == false && handleType == 1) || (resSatus == true && handleType == 2)){
				var en = new MapEntity();
				en.type = type;
				en.params = params;
				en.showType = 6;
				en.pointDatas = MapManager.getBounds();
				en.callback = MapHandler.mapResQueryCompleted;
				MapManager.queryMapBaseResource(en);
			}
		}
	},


	/**********************二级方法 分割线************************/

	/**
	 * (警情处理页面加载时，加载所有资源数据,然后将资源
	 * 放在全局变量ResourceDatas.datas和ResourceDatas.gpsResDatas)
	 * @param orgId 组织机构id
	 * @param type 资源类型，1：天网、2： 卡口、 3：卡点、4：警员:5：警车、5.1:警务站、5.2:一键报警、6：巡区:、7：社区、8：辖区等等
	 * @param data 参数
	 * @param callback 回调函数
	 * @param filter 过滤函数，返回false即可过滤掉某一条数据
	 */
	resourceRequest: function(orgId, type, data,callback,filter){
		if(!orgId) orgId  = $.trim($("#organId").val());
		if(data == null){
			data = {
				organId :  orgId,
				organPath : $.trim($("#organPath").val()),
				random: Math.random()
			};
		}
		var basePath = "";
		var u = '';
		if(type == 1){
			u += MapResourceUrl.getGBDevices;
			data.organCode = orgCode;
			data.sourceType = 1;
		}else if(type == 4){
			u += MapResourceUrl.getPolices;
			data.organId = orgId;
		}else if(type == 4.6){
			u += MapResourceUrl.getIntercom;
			data.organCode = orgCode;
			if(!data.isSubOrg) data.isSubOrg = 2;
		}else if(type == 5){
			u += MapResourceUrl.getPoliceCars;
			data.organCode = orgCode;
			if(!data.isSubOrg) data.isSubOrg = 2;
		}else if(type == 5.1){
			u += MapResourceUrl.getOrgResource;
			data.organCode = orgCode;
		}else if(type == 5.2){
			u += MapResourceUrl.getAlarmDevice;
			data.organCode = orgCode;
		}else if(type == 7){
			u += MapResourceUrl.getAreaInfo;
			data.areaBelongType = null;
			if(!data.organIds) data.organIds = orgId;
			if(!data.areaType) data.areaType = type - 5;
			if(!data.organOrNext) data.organOrNext = 2;
			data.isQueryPolice =false;
		}else if(type == 1.2){//社会点位接入
			u += MapResourceUrl.getOtherGBDevices;
			data.organCode = orgCode;
			data.sourceType = 2;
		}else if(type == 100){//万米单元网格
			u += MapResourceUrl.getOrganMilis;
		}else if(type == 200){//便民服务点
			u += MapResourceUrl.getSerPoints;
			data.resourceTypeId = null;
		}else if(type == 110){//报警警情
			u += MapResourceUrl.getAlarmAll;
			data = {};
		}
		YF_HTTP.post(u, data).then(function(res) {
            //console.log("res:"+type,res);
            if(!res.data&&type!=100){
                return;
            }
            if(type == 5.2){ResourceDatas.AlarmDeivces = res.data;}
            //封装处置人员数据源
            if(type == 4){
                ResourceDatas.OpreatePoliceList = MapToobar.OperatePoliceRept(res.data);
            }
            //组建工具栏数据源
            ResourceDatas.toobarList[type] = res.data;
            var resStatus = true;
            // 删除数据集中的旧数据
            var rdatas = ResourceDatas.datas[type];
            if(rdatas){
                resStatus = rdatas["status"];
                ResourceDatas.datas[type]["data"] = null;
            }

            // 删除GPS数据集中的旧数据
            var gdatas = ResourceDatas.gpsResDatas[type];
            if(gdatas){
                ResourceDatas.gpsResDatas[type] = null;
            }
            if((res.data && res.data.length > 0) || type==100){
                var enDatas = new Object();
                var enGpsDatas = new Object();
                var reData = null;
                /***去掉重复的人员车量数据。重新组装res.data******/
                MapToobar.getNoRepeatDatas(res.data,type);

                /**
                 *  遍历数据源	res.data
                 */
                for(var i = 0; i < res.data.length; i++){
                    reData = res.data[i];
                    var obj = reData;
                    /**
                     * 组建entity对象
                     */
                    var entity = new MapEntity();
                    entity.type = type;
                    entity.id = obj.gpsId;
                    entity.name = obj.gpsName;
                    entity.latitude = type < 4 ? obj.latitude :  "";
                    entity.longitude = type < 4 ? obj.longitude : "";
                    entity.detailInfo = obj;
                    if (type == 7 || type == 200){
                        if(!enDatas[entity.type]){
                            enDatas[entity.type] = {};
                        }
                        enDatas[entity.type][entity.id] = entity;
                    }else{
                        enDatas[entity.id] = entity;
                    }

                    if(type == 4 || type == 5 ||type == 4.6){
                        entity.isOnLine = reData.isOnLine;
                        if(entity.detailInfo && entity.detailInfo.gpsId){
                            enGpsDatas[entity.detailInfo.gpsId] = entity;
                        }
                        obj.isOnLine = reData.isOnLine;
                    }
                    //首次加载获取单兵信息
                    if(type == 4 ){
                        if(entity.detailInfo.naming){
                            ResourceDatas.DBLoadDatas[entity.id] = entity;
                        }
                        entity.iconUrl = baseUrl + obj.iconUrl;
                        entity.iconUrlHigh = baseUrl + obj.iconUrlHigh;
                    }
                }
                /***** 组装数据到 ResourceDatas*****/
                // 参数介绍：type为资源类型；entitys为对应具体数据；
                var typeDatas = null;
                if (type == 7 || type == 200){
                    for(var n in enDatas){
                        if(typeof enDatas[n] == "function"){
                            continue;
                        }
                        typeDatas = {
                                type: n,
                                status: resStatus,
                                data: enDatas[n]
                        };
                        ResourceDatas.datas[n] = typeDatas;
                    }
                }else{

                    typeDatas = {
                            type: type,
                            status: resStatus,
                            data: enDatas
                    };
                    if (type == 110){
                        typeDatas = {
                            type: type,
                            status: true,
                            data: enDatas
                        };
                    }
                    ResourceDatas.datas[type] = typeDatas;
                    if(type == 4 || type == 5 || type == 4.6){
                        ResourceDatas.gpsResDatas[type] = enGpsDatas;
                    }
                }
            }
            //执行回调=-===针对城管。执行完最后一个资源时调用回调函数
            if (callback != undefined && typeof(callback) == "function")
            {
                if(type == 110){
                    var alarmSwitch = $("#alarmSwitch").val();
                    if(alarmSwitch == true || alarmSwitch == "true"){
                        callback(type);
                    }else{
                        return;
                    }
                }else{

                    callback(type);
                }
            }
        });
	},
	/**
	 * 上图操作
	 * @param resData
	 * @param layer
	 */
	doResourceChart: function(resData, layer){
		for(var j in resData){
			if(!(resData[j] instanceof MapEntity)) continue;
			var entity = resData[j];
			if(entity.type < 6 || (entity.type+"").indexOf(200+".") != -1){ // type小于6，表示只是关于点的上图
				if(!entity.latitude || !entity.longitude) continue;
				//注册事件
    			entity.action = "click";
    			entity.callback = MapToobar.openInfoWindow;
    			if(entity.type == 4 || entity.type == 5 || entity.type == 4.6){
    				if(entity.type == 4){
    					//验证人员类型是否勾选
    					var checkFlag = false;
    					var typeId = entity.detailInfo.typeId;
    					entity.layerName = layerName.policeLayer;
    				}else if (entity.type == 4.6){
    					//验证人员类型是否勾选
    					var checkFlag = false;
    					var typeId = entity.detailInfo.typeId;
    					entity.layerName = layerName.intercomLayer;
    				}else{
    					entity.layerName = layerName.policeCarLayer;
    				}
    				var titleName = entity.des ? entity.name+"("+entity.des+")" : entity.name;
    				 entity.isTitle = true;
    				 entity.titleStyle = {
    						 name: titleName
    				 }
    				 entity.targetObj = null;
    				 //根据人员类型获取图片
    				 if(entity.type == 4){
    					if(entity.iconUrl && entity.iconUrl != "0.0"){
    						if(entity.iconUrl.indexOf("http")== -1){
                                //entity.iconUrl = basePath + "uploadFile" + entity.iconUrl;
							}
			  			}else{
			  				entity.iconUrl = MapHandler.getImgUrl(4.01);
			  			}
    				 }
    				 //根据人员类型获取图片
    				 if(entity.type == 4.6){
    					if(entity.iconUrl && entity.iconUrl != "0.0"){
    						if(entity.iconUrl.indexOf("http")== -1){
                                entity.iconUrl = basePath + "uploadFile" + entity.iconUrl;
							}
			  			}else{
			  				entity.iconUrl = MapHandler.getImgUrl(4.01);
			  			}
    				 }
    			}else{
    				if(entity.detailInfo.typeUrl && entity.detailInfo.typeUrl != ""){
    					var imgUrl = basePath + "uploadFile"+entity.detailInfo.typeUrl;
        				entity.iconUrl = imgUrl;
    				}
    				entity.layerName = layerName.serPointLayer;
    				if(entity.type == 1){//社会点位特殊处理和天网
    					var flag = entity.detailInfo.detailInfo.isShare;//是否是重点标识
    					if(flag){
    						entity.iconUrl = MapHandler.getImgUrl(1.12);
    					}
    					//20170725 nishaodong 从头map.js中移除type=1的业务代码
    					entity.layerName = layerName.vectorGBLayer;
    				}
    				if(entity.type >5.2&&entity.type<5.3){
    					entity.layerName = layerName.partMarkerLayer;
    					// entity.type = parseFloat(entity.type+""+entity.detailInfo.deviceTypeId);
    				}else if(entity.type == 5.1){
    					entity.layerName = layerName.vectorSJLayer;
    					if(entity.detailInfo.iconUrl && entity.detailInfo.iconUrl != "0.0"){
    						entity.iconUrl = basePath + "uploadFile" + entity.detailInfo.iconUrl;
			  			}else{
			  				entity.iconUrl = MapHandler.getImgUrl(5.1);
			  			}
    				}
    				//旅游景点类型的资源按照层级不通展示
    				if((entity.type+"").indexOf("200.") != -1 && MapManager.getZoom()>=showMarkerLabel){
	    				var titleName = entity.des ? entity.name+"("+entity.des+")" : entity.name;
	    				entity.isTitle = true;
	    				entity.titleStyle = {
	    					name: titleName
	    				}
    				}else{
    					entity.isTitle = false;
    				}
    				if(entity.layerName == layerName.serPointLayer){
                        entity.isWork=false;
					}
    				if((entity.type+"").indexOf("200.") != -1){
    					//2017-07-10，添加了这个值，在百度地图上，消息框显示不完全
//    					entity.width = 25;
//        				entity.height = 26;
    				}
    			}
    			//上图
				MapManager.doResourceChart(entity);
			}else{
				entity.layerName = layerName.vectorLayer;
				var name = entity.name;
				var displayProperty = entity.detailInfo.displayProperty;
				var mapProperty = entity.detailInfo.mapProperty;
				if(mapProperty == null) continue;
				// 组装圈层各个顶点
			    var points=[], createfeatures =[];
			    for(var i= 0,len=mapProperty.length; i<len;i++){
			        points.push([mapProperty[i].x,mapProperty[i].y]);
			    }
			    entity.pointDatas = points;
			    // 组装圈层样式
			    var mystyle = new Object();
				if(displayProperty.borderColor !=  ""){
					mystyle.color = mystyle. strokeColor = displayProperty.borderColor;
				}
				if(displayProperty.borderThickness !=  ""){
					mystyle.strokeWidth = mystyle. strokeWeight = displayProperty.borderThickness;
				}
				if(displayProperty.borderOpacity != null){
					mystyle. strokeOpacity = displayProperty.borderOpacity;
				}
				if(gridCurrenId){
					if(gridCurrenId == entity.id){
						if(displayProperty.fillColor != ""){
							mystyle.fillcolor = mystyle. fillColor = displayProperty.fillColor;
						}
						if(displayProperty.fillOpacity != null){
							mystyle.opacity = mystyle. fillOpacity = displayProperty.fillOpacity;
						}
					}else{
						var color="gray";
						mystyle.fillcolor = mystyle. fillColor = color;
						mystyle.opacity = mystyle. fillOpacity = 0.5;
					}
				}else{
					if(displayProperty.fillColor != ""){
						mystyle.fillcolor = mystyle. fillColor = displayProperty.fillColor;
					}
					if(displayProperty.fillOpacity != null){
						mystyle.opacity = mystyle. fillOpacity = displayProperty.fillOpacity;
					}
				}
				//mystyle.strokeWidth = 3;
				mystyle.pointRadius = 6;
				entity.style = mystyle;
				//注册事件

				//entity.action = "click";
    			//entity.callback = MapToobar.openInfoWindow;
                entity.isWork=false;
				// 生成圈层
//				MapManager.clearOverlayByIdType(entity);
				if(gridCurrenId && gridCurrenId == entity.id){
					polygon_final= MapManager.createPolygon(entity);
				}else{
					MapManager.createPolygon(entity);
				}
			    //生成圈层名称
			    var enTitle = new MapEntity(entity);
			    enTitle.style = {};
			    enTitle.id = entity.id;
			    enTitle.type = "title"+entity.type;
			    enTitle.layerName = layerName.vectorLayer;
                enTitle.isWork=false;
			    enTitle.name = entity.name;
			    enTitle.longitude = displayProperty.x;
			    enTitle.latitude = displayProperty.y;
			    enTitle.style.fontSize = displayProperty.fontSize;
			    enTitle.style.fontColor = displayProperty.fontColor;
//			    MapManager.clearOverlayByIdType(enTitle);
			    MapManager.createTitle(enTitle);
			}
		}
		//serPointLayer 图层批量上图
		if(resourceFeatureDatas.serPointFeatures.length > 0){
			MapHandler.createAllFeature(resourceFeatureDatas.serPointFeatures,layerName.serPointLayer);
			resourceFeatureDatas.serPointFeatures.length=0;
		}
		//批量上图
		if(resourceFeatureDatas.vectorLayerFeatures.length > 0){
			MapHandler.createAllFeature(resourceFeatureDatas.vectorLayerFeatures,layerName.vectorLayer);
			resourceFeatureDatas.vectorLayerFeatures.length=0;
		}
	},
	clickNextNode:function(en){
        var result = en.clickId.split("_");
        var locations = MapManager.getBounds();
        var nextNodeStartZoom = MapToobar.getNextNodeStartZoom();
        var param = {
            "orgId": en.orgId,
            "zoom": nextNodeStartZoom,
            "type": result[1]+"."+result[2],
            "id": result[3],
            "locations":locations
        };
        enableEvent = false;
        MapManager.setCenter({longitude:en.longitude,latitude:en.latitude,zoom:nextNodeStartZoom});
        console.log(enableEvent);
        MapManager.clearOverlays({layerName:layerName.gatherLayer});
        MapToobar.dragGatherPoint(param,en.clickId);


	},
    getNextNodeStartZoom:function(){
        var currentZoom = MapManager.getZoom();
        var arr = gatherLevel.split(",");
        var index = 0;
        for(var i=0;i<arr.length;i++){
            var b = arr[i].split(":")[1].split("-");
            if(currentZoom>=parseInt(b[0])&&currentZoom<=parseInt(b[1])){
                index=i;
            }
        }
        if(arr[index+1]){
            return parseInt(arr[index+1].split(":")[1].split("-")[0]);
        }else{
            return parseInt(arr[index].split(":")[1].split("-")[1])+1;
        }
    },
	/**
	 * 打开信息框
	 */
	openInfoWindow: function(en){
		//console.info(en);
		if(en.type == 5.1){
			getDutyPolicesByCode(en.detailInfo.code,function(data){
				en.dutyInfo = data;
				//20170601 nishaodong 从超图中剥离出来的业务方法
//				en.content = MapHandler.buildTitleInfo(en);
				en.content = buildTitleInfo(en);
				MapManager.openInfoWindow(en);
			});
		}else{
			//20170601 nishaodong 从超图中剥离出来的业务方法
//			en.content = MapHandler.buildTitleInfo(en);
			if(en.type==4||en.type==5||en.type==4.6){
				en.widht=null;
				en.height=null;
			}
			en.content = buildTitleInfo(en);
			MapManager.openInfoWindow(en);
			setTimeout(function(){
				if(en.type==4||en.type==5||en.type==4.6){
                    // $("#dateOnMap"+en.id).kendoDatePicker({
						// change: ListManager.onDpDayOnMap,
						// value: new Date(),
						// max:new Date(),
                    //     format: "yyyy-M-d h:m:s"
                    // });
                    //初始化轨迹查询时间
                    $(".cg-ri-area-w-t").datetimepicker({
                        format: "Y-m-d H:i:00",
                        autoclose: true,
                        todayBtn: true,
                        pickerPosition: "bottom-left",
                        lang:'ch'
                    });

                    var date = new Date();
                    date.setTime(date.getTime());
                    $("#startDay2").val(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" 09:00:00");
                    $("#endDay2").val(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" 20:00:00");
				}
				if(en.type==110){
					if(en.gbDevices==""||en.gbDevices==null){
						$("#videoPlaybackBtn").hide();
					}
				}
			},150);


		}
	},
	 /**
	  * 根据图形查询数据（地图提供）
	  * @param geo 查询区图形
	  * @param params
	  * @param type 参数类型，0：需查询
	  */
	 queryByGeo: function(en){
		 en.existsDatas = [];
		 //if(searchObj.attrs.searchMarkerLayer) searchObj.attrs.searchMarkerLayer.clearMarkers();
		 $("#searchResultDialog").data("kendoWindow").close();

		 if(searchEntity.isShowSearchDialog != false){//搜索窗口是否显示
			 //此处只是将搜索框结构展示出来，还没有加载数据
			 MapToobar.openSearchResult();
		 }

	 	//清空资源数据
		searchResourceDatas.policeDataArray.length=0;
		searchResourceDatas.policeCarDataArray.length=0;
		searchResourceDatas.gbdataArray.length=0;
		searchResourceDatas.gbPageArray.length=0;
		searchResourceDatas.bayonetDataArray.length=0;

		 /*异步执行*/
		 setTimeout(function () {
　　　　　　var targetData = en.targetData;
			 if(!targetData){
				 return;
			 }
			 for(var i in targetData){
				 if(targetData[i] instanceof Function) continue;
				 var entitys = targetData[i]["data"];
				 MapToobar.queryCenterdatas(en, entitys);//组装点位数据，存入数据库
				 if(searchEntity.isShowSearchDialog != false){
					 MapToobar.buildResDatas(i);//将数据添加到搜索框中
				 }
			 }
			 if(searchEntity.isShowSearchDialog == false){
				 try{
					 buildGroupAreaResDatas(searchEntity.entityId);
				 }catch(e){}
			 }
　　　　}, 300);
	 },
	 /**
	  * 初始化加载
	  */
	 buildGbHtml:function(pageNum){
		 var num;
		 var str="";
		 var pagestr="";
		 var pagenn=pageNum*3;
		 var pageArray=searchResourceDatas.gbPageArray;

		 if(pageArray.length < pagenn){
			 num=pageArray.length;
		 }else{
			 num= pagenn;
		 }
		 $("#gbList").empty();

		 var param = {};
		param.type = 1;
		param.pageSize = 3;
		param.pageNo = pageNum;
		var listaa= MapToobar.getGbInfoForPage(param);
		var total = MapToobar.getGbListTotal(param.type);

		var pg = paginationMini(pageNum,total,"MapToobar.buildGbHtml",3,"fdsalkfjdsk");
		if(listaa.length > 0){
			 for(var i=0;i<listaa.length;i++){
				 str+="<tr height='25px'><td style='display:none;'>"+listaa[i].detailInfo.naming+"</td><td style='padding:5px;padding-left:10px;'>"+listaa[i].name+"</td><tr>"
			 }
			 $("#gbList").append(str);
			 pagestr+="<tr><td><div id='page'>"+pg+"</div></td></tr>";
			 str+="</tbody><tbody id='pagehtml'>"+pagestr+"</tbody>";
		}
		var gBDeviceHtml="<tr><td>"
			+"<div style='width:300px;'><input id='gbname' class='fl ty-jqcz-search' placeholder='点位名称搜索' style='width:87px;margin-left:10px;margin-top:0px;'/><input type='button' class='bml-search-btn' onclick='MapToobar.searchbyname();' style='margin: -2px 0 0 3px;'>"
			+"</div></td></tr>"
			+"<tr><td><table style='table-layout:fixed;width:100%;'><tbody id='gbList'>"
			/* 拼凑数据*/
			+str
			+"</table></td></tr>";
		$("#gBDeviceHtml").html(str + gBDeviceHtml);
		 //return str;
	 },
	 /**
	  * 通过名称模糊查询
	  */
	 searchbyname:function(){
		 var gbname=$.trim($("#gbname").val());

		//清空上图
		 for ( var i = 0; i < searchResourceDatas.gbPageArray.length; i++) {
			 var data=searchResourceDatas.gbPageArray[i];
			 MapManager.clearResourceChartByIdType(data);
		 }


		 if(gbname ==""){
			$("#gBDeviceHtml").html("");
			searchResourceDatas.gbPageArray=searchResourceDatas.gbdataArray;
			MapToobar.buildGbHtml(1);
		 }else{
			 var gbarray=new Array();
			for(var i=0;i<searchResourceDatas.gbdataArray.length;i++){
				if(searchResourceDatas.gbdataArray[i].name.indexOf(gbname)>-1){
					gbarray.push(searchResourceDatas.gbdataArray[i]);
				}
			}
			$("#gBDeviceHtml").html("");
			searchResourceDatas.gbPageArray=gbarray;
			MapToobar.buildGbHtml(1);
		 }
		 //资源上图
		 for ( var i = 0; i < searchResourceDatas.gbPageArray.length; i++) {
			 var en = searchResourceDatas.gbPageArray[i];
			 en.action = "click";
			 en.callback = MapToobar.openInfoWindow;
			 MapManager.doResourceChart(en);
		 }

		 $("#gbname").val(gbname);
	 },
	 /**
	  * 组装警员数据
	  */
	 buildPoliceData:function(){
		 	policeHtml="";
			/* 组装警员数据*/
			for (var i = 0; i < searchResourceDatas.policeDataArray.length; i++) {
				 var data=searchResourceDatas.policeDataArray[i];
				policeHtml += "<tr height='25px'><td width='210px;' style='padding-left:10px;'>"+data.name+"</td><td align='center'>"+data.detailInfo.organName+"</td><tr>";
			}
			return policeHtml;
	 },
	 /**
	  * 组装警车数据
	  */
	 buildPoliceCarData:function(){
		 policeCarHtml="";
			/* 组装警员数据*/
			for (var i = 0; i < searchResourceDatas.policeCarDataArray.length; i++) {
				 var data=searchResourceDatas.policeCarDataArray[i];
				policeCarHtml += "<tr height='25px'><td width='210px;' style='padding-left:10px;'>"+data.name+"</td><td align='center'>"+data.detailInfo.organName+"</td><tr>";
			}
			return policeCarHtml;
	 },
	 /**
	  * 通过过滤条件和名称来更新警员、警车数据
	  */
	 searchPoliceByCondition:function(filterArray,type){
		 if(filterArray=='bayonet'){
			 filterArray=[];
		 }
		 searchResourceDatas.searchChartDatas.length=0;
		 var searchname=$.trim($("#"+type+"Name").val());

		 $("#"+type+"List").empty();
		 var datas;
		 if(type=='police'){
			 datas=searchResourceDatas.policeDataArray;
		 }else if(type=='policeCar'){
			 datas=searchResourceDatas.policeCarDataArray;
		 }else if(type=='bayonet'){
			 datas=searchResourceDatas.bayonetDataArray;
		 }
		//清空上图
		 for ( var i = 0; i < datas.length; i++) {
			 var data=datas[i];
			 MapManager.clearResourceChartByIdType(data);
		 }

		 /**
		  * 这里处理的是名称搜索和类型搜索
		  */
		 if(searchname =="" && filterArray.length==0){
			 for(var i=0;i<datas.length;i++){
				 if(type=='bayonet'){
					 $("#"+type+"List").append("<tr height='25px'><td style='padding:5px;padding-left:10px;'>"+datas[i].name+"</td>"
					 +"</tr>");
				 }else{
					 $("#"+type+"List").append("<tr height='25px'><td width='210px;' style='padding-left:10px;'>"+datas[i].name+"</td>"
					 +"<td align='center'>"+datas[i].detailInfo.organName+"</td><tr>");
				 }
				 searchResourceDatas.searchChartDatas.push(datas[i]);
			}
		 }else if(searchname =="" && filterArray.length>0){
			 for( var j = 0; j < filterArray.length; j++) {
				 for(var i=0;i<datas.length;i++){
					 /* 处理警员类型过滤*/
					 if(datas[i].detailInfo.typeName.indexOf(filterArray[j])>-1){
							$("#"+type+"List").append("<tr height='25px'><td width='210px;' style='padding-left:10px;'>"+datas[i].name+"</td>"
							+"<td align='center'>"+datas[i].detailInfo.organName+"</td><tr>");
							searchResourceDatas.searchChartDatas.push(datas[i]);
					 }
				}
			 }
		 }else if(searchname !="" && filterArray.length>0){
			 for( var j = 0; j < filterArray.length; j++){
				 for(var i=0;i<datas.length;i++){
					if(datas[i].detailInfo.typeName.indexOf(filterArray[j])>-1 &&
							datas[i].name.indexOf(searchname)>-1){
						$("#"+type+"List").append("<tr height='25px'><td width='210px;' style='padding-left:10px;'>"+datas[i].name+"</td>"
						+"<td align='center'>"+datas[i].detailInfo.organName+"</td><tr>");
						searchResourceDatas.searchChartDatas.push(datas[i]);
					}
				}
			 }
		 }else if(searchname !="" && filterArray.length==0){
			 for(var i=0;i<datas.length;i++){
				if(datas[i].name.indexOf(searchname)>-1){
					if(type=='bayonet'){
						$("#"+type+"List").append("<tr height='25px'><td style='padding:5px;padding-left:10px;'>"+datas[i].name+"</td>"
						+"</tr>");
					}else{
						$("#"+type+"List").append("<tr height='25px'><td width='210px;' style='padding-left:10px;'>"+datas[i].name+"</td>"
						+"<td align='center'>"+datas[i].detailInfo.organName+"</td></tr>");
					}
					searchResourceDatas.searchChartDatas.push(datas[i]);
				}
			}
		 }
		 //资源上图
		 for ( var i = 0; i < searchResourceDatas.searchChartDatas.length; i++) {
			 var en = searchResourceDatas.searchChartDatas[i];
			 en.action = "click";
			 en.callback = MapToobar.openInfoWindow;
			 MapManager.doResourceChart(en);
		}
		$("#"+type+"Name").val(searchname);
	 },
	 /**
	  * 点击过滤界面的确定按钮
	  */
	 filterOk:function(type){
		 filterArray=[];

		 $("input[name = filterName]:checked").each(function(index,obj){
			 filterArray.push($(this).attr("value"));
		 });
		 $("#conditionClear").css("display","none");
		 MapToobar.searchPoliceByCondition(filterArray,type);
	 },
	 /**
	  * 点击过滤界面的取消按钮
	  */
	 filterCancel:function(){
		 //$(".filter-block1").css("display","none");
		 $("#conditionClear").css("display","none");
	 },
	 /**
	  * 绑定资源搜索数据
	  */
	 buildResDatas: function(type, searchValue){
		 //existsData格式
		 //existsData[type,data,flag]

		 //existsDatas格式
		 //existsDatas[existsData];
		 var existsDatas = searchEntity.existsDatas;
			//var existsDataDistances = searchObj.attrs.existsDataDistances;
			var cardPointHtml = "",cardPointNum = 0,cardPointMarkers = [],
			bayonetHtml = "",bayonetNum = 0,
			gBDeviceHtml = "",gBDeviceNum = 0,
			otherHtml = "",otherNum = 0,
			policeHtml = "",policeNum = 0,
			policeCarHtml = "", policeCarNum = 0;

			for(var i = 0 ; i < existsDatas.length; i ++){
				/*var distance = "--";
				if(existsDataDistances && existsDataDistances.length > i){
					distance = existsDataDistances[i] ? existsDataDistances[i].toFixed(4) : "--";
				}*/
				//existsData[0] 代表type
				//existsData[1] 代表所有data资源集合
				var existsData = existsDatas[i];
				if(!searchValue && searchValue != "" && type != existsData[0]){
					continue;
				}

				var datas = existsData[1];
				if(!datas) continue;
				for(var j = 0 ; j < datas.length; j++){
					var data = datas[j];
					if((searchValue && data.name && data.name.indexOf(searchValue) > -1) || !searchValue){
						if(existsData[0] == 1){
							searchResourceDatas.gbdataArray.push(data);
							gBDeviceNum++;
						}else if(existsData[0] == 2){
							searchResourceDatas.bayonetDataArray.push(data);
							bayonetNum++;
							bayonetHtml+="<tr><td style='padding:5px;padding-left:10px;'>"+data.name+"</td></tr>";
						}else if(existsData[0] == 4){
							searchResourceDatas.policeDataArray.push(data);
							policeNum++;
						}else if(existsData[0] == 5){
							searchResourceDatas.policeCarDataArray.push(data);
							policeCarNum++;
						}
					}
					if((searchValue && data.name
							&& data.name.indexOf(searchValue) > -1) || !searchValue){
						if(existsData[0] == 11){
							otherNum++;
							otherHtml += "<tr height='25px'><td align='center'><input name='otherBox' type='checkbox'></td><td width='210px;'>"+data.name+"</td><td align='center'>"+distance+"</td><tr>";
						}
					}
				}
				if(existsData[0] == 1){
					searchResourceDatas.gbPageArray=searchResourceDatas.gbdataArray;
					tempListDatas=searchResourceDatas.gbPageArray
					 MapToobar.buildGbHtml(1);
					 $("#gBDeviceNum").html(gBDeviceNum);
				}else if(existsData[0] == 3){

				}else if(existsData[0] == 2){
					bayonetHtml="<tr><td>"
						+"<div style='width:300px;'><input id='bayonetName' placeholder='卡口搜索' class='fl ty-jqcz-search' style='width:100px;margin-left:10px;margin-top:0px;'/>"
						+"<image onclick=\"MapToobar.searchPoliceByCondition('bayonet','bayonet')\" style='padding-left:20px;' src='"+basePath+"Skin/Default/images/button2.png'>"
						+"</div></td></tr>"
						+"<tr><td><table><tbody id='bayonetList'>"+bayonetHtml;
						+"</tbody></table></td></tr>";
					$("#bayonetHtml").html(bayonetHtml);
					$("#bayonetNum").html(bayonetNum);
				}else if(existsData[0] == 4){
					policeHtml=MapToobar.buildPoliceData();
					policeHtml="<tr><td>"
						+"<div style='width:300px;'><input id='policeName' class='fl ty-jqcz-search' placeholder='警员搜索' style='width:100px;margin-left:10px;margin-top:0px;'/><input type='button' class='bml-search-btn' onclick='MapToobar.filterOk(\"police\");' style='margin: -2px 0 0 3px;'>"
						/*+"<button onclick=\"conditionFilter(this,'police')\" style='margin-left:20px;'>过滤</button>"*/
						+"<input onclick=\"conditionFilter(this,'police')\" style='margin-left:20px;margin-top: -12px;' type='button' value='过滤' class='filter-bottom-btn ty-button ty-button-te'>"
						+"</div></td></tr>"
						+"<tr><td><table><tbody id='policeList'>"+policeHtml;
						+"</tbody></table></td></tr>";
					$("#policeHtml").html(policeHtml);
					 $("#policeNum").html(policeNum);
				}else if(existsData[0] == 5){
					policeCarHtml=MapToobar.buildPoliceCarData();
					policeCarHtml="<tr><td>"
						+"<div style='width:300px;'><input id='policeCarName' class='fl ty-jqcz-search' placeholder='警车搜索' style='width:100px;margin-left:10px;margin-top:0px;'/><input type='button' class='bml-search-btn' onclick='MapToobar.filterOk(\"policeCar\");' style='margin: -2px 0 0 3px;'>"
						/*+"<button onclick=\"conditionFilter(this,'policeCar')\" style='margin-left:20px;'>过滤</button>"*/
						+"<input onclick=\"conditionFilter(this,'policeCar')\" type='button' style='margin-left:20px;margin-top: -12px;' value='过滤' class='filter-bottom-btn ty-button ty-button-te'>"
						+"</div></td></tr>"
						+"<tr><td><table><tbody id='policeCarList'>"+policeCarHtml;
						+"</tbody></table></td></tr>";
					$("#policeCarHtml").html(policeCarHtml);
					 $("#policeCarNum").html(policeCarNum);
				}
			}
	 },

	 /**
	  * 对业务对象 模拟查询
	  * @param geometry
	  */
	 queryCenterdatas: function(en, datas){
	 	var existsPoints = [];
	 	if(!datas){
	 		return;
	 	}
	 	var type = null;
	 	for(var i in datas){
	 		if(datas[i] instanceof Function) continue;
	 		var entity = datas[i];
	 		if((entity.type == 4 || entity.type == 5) && entity.isOnLine == false){ //已经下线
	 			continue;
	 		}
	 		type = entity.type;
	 		var nEn = new MapEntity(entity);
	 		nEn.isWork = false;
	 		var point = MapManager.createPoint(nEn);
	 		if(MapManager.intersects(point, en.searchResultGeo)){

	 			var reFlag = MapToobar.checkIsChart(entity.type, entity, true);
				if(reFlag == false) {

					entity.action = "click";
					entity.callback = MapToobar.openInfoWindow;
					if(entity.type == 4 || entity.type == 5){
	    				var titleName = entity.des ? entity.name+"("+entity.des+")" : entity.name;
	    				 entity.isTitle = true;
	    				 entity.titleStyle = {
	    						 name: titleName
	    				 }
	    				 entity.targetObj = null;
	    			}
					MapManager.doResourceChart(entity);
				}
				// 添加到 GPS数据库中
				MapToobar.addGPSData(entity.type, entity);
	 			existsPoints.push(entity);
	 		}
	 	}
	 	if(existsPoints && existsPoints.length > 0)
	 		searchEntity.existsDatas.push([type,existsPoints,true]);
	 },
	/**
	 * 查询完成回调方法
	 * @param queryEventArgs
	 */
	queryCompleted: function (queryEventArgs){
		var  type = 11;
		var i, j, result = queryEventArgs.result;
	    if (result && result.recordsets) {
	    	var entitys = [];
	        for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
	            if (recordsets[i].features) {
	                for (j=0; j<recordsets[i].features.length; j++) {
	                    var feature = recordsets[i].features[j];
	                    var point = feature.geometry;
	                    if(point.CLASS_NAME == SuperMap.Geometry.Point.prototype.CLASS_NAME){
	                    	var objInfo = feature;
	                    	feature.attributes = {
		        	 				datas: objInfo,
		        	 				type: type
		        	 			}
	                    	var point = feature.geometry;
	                    	var entity = new Entity();
	                    	entity.name = feature.data.NAME;
	                    	entity.longitude = point.y;
	                    	entity.latitude = point.x;
	                    	entity.type = type;
	                    	entity.detailInfo = feature;
	                    	entitys.push(entity);
	                    	//var datas = [type,point.x, point.y,objInfo, type];
	                    	var markerObj =  MapToobar.createQueryResult(feature);
	        	 			//datas.push(markerObj);
	                    }else{
	                        feature.style = style;
	                        searchObj.attrs.searchLayer.addFeatures(feature);
	                    }

	                }
	            }
	        }
	        var isHave = false;
	        for(var j in searchObj.attrs.existsDatas){
	        	if(searchObj.attrs.existsDatas[j][0] == type){
	        		isHave = true;
	        		searchObj.attrs.existsDatas[j][1] = entitys
	        	}
	        }
	        if(!isHave) searchObj.attrs.existsDatas.push([type, entitys, true]);
	    }
	},
	/**
	 * 根据查询结果 绘点
	 * @param point
	 * @param type 类型
	 */
	createQueryResult: function(feature, type){

		var point = feature.geometry;
		var pointType = feature.attributes.type;
		var entity = feature.attributes.datas;
		//创建对应label对象
		if(entity.type == 4 || entity.type == 5){
			var vlayer = MapToobar.getVectorLayerByName("labelLayer");
			MapManager.createGeoTextFeatureByEntity(entity, vlayer);
		}

		if(!type) pointType = type;
		var icon = MapToobar.getIcon(pointType,22,22);
		var mk = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
		mk.attributes = {
			feaObj: feature
		};
		mk.id = entity.id;
		mk.type = feature.attributes.type;
		mk.events.on({
	        "click": function(){
	        	MapManager.clearPopups(map,["search"]);
	        	var mkObj = this;
	        	var currentFeature = mkObj.attributes.feaObj;
	        	var objinfo = currentFeature.attributes.datas;
	        	var c = "",s = new Object();
	        	s.w = "270px"; s.h = "40px;";
    			c = "<div style='width: 100%; height: 100%; '>";
    			c += "<div style='position:absolute;left: 10px; width: 90%; '>";
	        	if(currentFeature.attributes.type == 1){
	    			c += "<table width='100%'><tr><td width='80px'>天网名称：</td> <td width='200px'>"+objinfo.name+"</td></tr></table>";
	    		}else if(currentFeature.attributes.type == 2){
	    			c += "<table width='100%'><tr><td width='80px'>卡口名称：</td> <td width='200px'>"+objinfo.name+"</td></tr></table>";
	    		}else if(currentFeature.attributes.type == 3){
	    			c += "<table width='100%'><tr><td width='80px'>卡点名称：</td> <td width='200px'>"+objinfo.name+"</td></tr></table>";
	    		}else if(currentFeature.attributes.type == 4){
	    			c += "<table width='100%'><tr><td width='80px'>姓名：</td> <td width='200px'>"+objinfo.name+"</td></tr></table>";
	    		}else if(currentFeature.attributes.type == 5){
	    			c += "<table width='100%'><tr><td width='80px'>名称：</td> <td width='200px'>"+objinfo.name+"</td></tr></table>";
	    		}else if(currentFeature.attributes.type == 10){
		    		c += "<table width='100%'><tr><td width='50px'>名称：</td> <td width='150px'>"+currentFeature.data.NAME+"</td></tr>";
	    		}else{
	    			  return;
	    		}
	        	c += "</div></div>";
	        	var obj = {
	        			lon: currentFeature.geometry.x,
	        			lat: currentFeature.geometry.y
	        	};
	        	  var pp = MapManager.openPopup ("",obj, c, s,"#2A3D47", 0.7, false);
	        	  pp.type = "search";
	        	  map.addPopup(pp);
	        },
		    "scope": mk
		});
		if(searchObj && searchObj.attrs
				&& searchObj.attrs.searchMarkerLayer) {
			searchObj.attrs.searchMarkerLayer.addMarker(mk);
		}
		return mk;
	},
	/**
	 * 对搜索结果进行选择性显示
	 * @param type
	 */
	selectDisplay: function(type){
		var isHave = false;
		var existsDatas = searchEntity.existsDatas;
		for(var i in existsDatas){
			if(existsDatas[i] instanceof Function) continue;
			if(existsDatas[i][0] == type && existsDatas[i][1]){
				isHave = true;
				var datas = existsDatas[i][1];
				var resStatus = existsDatas[i][2];
				searchEntity.existsDatas[i][2] = !searchEntity.existsDatas[i][2];
				if(resStatus) {
					for(var d in datas){
						if(!datas[d] || datas[d] instanceof Function) continue;
						MapToobar.checkIsChart(datas[d].type, datas[d], false);
						//删除对应的label对象
						/*if(datas[d].type == 4 || datas[d].type == 5){
							var vlayer = MapToobar.getVectorLayerByName("labelLayer");
							MapManager.clearFeaturesByIdType(vlayer, datas[d].id, datas[d].type);
						}*/
						MapManager.clearResourceChartByIdType(datas[d]);
					}
				}else{
					for(var d in datas){
						if(!datas[d] || datas[d] instanceof Function) continue;
						MapManager.doResourceChart(datas[d]);
					}
				}
				break;
			}
		}

		if(false && !isHave && type > 10){ // 表示地图原始图层搜索
			var geoParams = {
					name: "Government@Changchun.2"
				};
		 	MapManager.queryByGeometry(url,
		 		geoParams,
		 		searchObj.attrs.searchFea.geometry,
				SuperMap.REST.SpatialQueryMode.INTERSECT,
				MapToobar.queryCompleted);
		 	return;
		}
	},
	/**
	 * 范围搜索结果 展示
	 */
	openSearchResult: function(){
		var rc = "<div>";
		/* 类型图标*/
		rc += "<div class='ty-ssjg-list'><ul>" +
			"<li><img onclick='MapToobar.selectDisplay(4)' style='width:25px;height:27px;' src='"+basePath+"images/map/images/MapIcos/jiaojingPoliceIco.png'><span>警员</span></li>" +
			"<li><img onclick='MapToobar.selectDisplay(5)' style='width:25px;height:27px;' src='"+basePath+"images/map/images/MapIcos/carIco.png'><span>警车</span></li>" +
			"<li><img onclick='MapToobar.selectDisplay(2)' style='width:25px;height:27px;' src='"+basePath+"images/map/images/MapIcos/GisGunCameraNormal.png'><span>卡口</span></li>" +
			/*"<li><img onclick='MapToobar.selectDisplay(3)' width='25px' height='25px' src='"+basePath+"images/map/images/MapIcos/CardDotNomal.png'><span>卡点</span></li>" +*/
			"<li><img onclick='MapToobar.selectDisplay(1)' style='width:25px;height:27px;' src='"+basePath+"images/map/images/MapIcos/GisBallCameraNormal.png'><span>天网</span></li>";
		/*rc += "<li><img onclick='MapToobar.selectDisplay(11)' src='"+basePath+"Skin/Default/images/button2.png'></li><li><img src='"+basePath+"Skin/Default/images/button2.png'></li><li><img src='"+basePath+"Skin/Default/images/button2.png'></li>";
		rc += "<li><img src='"+basePath+"Skin/Default/images/button2.png'></li><li><img src='"+basePath+"Skin/Default/images/button2.png'></li><li><img src='"+basePath+"Skin/Default/images/button2.png'></li>";*/
		rc += "</ul></div>";
		/* 搜索框*/
		rc += "<div style='margin-top: -30px;'><input id='searchValue' class='fl bml-search-txt ty-width295' type='text' value=''><button class='bml-search-btn' onclick='MapToobar.searchByValue()'></button></div>";

		rc += "<div id='ty-ssjg-list-resultsDiv-scrolling' style='height:307px;overflow-y:auto;'>";
		rc += "<div id='resultsDiv' style='margin-top: 15px;height: auto;OVERFLOW-Y: auto; OVERFLOW-X:hidden;'>";

		/* 构建结构table*/
		rc += MapToobar.buildSearchTable();
		rc += "</div>";
		rc += "</div>";

		/* 区域收藏按钮*/
		rc += "<div style='padding-top: 15px; width: 92%;text-align: right;'><button type='button' onclick='MapToobar.saveArea(this);' data-click='save' style='width:85px;;height:32px;line-height:24px;background-color:#B7202A;color:#FFF;font-size:14px;border:0;border-radius:2px;'>区域收藏</button></div>";
		rc += "</div>";

		var searchResultDialog = $("#searchResultDialog").data("kendoWindow");
		searchResultDialog.content(rc);
		searchResultDialog.open();

		//$("#resultsDiv").mCustomScrollbar({scrollButtons:{enable:true},advanced:{ updateOnContentResize: true } });
		/*setTimeout(function(){
			   $("#ty-ssjg-list-resultsDiv-scrolling").mCustomScrollbar({scrollButtons:{enable:true},advanced:{ updateOnContentResize: true },axis:"yx"});
		   },500);*/
	},
	/**
	 * 组装结果
	 * @returns {String}
	 */
	buildSearchTable: function(){
		var content = "";
		content += "<table class=\"ty-tj-table fit mt10\">"
            	+"<tr><td colspan=\"3\" class=\"ty-tj-td\"><div class=\"fl ty-jqfk-bg\">"
            	/*固定样式 */
                +"<div class=\"ty-jqfk-box-head\" onclick='MapToobar.objToggle(this,\"police\")'>"
                +"<div class=\"ty-jbh-title\">警员(<span id='policeNum'>0</span>个)</div>"
                +"<div class=\"fr\"><span class=\"fr ml10\"><i class=\"ty-icon-arrow\" name=\"tyIconArrow\"></i></span></div></div>"

                +"<div id='police' class=\"ty-ssjg-box set-height-auto\"><table class=\"ty-jq-table\" id='policeHtml'></table></div>"

                +"</td></tr>"
                +"</table>";
		content += "<table class=\"ty-tj-table fit mt10\">"
            	+"<tr><td colspan=\"3\" class=\"ty-tj-td\"><div class=\"fl ty-jqfk-bg\">"
                +"<div class=\"ty-jqfk-box-head\" onclick='MapToobar.objToggle(this,\"policeCar\")'><div class=\"ty-jbh-title\">警车(<span id='policeCarNum'>"
                +"0</span>个)</div><div class=\"fr\"><span class=\"fr ml10\"><i class=\"ty-icon-arrow\" name=\"tyIconArrow\"></i></span></div></div><div id='policeCar' class=\"ty-ssjg-box set-height-auto\">"
				+"<table class=\"ty-jq-table\" id='policeCarHtml'></table></div></td></tr>"
				+"</table>";
		content += "<table class=\"ty-tj-table fit mt10\">"
            	+"<tr><td colspan=\"3\" class=\"ty-tj-td\"><div class=\"fl ty-jqfk-bg\">"
                +"<div class=\"ty-jqfk-box-head\" onclick='MapToobar.objToggle(this,\"gBDevice\")'><div class=\"ty-jbh-title\">天网(<span id='gBDeviceNum'>"
                +"0</span>个)</div><div class=\"fr\"><span class=\"fr ml10\"><i class=\"ty-icon-arrow\" name=\"tyIconArrow\"></i></span></div></div><div id='gBDevice' class=\"ty-ssjg-box set-height-auto\">"
				+"<table class=\"ty-jq-table\" id='gBDeviceHtml'></table></div></td></tr>"
				+"</table>";
		content += "<table class=\"ty-tj-table fit mt10\">"
            	+"<tr><td colspan=\"3\" class=\"ty-tj-td\"><div class=\"fl ty-jqfk-bg\">"
                +"<div class=\"ty-jqfk-box-head\" onclick='MapToobar.objToggle(this,\"bayonet\")'><div class=\"ty-jbh-title\">卡口(<span id='bayonetNum'>"
                +"0</span>个)</div><div class=\"fr\"><span class=\"fr ml10\"><i class=\"ty-icon-arrow\" name=\"tyIconArrow\"></i></span></div></div><div id='bayonet' class=\"ty-ssjg-box set-height-auto\">"
				+"<table class=\"ty-jq-table\" id='bayonetHtml'></table></div></td></tr>"
				+"</table>";
		return content;
	},
	/**
	 * 全选事件
	 * @param obj
	 * @param idStr
	 */
	selectIsAll:function(obj, idStr){
		var checks = document.getElementsByName(idStr+"Box");
		for(var i = 0; i < checks.length; i++){
			var check = checks[i];
			if(check) {
				if(obj.checked){
					check.checked = true;
				}else{
					check.checked = false;
				}
			}
		}
	},
	/**
	 * 查询功能
	 */
	searchByValue: function(){

		//清空上图
		//警员
		 for ( var i = 0; i < searchResourceDatas.policeDataArray.length; i++) {
			 var data=searchResourceDatas.policeDataArray[i];
			//var resMarkerLayer = MapHandler.getMarkerLayerByName();
			 MapManager.clearResourceChartByIdType(data);
			//var vlayer = MapHandler.getVectorLayerByName("labelLayer");
			//MapManager.clearFeaturesByType(vlayer, data.type);
		 }
		 //警车
		 for ( var i = 0; i < searchResourceDatas.policeCarDataArray.length; i++) {
			 var data=searchResourceDatas.policeCarDataArray[i];
			//var resMarkerLayer = MapHandler.getMarkerLayerByName();
			 MapManager.clearResourceChartByIdType(data);
			//var vlayer = MapHandler.getVectorLayerByName("labelLayer");
			//MapManager.clearFeaturesByType(vlayer, data.type);
		 }
		 //卡口
		 for ( var i = 0; i < searchResourceDatas.bayonetDataArray.length; i++) {
			 var data=searchResourceDatas.bayonetDataArray[i];
			 MapManager.clearResourceChartByIdType(data);
		 }
		 //天网
		 for ( var i = 0; i < searchResourceDatas.gbPageArray.length; i++) {
			 var data=searchResourceDatas.gbPageArray[i];
			 MapManager.clearResourceChartByIdType(data);
		 }




		searchResourceDatas.policeDataArray.length=0;//清除警员集合
		searchResourceDatas.policeCarDataArray.length=0;//清除警车集合
		searchResourceDatas.bayonetDataArray.length=0;//清除卡口数据集合

		searchResourceDatas.gbdataArray.length=0;//清除GB数据
		searchResourceDatas.gbPageArray.length=0;//清除临时用于分页的缓存数组



		//组装数据前，清空所有上图

		var content = MapToobar.buildResDatas(null, $("#searchValue").val());

		//组装数据后，各个资源集合里面有多少资源就上多少资源
		//警员
		for ( var i = 0; i < searchResourceDatas.policeDataArray.length; i++) {
			var en = searchResourceDatas.policeDataArray[i];
			//注册事件
			en.action = "click";
			en.callback = MapToobar.openInfoWindow;
			MapManager.doResourceChart(en);
		}
		//警车
		for ( var i = 0; i < searchResourceDatas.policeCarDataArray.length; i++) {
			var en = searchResourceDatas.policeCarDataArray[i];
			//注册事件
			en.action = "click";
			en.callback = MapToobar.openInfoWindow;
			MapManager.doResourceChart(en);
		}
		//卡口
		for ( var i = 0; i < searchResourceDatas.bayonetDataArray.length; i++) {
			var en = searchResourceDatas.bayonetDataArray[i];
			//注册事件
			en.action = "click";
			en.callback = MapToobar.openInfoWindow;
			MapManager.doResourceChart(en);
		}
		//天网
		for ( var i = 0; i < searchResourceDatas.gbPageArray.length; i++) {
			var en = searchResourceDatas.gbPageArray[i];
			//注册事件
			en.action = "click";
			en.callback = MapToobar.openInfoWindow;
			MapManager.doResourceChart(en);
		}

		if(content){
			$("#resultsDiv").html("");
			$("#resultsDiv").html(content);
		}
	},
	/**
	 * 保存区域收藏
	 * @param obj
	 */
	saveArea: function(obj){
		var content = "<div style='width: 100%;height: 100%'><div style='padding-top:26px;'>";
		content+= "<span>区域收藏名称 : </span><input id='groupName' type='text' class='k-textbox' ></div>";
		content+= "<div  style='width: 100%;text-align: right;margin-top: 15px;'><button type='button' onclick='MapToobar.doSaveArea();' data-click='save' style='width:50px;height:32px;line-height:24px;background-color:#B7202A;color:#FFF;font-size:14px;border:0;border-radius:2px;'>保存</button>" +
				"&nbsp;&nbsp;&nbsp;&nbsp;<button type='button' onclick='javascript:$(\"#addGroupDialog\").data(\"kendoWindow\").close();' data-click='save' style='width:50px;;height:32px;line-height:24px;background-color:#B7202A;color:#FFF;font-size:14px;border:0;border-radius:2px;'>取消</button>&nbsp;&nbsp;&nbsp;&nbsp;";
		content+= "</div></div>";
		$("#addGroupDialog").kendoWindow({
			width: "380px",
			height: "250px",
			title: "添加区域收藏",
			position: {
				top: "400px",
				left: "600px"
			}
		});
		$("#addGroupDialog").data("kendoWindow").content(content).open();
		return;
	},
	/**
	 * 执行保存区域收藏
	 */
	doSaveArea: function(){
		if(!searchEntity || !searchEntity.areaPoints){
			return;
		}
		if(!$("#groupName").val() || $("#groupName").val().trim() == ""){
			$("body").popjs({"title":"提示","content":"区域收藏名称不能为空！"});
			return;
		}
		var areaContent = {
				"centerPoint": searchEntity.centerPoint,
				"areaType": searchEntity.areaType,
				"area_Points": searchEntity.areaPoints
		};
		$.ajax({
			url:  basePath+ MapResourceUrl.saveGroupInfo,
			type: "post",
			dataType: "json",
			data: {
				groupName: $("#groupName").val(),
				userId: $("#userId").val(),
				organId: $("#orgId").val(),
				shareType: 1,
				groupType: 2,
				sourceData: "",
				areaType: searchEntity.areaType,
				areaContent: JSON.stringify(areaContent),
				random: Math.random()
			},
			success: function(msg){
				if(msg.code==200){
					//清除地图上搜索的资源
					MapToobar.clearSearchInfo();

					$("body").popjs({"title":"提示","content": "保存成功！"});
					try{
						initGroupResourceDatas(); //更新收藏列表 窗体的数据
					}catch(e){}
					$("#addGroupDialog").data("kendoWindow").close();
					$("#searchResultDialog").data("kendoWindow").close();
				}else{
					$("body").popjs({"title":"提示","content":msg.description});
				}
			}
		});
	},
	/**
	 * 控制元素的显示与隐藏
	 * @param idstr
	 * @param flag 当值为true时，表示显示该内容；为false，表示隐藏该内容
	 */
	controlDisplay:function(idstr, flag){
		if(flag == true) {
			$("#"+idstr).css("display", "block");
		}else if(flag == false){
			$("#"+idstr).css("display", "none");
		}else{
			$("#"+idstr).toggle();
		}
	},
	/**
	 * 控制元素的显示与隐藏(包含箭头的情况)
	 * @param obj 当前对象
	 * @param idstr 切换元素的ID
	 */
	objToggle:function(obj,idstr){
		var o = $(obj).find("div span i[name='tyIconArrow']");
		var f = o.hasClass("ty-icon-arrow");
		if(f){
			o.removeClass("ty-icon-arrow").addClass("ty-icon-arrow-d");
		}else{
			o.removeClass("ty-icon-arrow-d").addClass("ty-icon-arrow");
		}
		$("#"+idstr).toggle();
	},
	//关闭弹窗
	closeInfoWin111:function() {
	 if (popup111) {
	 try {
	 map.removePopup(popup111);
	 }
	 catch (e) {
	 }
	 }
	 }
	,
	/**
	 * 对于点对象上图(Feature 类型)
	 * @param entity 数据实体类
	 * @param layer
	 * @param iw 图片的宽度
	 * @param ih 图片的高度
	 */
	doResourceChartOfPointFeature: function(entity, layer,iw,ih){
		if(layer == null || layer == undefined){
			layer = MapHandler.getVectorLayerByName();
		}
		entity.iconUrl = MapHandler.getImgUrl(entity.type);
		var style = null;
		if(entity.style) {
			style = entity.style;
		}else{
			style = MapManager.getFeatureStyle(entity, true);
		}
		if(iw) style.graphicWidth = iw;
		if(ih) style.graphicHeight = ih;
		entity.style = style;
		var feature = MapManager.createPointFeatureByEntity(entity, layer);
		return feature;
	},
	/**
	 * 公共的查询完成回调函数
	 */
	queryCommonCompleted: function(datas){
	    if (!datas) {
	        return;
	    }
	    for (var i in datas) {
            if(!datas[i] || (datas[i] instanceof Function)){
            	continue;
            }
            var en = datas[i];
            en.action = "click";
            en.callback = MapManager.openInfoWindow;
            MapManager.doResourceChart(en);
        }
	},
	/**
	 * 生成图片
	 * @param w 图片宽
	 * @param h 图片高
	 * @param type 类型
	 * @returns {SuperMap.Icon}
	 */
	getIcon: function(type, w,h){
		if(!w) w = 25; if(!h) h = 25;
	    var ipath = MapHandler.getImgUrl(type);
		if(type == 4){
			w = 30; h = 32;
		}else if(type == 5){
			w = 32;  h = 30;
		}else if(type < 1){//刑事 行政治安 群众求助...
			w = 32;  h = 30;
		}
		else if(type==100 || type==101 || type==102){//警情 电话 杆体
			w = 32;  h = 30;
		}
		var size = new SuperMap.Size(w, h);
	    var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
	    var icon = new SuperMap.Icon(ipath, size, offset);
	    return icon;
	},
	/**
	 * 解析MQ推送的GPS数据(下线)
	 * @param data
	 */
	offLinePoliceAndCar: function(data){
		//20170725 nishaodong 解决openlayer和线程js冲突的问题
//		Concurrent.Thread.create(function(data){MapToobar.doOffLinePoliceAndCar(data);}, data);
		setTimeout(function(){
			MapToobar.doOffLinePoliceAndCar(data);
		},500);
	},
	/**
	 * 执行解析MQ推送的GPS数据(下线)
	 * @param data
	 */
	doOffLinePoliceAndCar: function(data){
		var ob = JSON.parse(data);
		if(ob.type == "gpsOffLine"){
			if(!ResourceDatas.gpsResDatas) return;
			var entity = null;
			for(var type in ResourceDatas.gpsResDatas){
				if(ResourceDatas.gpsResDatas[type] instanceof Function){
					continue;
				}
				entity = ResourceDatas.gpsResDatas[type][ob.data];
				if(entity){
					break;
				}
			}
			if(!entity || !entity.detailInfo){
				return;
			}
			entity.isOnLine = false;
			entity.detailInfo.isOnLine = false;
			MapManager.clearResourceChartByIdType(entity);
			//计算上图资源的个数
			try{
				countResChart(entity.type);
			}catch(e){}
		}
	},
	/**
	 * 解析MQ推送的GPS数据
	 * @param datas
	 */
	bulidPoliceAndCar: function(datas){
		//20170725 nishaodong 解决openlayer和线程js冲突的问题
//		Concurrent.Thread.create(function(datas){MapToobar.dobulidPoliceAndCar(datas);}, datas);
		setTimeout(function(){
			MapToobar.dobulidPoliceAndCar(datas);
		},500);
	},
	/**
	 * 解析MQ推送的GPS数据
	 * @param datas
	 */
	dobulidPoliceAndCar: function(datas){
		if(!datas || datas == null) return;
		var gpsId = null, lon,lat;
		var mqDatas = datas.split("-");
		if(mqDatas && mqDatas.length > 4){
			gpsId = mqDatas[0];
			lon = mqDatas[1];
			lat = mqDatas[2];
			MapToobar.doGpsPoliceAndCar(gpsId,lon,lat);
		}
	},
	/**
	 * 初始化 警员 警车 GPS上图的线程
	 */
	intervalBuildPoliceAndCar: function(){
		/**
		 * 定时器触发时,检测当前缓存中数量，如果地图数据存在该对象，执行redraw方法，否则添加到新增列表中
		 */
		setInterval(function(){
			/*policeTypes.length=0;
			$("#policeType input[type=checkbox]").each(function(){
			   	if(this.checked){
			   		policeTypes.push($(this).val());
			   	}
			});*/
			resourceFeatureDatas.policeFeatures.length = 0;
			resourceFeatureDatas.intercomFeatures.length = 0;
			resourceFeatureDatas.policeCarFeatures.length = 0;
			for(var i in ResourceDatas.mqGpsArray){
				var enty = ResourceDatas.mqGpsArray[i];
				if(!enty || (enty instanceof Function)) continue;
				/**
				 * 判断是否执行redraw.执行修改还是新增
				 */
				MapToobar.mqVectorRedraw(enty);
			}
			//执行修改列表上图.redraw方法
			if(ResourceDatas.mqGpsArray.length > 0){
				var lays = [layerName.policeLayer,layerName.intercomLayer,layerName.policeCarLayer];

				for(var i = 0; i < lays.length; i++){
					MapToobar.vectorRedraw(lays[i]);
				}

				ResourceDatas.mqGpsArray.length = 0;
			}
			//执行警员新增列表上图
			if(resourceFeatureDatas.policeFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.policeFeatures,layerName.policeLayer);
			}
			//执行警员新增列表上图
			if(resourceFeatureDatas.intercomFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.intercomFeatures,layerName.intercomLayer);
			}
			//执行警车新增列表上图
			if(resourceFeatureDatas.policeCarFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.policeCarFeatures,layerName.policeCarLayer);
			}
		}, 5000);
	},
	/**
	 * 执行警员 警车 GPS上图
	 */
	doGpsPoliceAndCar: function(gpsId, lon, lat){
		/**
		 * 控制综合指挥界面警员、警车上线刷新列表和在线数量的变化
		 */
		MapToobar.refreshCountAndList(gpsId);
		if(!ResourceDatas.gpsResDatas) return;
		var entity = null;
		for(var type in ResourceDatas.gpsResDatas){
			if(ResourceDatas.gpsResDatas[type] instanceof Function){
				continue;
			}
			entity = ResourceDatas.gpsResDatas[type][gpsId];
			if(entity){
				break;
			}
		}

		if(!entity || !entity.detailInfo){
			return;
		}
		//GPS上线
		entity.isOnLine = true;
		entity.detailInfo.isOnLine = true;

		 if(lon == entity.longitude && lat == entity.latitude) return;  // 如果坐标没变，则直接跳出循环
		 entity.longitude = lon;
		 entity.latitude = lat;
		 if(entity.type == 4 && !ResourceDatas.policeControl){
			 return;
		 }else	 if(entity.type == 4.6 && !ResourceDatas.intercomControl){
			 return;
		 } else	 if(entity.type == 5 && !ResourceDatas.policeCarControl){
			 return;
		 }
		 //向缓存中添加数据
		 MapToobar.addMqGpsArray(entity);
	},
	/**
	 * 刷新综合指挥在线列表和在线数量
	 */
	refreshCountAndList:function(gpsId){
		if(typeof(refreshOnLineNum) == "function"){
			refreshOnLineNum(gpsId);
		}
	},
	/**
	 * 向MQGPS缓存中添加数据
	 */
	addMqGpsArray:function(enty){
		var isExit = false;
		for(var i in ResourceDatas.mqGpsArray){
			var en = ResourceDatas.mqGpsArray[i];
			if(!en || (en instanceof Function)){continue;}
			if(en.detailInfo.gpsId == enty.detailInfo.gpsId){
				if(en.longitude != enty.longitude && en.latitude != enty.latitude){
					en.longitude = enty.longitude;
					en.latitude = enty.latitude;
				}
				isExit = true;
			}
		}
		if(!isExit){
			ResourceDatas.mqGpsArray.push(enty);
		}
		//触发定时器
		if(ResourceDatas.initGpsChart == false){
			MapToobar.intervalBuildPoliceAndCar();
			ResourceDatas.initGpsChart = true;
		}
	},
	/**
	 * 组建修改(redraw)列表 和 新增列表
	 */
	mqVectorRedraw:function(entity){
		 var vLayer = MapHandler.getVectorLayerByName(entity.layerName);
		//得到该图层所有的矢量要素
		var overlays = vLayer.features;
		MapToobar.mqResourceChart(entity);
		return;

		//20170725 nishaodong 去除超图独有代码处置
		if(!overlays || overlays.length == 0){
			MapToobar.mqResourceChart(entity);
			return;
		}
		var len = overlays.length;
		var isExit = false;

		//组建修改列表(redraw)
		for(var i =len -1;i > -1 ;i--){
			if(!overlays[i].geometry || !overlays[i].geometry.attributes){
				continue;
			}
			if (overlays[i].geometry.attributes.entity.id == entity.id) {
				//是否有高亮图标。如果有高亮图标。则不执行redraw方法
				if(ResourceDatas.GPSSelected["hight"]
				 	&& ResourceDatas.GPSSelected["hight"].id == entity.id){
					MapManager.clearOverlayByIdType(entity);
					ChartManager.restoreVector(entity);
					ResourceDatas.GPSSelected["hight"] = null;
				}
				//注册事件
				entity.action = "click";
				entity.callback = MapToobar.openInfoWindow;
				//恢复原型图标
				if(entity.type == 4){
					overlays[i].geometry.attributes.entity.iconUrl=entity.detailInfo.iconUrl;
				}else{
					var img = MapHandler.getBarImgByType(5,entity.detailInfo.purposeId,false);
					overlays[i].geometry.attributes.entity.iconUrl=img;
				}
				vLayer.features[i].geometry = new SuperMap.Geometry.Point(entity.longitude, entity.latitude);
				if(!vLayer.features[i].geometry.attributes){
					vLayer.features[i].geometry.attributes = {entity: entity};
				}
				isExit = true;
			}
		}

		//组建新增列表
		if(!isExit){
			MapToobar.mqResourceChart(entity);
		}
	},
	mqResourceChart: function(entity){
		var type=entity.type;
		var titleName = entity.des ? entity.name+"("+entity.des+")" : entity.name;
		 entity.isTitle = true;
		 entity.titleStyle = {
				 name: titleName
		 }
		 //注册事件
		 entity.action = "click";
		 entity.callback = MapToobar.openInfoWindow;
		 entity.targetObj = null;
		 //验证勾选类型
		 var isContainType=false;
		 if(entity.type == 4){
			 entity.layerName = layerName.policeLayer;
		 }else if(entity.type == 5){
			 entity.layerName = layerName.policeCarLayer;
		 }else{
		 	 entity.layerName = layerName.intercomLayer;
		 }

		 MapManager.clearOverlayByIdType(entity);

		 ResourceDatas.GPSSelected["hight"]=null;
		/* if(entity.type == 4){
			if(entity.detailInfo.iconUrl && entity.detailInfo.iconUrl != "0.0"){
				entity.iconUrl = basePath + "uploadFile" + entity.detailInfo.iconUrl;
   			}else{
   				entity.iconUrl = MapHandler.getImgUrl(4.01);
   			}
		 }*/
		  try{
			 MapManager.doResourceChart(entity);
		 }catch(e){}

		//计算上图资源的个数
		try{
			countResChart(entity.type);
		}catch(e){}
	},
	/**
	 * 执行图层redraw方法
	 */
	vectorRedraw:function(layerName){
		//20170601 nishaodong 迁移进MapManager
		MapManager.vectorRedraw({layerName:layerName});
	},
	/**
	 * 判定 在警情派警人员Map中是否存在
	 */
	checkIsExist: function(gpsId, lon,lat){
		var isFlag = false;
		for(var i in AlarmResManager["alarm"]){
			var entity = AlarmResManager.get("alarm")[i];
			if(entity.gpsId == gpsId){
				isFlag = true;
				var markerLayer = MapHandler.getMarkerLayerByName(layerName.markerLayer);
				 if(lon == entity.longitude && lat == entity.latitude) break;  // 如果坐标没变，则直接跳出循环
				 AlarmResManager["alarm"][i].longitude = entity.longitude = lon;
				 AlarmResManager["alarm"][i].latitude = entity.latitude = lat;

				 if(entity.source) {
					 markerLayer.removeMarker(entity.source);
					 entity.source = null;
				 }
				 // 记录上图的警员
				 MapToobar.checkIsChart(entity.type, entity, true);
				 MapToobar.doResourceChartOfPoint(entity, markerLayer);
				 drawAlarmLine(entity);
			}
		}
		return isFlag;
	},
	/**
	 * 判定 是否已经上图
	 */
	checkIsChart: function(type, entity, flag){
		type = type + "";
		var reFlag = false;
		if(!entity || !entity.id) return reFlag;
		var curChartDatas = ResourceDatas.chartDatas[type];
		if(!curChartDatas){
			var typeDatas = new Object();
			if(flag == true)
				typeDatas[entity.id] = entity;
			ResourceDatas.chartDatas[type] = typeDatas;
		}else{
			var curDatas = curChartDatas[entity.id];
			if(curDatas){

				reFlag = true;

				if(flag == false){
					curChartDatas[entity.id] = null;
				}
			}else{
				if(flag == true){
					curChartDatas[entity.id] = entity;
				}
			}
		}
		return reFlag;
	},
	/**
	 * 添加GPS上图数据
	 */
	addGPSData: function(type, entity){
		var reFlag = false;
		if(!entity || !entity.id) return reFlag;
		var curGpsDatas = ResourceDatas.GPSDatas[type];
		if(!curGpsDatas){
			var typeDatas = new Object();
			typeDatas[entity.id] = entity;
			ResourceDatas.GPSDatas[type] = typeDatas;
		}else{
			var curDatas = curGpsDatas[entity.id];
			if(!curDatas){
				curGpsDatas[entity.id] = entity;
			}
		}
		return reFlag;
	},

	/**
	 * 判定 是否存在GPS上图数据
	 */
	checkIsGPSData: function(type, entity){
		var reFlag = false;
		if(!entity || !entity.id) return reFlag;
		var curGpsDatas = ResourceDatas.GPSDatas[type];
		if(curGpsDatas){
			var curDatas = curGpsDatas[entity.id];
			if(curDatas && curDatas.id){
				reFlag = true;
			}
		}
		return reFlag;
	},
	/**
	 * 清理搜索区要素
	 * @param type 类型，当值为null 或者 0时，就直接清理搜索图层，表示全部清理
	 */
	clearSearchInfo: function(type){
		var clearEn = new MapEntity();
		clearEn.showType = MapConstant.Pan;
		MapManager.drawDragMode(clearEn);

		if(searchEntity){
			for(var i in searchEntity.existsDatas){
	        	var entitys = searchEntity.existsDatas[i][1];
	        	for(var j = 0;entitys && j < entitys.length; j++){
	        		if(entitys[j] && entitys[j].id){
	        			MapToobar.checkIsChart(entitys[j].type, entitys[j], false);
	        			//删除对应的label对象
	        			/*if(entitys[j].type == 4 || entitys[j].type == 5){
							var vlayer = MapHandler.getVectorLayerByName("labelLayer");
							MapManager.clearFeaturesByIdType(vlayer, entitys[j].id, entitys[j].type);
						}*/
	        			//MapManager.clearMarkerById(searchObj.attrs.searchMarkerLayer, entitys[j].id);
	        			MapManager.clearResourceChartByIdType(entitys[j]);
	        		}
	        	}
	        }
		}
		$("#searchResultDialog").data("kendoWindow").close();
		MapManager.clearOverlays();

		if(searchObj){
			if(searchObj.attrs){
				if(searchObj.attrs.searchPop) map.removePopup(searchObj.attrs.searchPop);
				if(searchObj.attrs.searchMarkerLayer) {
					//searchObj.attrs.searchMarkerLayer.clearMarkers();
					for(var i in searchObj.attrs.existsDatas){
			        	var entitys = searchObj.attrs.existsDatas[i][1];
			        	for(var j = 0;entitys && j < entitys.length; j++){
			        		if(entitys[j] && entitys[j].id){
			        			MapToobar.checkIsChart(entitys[j].type, entitys[j], false);
			        			//删除对应的label对象
							if(entitys[j].type == 4 || entitys[j].type == 5){
									var vlayer = MapHandler.getVectorLayerByName("labelLayer");
									MapManager.clearFeaturesByIdType(vlayer, entitys[j].id, entitys[j].type);
								}
			        			//MapManager.clearMarkerById(searchObj.attrs.searchMarkerLayer, entitys[j].id);
			        			MapManager.clearResourceChartByIdType(searchObj.attrs.searchMarkerLayer, entitys[j].id, entitys[j].type);
			        		}
			        	}
			        }
				}
				if(searchObj.attrs.searchMarkerLayer && (!type || type == '0')){
					//map.removeLayer(searchObj.attrs.searchMarkerLayer);
				}

				if(searchObj.attrs.searchLayer) {
					searchObj.attrs.searchLayer.removeAllFeatures();
					//searchObj.attrs.searchLayer.removeFeatures(searchObj.attrs.searchFea);
				}
				if(searchObj.attrs.searchLayer && (!type || type == '0')){
					//map.removeLayer(searchObj.attrs.searchLayer);
				}
				searchObj.attrs = new Object();
				searchObj.attrs.existsDatas = [];
				searchObj.attrs.existsDataDetails = [];
				searchObj.attrs.flag = true;
			}
			try{searchObj.deactivate();}catch(e){}
			map.removeControl(searchObj);
			$("#searchResultDialog").data("kendoWindow").close();
			map.removeAllPopup();
		}
		// 清理鹰眼的一些数据
		if(eyeObj.attrs && eyeObj.attrs.eyeLayer) eyeObj.attrs.eyeLayer.removeAllFeatures();
		eyeObj.attrs = new Object();
	},

  /** 分页获取资源列表 */
  getDetailInfoForPage : function(param){
	var list;
	//如果临时列表存在，则使用临时列表。
	if (tempListDatas != undefined)
	{
	  list = tempListDatas;
	}
	else
	{
	  list = ListDatas[param.type];
	}
	var pageNo = param.pageNo;
	var pageSize = param.pageSize;
	var start = (pageNo - 1) * pageSize;
	var end = start + pageSize;
	if (list == undefined)
	  return [];
	return list.slice(start,end);
  },

  /** 获取资源总数 */
  getListTotal : function(type){
	if (tempListDatas != undefined)
	{
	  return tempListDatas.length;
	}
	else
	{
	  if (ListDatas == undefined || ListDatas[type] == undefined)
		return 0;
	  return ListDatas[type].length;
	}
  },

	/** 分页获取gb资源列表 */
  	getGbInfoForPage : function(param){
  	  var list;
  	  //如果临时列表存在，则使用临时列表。
  	  if (searchResourceDatas.gbPageArray != undefined)
  	  {
  		list = searchResourceDatas.gbPageArray;
  	  }
  	  else
  	  {
  		list = searchResourceDatas.gbdataArray;
  	  }
	  var pageNo = param.pageNo;
	  var pageSize = param.pageSize;
	  var start = (pageNo - 1) * pageSize;
	  var end = start + pageSize;
	  return list.slice(start,end);
	},

	/** 获取gb资源总数 */
  	getGbListTotal : function(type){
  		if (searchResourceDatas.gbPageArray != undefined)
  		{
  			return searchResourceDatas.gbPageArray.length;
  		}
  		else
  		{
  			return searchResourceDatas.gbdataArray.length;
  		}
	},
	/**
	 * 整合聚合数据上图
	 */
	gatherResourceChart: function(type, data){
		//清除vector上图
		MapToobar.clearVectorLayer(layerName.vectorGBLayer);
		resourceFeatureDatas.GBFeatures.length =0;

		var isArray = data instanceof Array;
		var resData = new Object();

		//迭代上图
		for(var i in data){
			var entity = data[i];
			//不属于MapEntity对象，则跳出本次循环
			if(entity instanceof Function) continue;
			resData[entity.id] = entity;
			//不存在经纬度，则跳出本次循环
			if(!entity.latitude || !entity.longitude) continue;
			//标记的宽 与 高
			var iw = 20, ih = 21;
			// 聚合基础点周围聚合的数量
			var gaCount = 0;
			if(entity.type != ResourceTypes.WW && entity.des && entity.des != ""){
				gaCount = parseInt(entity.des);
			}
			if(entity.type == 1 || entity.type == "1") entity.type = 1.1;
			if(MapManager.getZoom() <= mapGatherMaxZoom && gaCount > 1){// 小于17层 且 聚合基础点周围聚合的数量大于1 则使用聚合样式上图
				iw = 28;
				ih = 28;
				//设置聚合图片的样式
				if(MapVesion != "PGIS" && MapVesion != "PGIS_1.6") entity.isTitle = true;
				var titleStyle = entity.titleStyle;
				if(!titleStyle){
					titleStyle = new Object();
					titleStyle.name = entity.des;
					titleStyle.pos = 7;
					titleStyle.color = "#000";
					titleStyle.bgColor = "";
					titleStyle.borderColor = "";
					titleStyle.borderSize = "";

					entity.titleStyle = titleStyle;
				}
				entity.name = entity.des;
				entity.iconUrl = MapHandler.getImgUrl(1000);
			}
			//验证是否已经上图
			var reFlag = MapToobar.checkIsChart(entity.type, entity, true);
				entity.width = iw;
				entity.height = ih;
				//entity.layerName = layerName.markerLayer;
				entity.layerName = layerName.vectorGBLayer;
				entity.action = "click";
				//注册事件
				if((entity.type == 1 || entity.type == 1.1) && gaCount > 1){
					if(gaCount > 50){
						entity.iconUrl = MapHandler.getImgUrl(1000.1);
					}
					entity.callback = MapToobar.gatherDetailInfo;
					entity.isTitle = true;
				}else{
					if(MapManager.getZoom() >= gbChartShowTitleLevel){ //注意：gbChartShowTitleLevel为系统统一设置
	    				entity.isTitle = true;
	    			}else{
	    				entity.isTitle = false;
	    			}
	    			entity.callback = MapToobar.openInfoWindow;
	    			var isShare = entity.detailInfo.isShare;//是否重点标识
	    			//天网是否被选择
					entity.isSelect = ResourceDatas.GBSelected[entity.id] ? true : false;
	    			if(entity.isSelect == true){
	    				entity.iconUrl = MapHandler.getImgUrl(1.11);
	    			}else if(isShare == true){
	    				entity.iconUrl = MapHandler.getImgUrl(1.12);
	    			}else{
	    				entity.iconUrl = null;
	    			}
				}
				MapManager.doResourceChart(entity);
		}

		if(resourceFeatureDatas.GBFeatures.length > 0){
			MapHandler.createAllFeature(resourceFeatureDatas.GBFeatures,layerName.vectorGBLayer);
		}

		if(isArray){
			if(type == 1.1 || type == "1.1") type = 1;
			ResourceDatas.gatherDatas[type] = resData;
		}
		//计算上图资源的个数
		try{
			countResChart(1.1);
		}catch(e){}
	},
	/**
	 * 生成聚合点下 所聚合的所有点
	 */
	gatherDetailInfo: function(en){
		//向下平移 ，注意：mapMaxZoomToLevel、mapGatherZoomToLevel为系统统一设置
		var gotoZoom = MapManager.getZoom() + mapGatherZoomToLevel;
		if(gotoZoom > mapMaxZoomToLevel) gotoZoom = MapManager.getZoom() + 1;
		MapManager.zoomTo(gotoZoom);
		MapManager.setCenter(en);
		return;

		//1.6 此方法不执行
		/*if(MapVesion == "PGIS_1.6"){
			return;
		}*/
		var keyValue = en.id + "-" + MapManager.getZoom();
		if(en.type == 1.1){
			keyValue = en.naming + "-" + MapManager.getZoom();
		}
		var rtype = en.type == 1.1 ? 1 : en.type;
		if(en.naming && ResourceDatas.gbGatherDatas && ResourceDatas.gbGatherDatas[rtype]){
			var ens = ResourceDatas.gbGatherDatas[rtype][keyValue];
			//判断是否存在聚合明细点
			if(ens){//存在，则删除原有的基础点
				//清除vector上图
				MapToobar.clearVectorLayer(layerName.vectorGBLayer);
				resourceFeatureDatas.GBFeatures.length =0;
			}else{//不存在，则返回
				return;
			}

			//遍历，生成聚合明细点
			for(var i in ens){
				if(i instanceof Function) continue;
				var entity = ens[i];
				entity.height = 21;
				entity.width = 20;
				entity.layerName = layerName.markerLayer;
				entity.action = "click";
    			entity.callback = MapToobar.openInfoWindow;
    			entity.type = parseInt(entity.type)+ 0.1;
    			entity.des = null;
    			entity.isTitle = false;
    			//天网是否被选择
    			entity.isSelect = ResourceDatas.GBSelected[entity.id] ? true : false;
    			if(entity.isSelect == true){
    				entity.iconUrl = MapHandler.getImgUrl(1000.1);
    			}else{
    				entity.iconUrl = null;
    			}
    			if(MapManager.getZoom() > 11){
    				entity.isTitle = true;
    			}else{
    				entity.isTitle = false;
    			}
    			//上图
				MapManager.doResourceChart(entity);
			}
			if(resourceFeatureDatas.GBFeatures.length > 0){
				MapHandler.createAllFeature(resourceFeatureDatas.GBFeatures,layerName.vectorGBLayer);
			}
		}
	},

	/**
	 * 清除对应资源
	 */
	clearChartResource: function(type){
		//清除已上图的天网资源
		var den = new MapEntity();
		den.type = type;
		den.layerName = layerName.markerLayer;
		var delResData = MapManager.clearResourceChartByType(den);
		for(var d = 0; delResData && d < delResData.length ; d++){
			var del = delResData[d];
			if(del && del.attributes.entity) MapToobar.checkIsChart(type, del.attributes.entity, false);
		}
	},
	/**
	 * 清除人员、车辆、天网、社会点位高亮图标
	 */
	clearResourceChartByHight: function(type){
		var higen=new MapEntity();
		higen.type="hight"+type;
		higen.layerName=layerName.vectorMarkerLayer;
		MapManager.clearOverlayByType(higen);
	},
	/**
	 * 清除人员、车辆、天网、社会点位高亮图标
	 */
	clearResourceHightByIdType: function(en){
		var higen=new MapEntity();
		higen.id=en.id;
		higen.type="hight"+en.type;
		higen.layerName=layerName.vectorMarkerLayer;

		MapManager.clearOverlayByIdType(higen);
	},
	/**
	 * 清除VectorMarker所有数据
	 * @param en.id 资源id 唯一标识
	 * @param en.type 资源类型
	 * @param en.layerName 资源图层
	 */
	clearVectorMarkersByIdType:function(en){
		var type = en.type;
		//删除marker高亮要素
		 en.type="hight"+en.type;
		 MapManager.clearOverlayByIdType(en);
		 en.type=type;
		 //删除原图marker
		 MapManager.clearOverlayByIdType(en);
	},
	/**
	 * 清除VectorMarker所有数据
	 * @param en.type 资源类型
	 * @param en.layerName 资源图层
	 */
	clearVectorMarkersByType:function(en){
		var type = en.type;
		//删除marker高亮要素
		 en.type="hight"+en.type;
		 MapManager.clearOverlayByType(en);
		 en.type=type;
		 //删除原图marker
		 MapManager.clearOverlayByType(en);
	},
	/**
	 * 清除VectorMarker 高亮对象
	 * @param en.type 资源类型
	 * @param en.layerName 资源图层
	 */
	clearVectorMarkerHight:function(en){

	},
	/**
	 * 清除VectorMarker 原型对象
	 * @param en.type 资源类型
	 * @param en.layerName 资源图层
	 */
	clearVectorMarkerProByIdType:function(en){
		return MapManager.clearOverlayByIdType(en);
	},
	/**
	 * 删除整个图层
	 * @param layerName 图层名称
	 */
	clearVectorLayer:function(layerName){
		//20170601 nishaodong 整合到公用对象
//		var lay = MapHandler.getVectorLayerByName(layerName);
//		lay.removeAllFeatures();
//		lay.refresh();
		MapManager.clearOverlays({layerName:layerName});
	},
	/**
	 * 获取资源按钮的 状态
	 * @param type 资源类型
	 * return true：按钮按下状态；false:复原状态
	 */
	 chartTbStatusByType: function(type){
		   var curStatus = false;
		   try{

			   // $(".ty-more-right-now").each(function(){
				//   if($(this).attr("value") == type){
				// 	  curStatus = true;
				//   }
			   // });
			   // if(curStatus == true){
				   if($("#chartDiv").find("img[chartType='"+type+"']").attr("src").indexOf("click") == -1)
						curStatus = false; //获取机构资源上图图标按钮状态
					else{
						curStatus = true; //获取机构资源上图图标按钮状态
					}
			   // }
		   }catch(e){curStatus = null;}
		   return curStatus;
	 },
	 /**
	 *	处置人员去重
	 *	@param dats 数据源
	 */
	 OperatePoliceRept: function(datas){
		var isExitObj = {},policeList = [];
    	for(var i = 0; i < datas.length; i++){
    		var pId = datas[i].id;
    		if(!isExitObj[pId]){
    			isExitObj[pId] = datas[i];
    			policeList.push(datas[i]);
    		}
    	}
    	return policeList;
	},
	 /**
	  * 给警员警车去重
	  */
	 getNoRepeatDatas:function(datas,type){
		 var len = datas.length;
		 /*********************针对人员和车辆，去掉重复的数据，但是需合并责任网格数据********start***********/
		var reBuildDatas = [];
		if(type == 4 || type == 5) {
			var existDatas = [];
			for(var i = 0; i < len ; i ++){
				var rdata = datas[i];
				var repeat = false;
				for(var j=0;j<existDatas.length;j++){
					if(rdata.id == existDatas[j]){
						repeat = true;
						break;
					}
				}
				if(repeat == true) continue;

				var areaInfo = [];
				for(var j = 0; j < len; j ++){
					if(rdata.id == datas[j].id){
						if(datas[j].areaInfo && datas[j].areaInfo.length > 0){
							var isExitArea = false;
							for(var a = 0; a < areaInfo.length; a ++){
								if(areaInfo[a].id == datas[j].areaInfo[0].id){
									isExitArea = true;
									break;
								}
							}
							if(isExitArea == false) areaInfo.push(datas[j].areaInfo[0]);
						}
					}
				}
				rdata.areaInfo = areaInfo;
				if(type == 4){
					if(rdata.typeId == 1 || rdata.typeId==2 || rdata.typeId==3
							|| rdata.typeId==6){
						existDatas.push(rdata.id);
						reBuildDatas.push(rdata);
					}
					}else{
						existDatas.push(rdata.id);
						reBuildDatas.push(rdata);
					}
			}
			datas = reBuildDatas;
		}
		return datas;
	 },
	 /**
	  * 根据 设备id，查询视频，并播放
	  * @param deviceId 设备id
	  */
	 playVideoByDeviceId: function(deviceId){
		 if(deviceId == undefined){
			 return;
		 }
		 $.ajax({
		   		url:basePath + "alarmDevice/queryDeviceVideosByDeviceId.do",
		   		type:"post",
		   		dataType:"json",
		   		data: {"alarmDeviceId": deviceId},
		   		success:function(msg){
		   			if(msg.code == 200){
		   				if(!msg.data || msg.data.length == 0){
                            kendo.message("设备已被删除");
		   					return;
		   				}
		   				$.each(msg.data,function(){
	   						ListManager.playVideoForMap({
								name: this.gbDeviceName,
								naming: this.naming,
								naming1: this.naming1
							});
							//绑定naming与事件id关系
							AlarmDeviceManager.EventResource[this.naming] = deviceId;
						});
		   			}
		   		}
		   	});
	 }
}

//20170601 nishaodong 从超图中剥离出来的业务方法 start
/**
 * 获取当前机构的报备信息
 * @param callback
 */
var getDutyPolicesByCode = function(orgCode,callback){
	$.ajax({
		url:basePath + MapResourceUrl.getPolices,
		type:"post",
		dataType: "json",
		data: {
			organCode:orgCode,
			isQueryOnline: false,
			isSubOrg : 2
		},
		success:function(msg){
			if(msg.code == 200){
				 var leaderNames = "",dutyNames = "",members = "" ,dutyLeaders = "";
				 $.each(msg.data,function(){
					 if(this.areaInfo && this.areaInfo.length > 0){
						 //带班领导  type
						 if(leaderType.indexOf(this.data.typeId) > -1){
							 leaderNames += this.data.name + " (站长)" + "、";
						 }
						 //值班民警type
						 if(dutyType.indexOf(this.data.typeId) > -1){
							 dutyNames += this.data.name + " (民警)" + "、";
						 }
						 //队员 type
						 if(membersType.indexOf(this.data.typeId) > -1){
							 members += this.data.name + "、";
						 }
					 }
				 });
				 dutyLeaders = leaderNames + dutyNames;
				 if(callback && typeof callback === "function"){
					 callback({leaderNames:leaderNames,dutyNames:dutyNames,members:members,dutyLeaders:dutyLeaders});
				 }
			}
		}
	});
}

/**
 * 获取本地资源信息框展示数据
 */
function buildTitleInfo(en) {
	var currentEntity = en;
	var info = currentEntity.detailInfo;
	if (!info)
		return;

	// 时间格式化
	function formatTime(time) {
		var times = time.split(" ");
		var hs = times[1].substring(0, times[1].lastIndexOf(":"));
		return hs;
	}

	var c = "", s = new Object();
	c += "<div id='map_clickinfo_essential_info' class='map_clickinfo_info'>";
	//只有110警情中的油气报警人车比重才加滚动条
	if(currentEntity.type == 110&&currentEntity.deviceType == '26'&&currentEntity.jsonContent.alarmtype == "2"){
		c += "<div id='map_clickinfo_essential_info' class='map_clickinfo_info' style='max-height:490px;overflow-x:hidden;overflow-y: scroll;'>";
	}

	if (currentEntity.type == 4 || currentEntity.type == "hight4") {
		c += "<table style='width:300px;height:100px;' id=\"resTable\">";
		var nameStr = currentEntity.name.split(" -")[0];
		s.h = "195px";
		s.w = "205px";
		c += "<tr  height='25px'><td width='100px' align='center'>设备名称：</td> <td >"
				+ nameStr + "</td></tr>";
        c += "<tr  height='25px'><td align='center'>设备编号：</td> <td >"
                        + (info.gpsNumber ? info.gpsNumber : "")  + "</td></tr>";
		c += "<tr height='35px'><td align='center'>类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</td> <td >"
				+ (info.typeName ? info.typeName : "") + "</td></tr>";
		//20170601 nishaodong 修改判断条件
                    //<input style='width:105px;' id='dateOnMap"+info.id+"'/>  2018-10-12 跟换轨迹时间查询
        /*c+="<tr height='40px'><td width='60px' colspan='2'><input id='startDay2' type='text' style='width:117px;' class='k-textbox cg-ri-input cg-ri-area-w-t' />" +
        "--<input id='endDay2' type='text' style='width:117px;' class='k-textbox cg-ri-input cg-ri-area-w-t' /></td></tr>";*/

        // c += "<tr height='30px'> <td colspan='2'><button type='submit' class='btn btn-primary pull-right margin-r-5'> 轨迹查询</button>" ;
        // c+="</td></tr>";

	}
	c += "</table></div>";
	if (en.type != 1) {
		c += "</div>";
	}
	return c;
}

/**
 * 服务端资源接口信息
 */
var MapResourceUrl = {
		/*获取警员数据*/
		getPolices: "/emergency/getGpslist"
};
var ysPoup = function(obj,num){
	$(obj).parent().find("span").removeClass("current");
	$(obj).addClass("current");
	if(num == 1){
		$("#duty-ys-box").removeClass("hidden");
		$("#summary-ys-box").addClass("hidden");
	}else{
		$("#duty-ys-box").addClass("hidden");
		$("#summary-ys-box").removeClass("hidden");
	}
}

/*function noImg(obj){
	$(obj).css({"width":"0","height":0});
}
*/
/**
 * 地图其他资源上图图标
 * @param type 类型
 */
MapHandler.getImgUrl=function(type,flag){
    var ipath = basePath+"images/map/images/cluster1.png";
    if(type == 1.2){
    	ipath = basePath+"images/res/map1.2.png";
    }else if(type == 1.1 || type == 1){
		ipath = basePath+"images/res/tw.png";
	}else if(type == 1.11){ //天网被选中
		ipath = basePath+"images/res/tw_gl.png";
	}else if(type == 1.12){//重点标识
		ipath = basePath+"images/res/tw_zd.png";
	}
	else if(type == 1.13){
		ipath = basePath+"images/res/tw.png";
	}
	else if(type == 1.14){
		ipath = basePath+"images/res/tw_gl.png";
	}
    //社会点位
	else if(type == 1.2){
		ipath = basePath+"images/res/map1.2.png";
	}
	else if(type == 1.21){
		ipath = basePath+"images/res/map1.2anxia.png";
	}
	else if(type == 1.22){
		ipath = basePath+"images/res/ZDmap1.2.png";
	}
	else if(type==100){//警情
		ipath =  basePath+"images/images/location.png";
	}
	else if(type==101){//电话
		ipath =  basePath+"images/images/NormalCase/TelLocationOnMap.png";
	}
	else if(type==102){//杆体
		ipath =  basePath+"images/images/NormalCase/poleLocationOnMap.png";
	}else if(type==1000){//聚合使用
		ipath =  basePath+"uploadIcon/gather.png";
	}else if(type==1000.1){//聚合使用
		ipath =  basePath+"uploadIcon/cluster1.png";
	}else if(type== "加油站_1@chengdu.1"){//加油站
		ipath =  basePath+"images/map/images/res/jyz.png";
	}else if(type == 200.1){//资源标注图标
		ipath =  basePath+"images/res/resLocation.png";
		if(flag == true){//高亮图标
			ipath =  basePath+"images/res/resLocationClick.png";
		}
	}else if(type == 200){//资源类型默认上图图标
		ipath =  basePath+"images/res/resTypeDefault.png";
	}

	else if(type == 1.5){
		ipath = basePath+"images/images/device/1.png";
	}else if(type == 1.51){ //天网被已修改
		ipath = basePath+"images/images/device/2.png";
	}else if(type == 1.52){ //天网重点点位
		ipath =  basePath+"images/images/device/3.png";
	}else if(type == 1.53){ //社会点位
		ipath = basePath+"images/images/device/1.1.png";
	}else if(type == 1.54){ //社会点位已修改
		ipath =  basePath+"images/images/device/2.1.png";
	}else if(type == 1.55){ //社会点位重点点位
		ipath =  basePath+"images/images/device/3.1.png";
	}else if(type == 1.56){ //天网已分组
		ipath =  basePath+"images/images/device/4.png";
	}else if(type == 1.561){ //社会点位已分组
		ipath =  basePath+"images/images/device/4.1.png";
	}else if(type == 1.57){ //天网选中
		ipath =  basePath+"images/images/device/5.png";
	}else if(type == 1.571){ //社会点位选中
		ipath =  basePath+"images/images/device/5.1.png";
	}
	else if(type == 5.2){
        ipath =  basePath+"images/res/lb_jwz.png";
    }
	else if(type == 5.21){ //报警设备 警务站图标
		ipath =  basePath+"images/res/lb_jwz.png";
	}
	else if(type == 5.22){ //报警设备 商铺图标
		ipath =  basePath+"images/res/lb_sp.png";
	}else if(type == 5.23){//报警设备地图默认图标
		ipath =  basePath+"images/res/deviceType3.png";
	}else if(type == 5.26){//报警设备地图默认图标
		ipath =  basePath+"images/res/deviceNo.png";
	}else if(type == 5.24){//报警设备r图高亮图标
		ipath =  basePath+"images/res/deviceHigh.png";
	}
    else if(type == 5.211){ //报警设备 警务站图标
        ipath =  basePath+"images/res/deviceType1.png";
    }
    else if(type == 5.222){ //报警设备 商铺图标
        ipath =  basePath+"images/res/deviceType2.png";
    }else if(type == 5.233){//报警设备地图默认图标
        ipath =  basePath+"images/res/deviceType3.png";
    }else if(type == 5.255){//报警设备地图默认图标
        // ipath =  basePath+"images/res/deviceNo.png";
        ipath =  basePath+"images/res/deviceType5.png";
    }else if(type == 5.244){//报警设备r图高亮图标
        ipath =  basePath+"images/res/deviceType4.png";
    }


    else if(type == 5.2101){ //报警设备 警务站图标
        ipath =  basePath+"images/res/deviceType01.png";
    }
    else if(type == 5.2202){ //报警设备 商铺图标
        ipath =  basePath+"images/res/deviceType02.png";
    }else if(type == 5.2303){//报警设备地图默认图标
        ipath =  basePath+"images/res/deviceType03.png";
    }else if(type == 5.2505){//报警设备地图默认图标
        // ipath =  basePath+"images/res/deviceNo.png";
        ipath =  basePath+"images/res/deviceType05.png";
    }else if(type == 5.2404){//报警设备r图高亮图标
        ipath =  basePath+"images/res/deviceType04.png";
    }

	else if(type == 5.1){//警务站默认上图
		ipath =  basePath+"images/res/jwz.png";
	}
	else if(type == 5.11){//警务站默认高亮
		ipath =  basePath+"images/res/jwz_high.png";
	}

	else if(type == 4.01){//人员默认上图
		ipath =  basePath+"images/res/city.png";
	}else if(type == 4.02){
		ipath =  basePath+"images/res/cityHigh.png";
	}
	else if(type == 4.11){//人员在线图标
		ipath = basePath + "images/res/p_online.png";
	}
	else if(type == 4.12){//人员不在线图标
		ipath = basePath + "images/res/p_offline.png";
	}
	else if(type == 4.13){//人员未报备图标
		ipath = basePath + "images/res/p_noduty.png";
	}else if(type ==10001 ){
        ipath = basePath + "images/res/intercom.png";
	}else if(type ==10002 ){
        ipath = basePath + "images/res/intercom.png";
	}else if(type ==5.0 ){//车辆上图
        ipath = basePath + "images/res/vehicle04.png";
	}
    return ipath;
}

//视频播放
function playVideo2()
{
  $("#playVideo2").empty().kendoWindow({
	width: "620px",
	height: "520px",
	title: "视频播放",
	content: "../playerVideo2.html?ran="+Math.random(),
	position:{top:"25%",left:"30%"},
	iframe : true
  }).data("kendoWindow").open();
}

//视频播放
function playVideo3()
{
  $("#playVideo3").empty().kendoWindow({
	width: "620px",
	height: "520px",
	title: "视频播放",
	content: "../playerVideo3.html?ran="+Math.random(),
	position:{top:"25%",left:"60%"},
	iframe : true
  }).data("kendoWindow").open();
}
//20170601 nishaodong 从超图中剥离出来的业务方法 end
/**
 * 警情图片点击显示大图片
 */
function alarmImgShowBigOnly(obj){
 	$("#imagesPanel").show();
 	$("#cgPhoto ul").html("");
 	var picUrl = obj.src;
 	$("#alarmImgShow").removeClass("hidden");
 	
 	var width = obj.naturalWidth;
 	var height = obj.naturalHeight;
 	
 	var winWidth = 0;
 	var winHeight = 0;
 	 //获取窗口宽度
 	if (window.innerWidth)
 	winWidth = window.innerWidth;
 	else if ((document.body) && (document.body.clientWidth))
 	winWidth = document.body.clientWidth;
 	//获取窗口高度
 	if (window.innerHeight)
 	winHeight = window.innerHeight;
 	else if ((document.body) && (document.body.clientHeight))
 	winHeight = document.body.clientHeight;
 	var leftDiv = (winWidth-800)/2;
 	var topDiv = (winHeight-667)/2;
 	
 	$("#alarmImgShow img").attr("src", picUrl);
 	$("#imagesPanel").css("z-index","100100");
 	$("#alarmImgShow").css({"z-index":"100100","left":leftDiv+"px","top":topDiv+"px","width":"800px","max-height":"800px","text-align":"center","background-color":"rgba(16, 14, 15, 0.77)"});
    if(width > height){
    	$("#alarmImgShow img").css("width","100%");
    	$("#alarmImgShow img").css("height","initial");
    	var hgt = $("#alarmImgShow img").height();
    	var tohgt = $("#alarmImgShow").height();
    	var top = (tohgt-hgt)/2;
    	$("#alarmImgShow img").css("padding-top",top+"px");
    	
    }else{
    	$("#alarmImgShow img").css("padding-top","0px");
    	$("#alarmImgShow img").css("width","initial");
    	$("#alarmImgShow img").css("height","100%");
    	//宽度居中
    }
    $('#imagesPanel .xj-left-panel').hide();
    $('#imagesPanel').removeClass('xj-left-tab');
}

/*
	重点车辆单独大图片
*/
 function alarmImgShowBigKey(obj){
  $("#imagesPanel").show();
  $("#cgPhoto ul").html("");
  var picUrl = obj.src;
  $("#alarmImgShowKey").removeClass("hidden");
  
  var width = obj.naturalWidth;
  var height = obj.naturalHeight;
  
  var winWidth = 0;
  var winHeight = 0;
   //获取窗口宽度
  if (window.innerWidth)
  winWidth = window.innerWidth;
  else if ((document.body) && (document.body.clientWidth))
  winWidth = document.body.clientWidth;
  //获取窗口高度
  if (window.innerHeight)
  winHeight = window.innerHeight;
  else if ((document.body) && (document.body.clientHeight))
  winHeight = document.body.clientHeight;
  var leftDiv = (winWidth-800)/2;
  var topDiv = (winHeight-667)/2;
  
  $("#alarmImgShowKey img").attr("src", picUrl);
  $("#imagesPanel").css("z-index","100100");
  $("#alarmImgShowKey").css({"z-index":"100100","left":"2.5%","width":"100%","height":"100%","text-align":"center","background-color":"rgba(16, 14, 15, 0.77)"});
    if(width > height){
      $("#alarmImgShowKey img").css("width","100%");
      $("#alarmImgShowKey img").css("height","initial");
      var hgt = $("#alarmImgShowKey img").height();
      var tohgt = $("#alarmImgShowKey").height();
      //var top = (tohgt-hgt)/2;
    //  $("#alarmImgShow img").css("padding-top","5%");
      
    }else{
      $("#alarmImgShowKey img").css("padding-top","0px");
      $("#alarmImgShowKey img").css("width","100%");
      $("#alarmImgShowKey img").css("height","100%");
      //宽度居中
    }
    $('#imagesPanel .xj-left-panel').hide();
    $('#imagesPanel').removeClass('xj-left-tab');
      }

    function policeROnMap(entity){
		var gpsPolice = ResourceDatas.gpsResDatas[4];
		var onlinePolice = [];
		var p1= {lat:entity.latitude,lon:entity.longitude};
		var p2 = {};


		if(gpsPolice !=null){
            for (var item in gpsPolice){
                var tt = gpsPolice[item];
                if(tt.isOnLine){
                    p2.lat = tt.latitude;
                    p2.lon = tt.longitude;
                    // var  mm = MapManager.measuringDistance(p1,p2,'m');
                    var  mm =  mapDistance.getDistance(entity.longitude,entity.latitude,tt.longitude,tt.latitude);
                    if(systemConfigData.police_M_on_map >= mm ){
                    	var entity = new MapEntity(gpsPolice[item]);
                    	entity.iconUrl = gpsPolice[item].iconUrlHigh;
                        onlinePolice.push(entity);
                        MapManager.clearOverlayByIdType(entity);
                    }

				}

            }
		}

        MapToobar.doResourceChart(onlinePolice, layerName.policeLayer);

	}


/**
 * 地图距离计算
 * @type {{OD: mapDistance.OD, SD: mapDistance.SD, getDistance: mapDistance.getDistance}}
 */
var mapDistance = {
        OD :function (a, b, c) {
			while (a > c) a -= c - b;
			while (a < b) a += c - b;
			return a;
		},
        SD :function (a, b, c) {
			b != null && (a = Math.max(a, b));
			c != null && (a = Math.min(a, c));
			return a;
		},
    /**
	 *
     * @param a_lat  经度
     * @param a_lng  纬度
     * @param b_lat  经度
     * @param b_lng  纬度
     * @returns {number}
     */
        getDistance:function (a_lat,a_lng,b_lat,b_lng) {
			var a = Math.PI * mapDistance.OD(a_lat, -180, 180) / 180;
			var b = Math.PI * mapDistance.OD(b_lat, -180, 180) / 180;
			var c = Math.PI * mapDistance.SD(a_lng, -74, 74) / 180;
			var d = Math.PI * mapDistance.SD(b_lng, -74, 74) / 180;
			return 6370996.81 * Math.acos(Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(b-a));
		}
	};


/**
 * 实体类 （卡口、卡点、天网、警员、警车 等等）
 * @param entity 实体属性参数
 * @returns
 */
function MapEntity(entity){
	if(entity){
		// 类型, 1：天网、2： 卡口、 3：卡点、4：警员:5：警车、6：巡区:、7：社区、8：辖区
		this.type = entity.type;
		//显示类型
		this.showType = entity.showType;
		//标识id
		this.id = entity.id;
		//名称
		this.name = entity.name;
		//内容描述
		this.content = entity.content;
		//图片路径
		this.iconUrl = entity.iconUrl;
		//图片宽
		this.width = entity.width;
		//图片高
		this.height = entity.height;
		//纬度
		this.latitude = entity.latitude;
		//经度
		this.longitude = entity.longitude;
		//半径
		this.radius = entity.radius;
		//层级
		this.zoom = entity.zoom;
		//距离
		this.distance = entity.distance;
		//创建时间
		this.createDate = entity.createDate;
		//图层名称
		this.layerName = entity.layerName;
		//样式
		this.style = entity.style;
		//是否显示标题
		this.isTitle = entity.isTitle;
		//title样式
		this.titleStyle = entity.titleStyle;
		//点坐标数据(数组，格式:[[113,19],[107,-2],[92,13],[90,21],[82,12]])
		this.pointDatas = entity.pointDatas;
		//备注说明
		this.des = entity.des;
		//是否有效，是否工作
		this.isWork = entity.isWork;
		//是否被选择
		this.isSelect = entity.isSelect;
		//是否在线
		this.isOnLine = entity.isOnLine
		// 其他属性信息(对象)
		this.detailInfo = entity.detailInfo;
		//操作的目标对象
		this.targetObj = entity.targetObj;
		//事件类型："click"点击事件；"dbclick"双击事件
		this.action = entity.action;
		//回调函数
		this.callback = entity.callback;
		//失败的回调函数
		this.failCallback = entity.failCallback;
		// 参数集合（一般为数组）
		this.params = entity.params;
	}

	this.setType = function(type){
		this.type = type;
	};
	this.setId = function(id){
		this.id = id;
	};
	this.setName = function(name){
		this.name = name;
	};
	this.setContent = function(content){
		this.content = content;
	};
	this.setIconUrl = function(iconUrl){
		this.iconUrl = iconUrl;
	};
	this.setWidth = function(width){
		this.width = width;
	};
	this.setHeight = function(height){
		this.height = height;
	};
	this.setLatitude = function(lat){
		this.latitude = lat;
	};
	this.setLongitude = function(lon){
		this.longitude = lon;
	};
	this.setStyle = function(sty){
		this.style = sty;
	};
	this.setPointDatas = function(pointDatas){
		this.pointDatas = pointDatas;
	};
	this.setDes = function(des){
		this.des = des;
	};
	this.setCreateDate = function(createDate){
		this.createDate = createDate;
	};
	this.setDetailInfo = function(dInfo){
		this.detailInfo = dInfo;
	};
}

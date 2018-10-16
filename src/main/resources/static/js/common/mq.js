/**
 * mq 业务对象
 */
var subscribes = [];
var subscribesCallback = new Array();
var MqManager = {
	client : null,
	isConnect : false,
	/* MQ推送使用的url */
	setMqUrl : function(mUrl) {
		mqUrl = mUrl
	},
	/* MQ的用户名 */
	setMqUserName : function(mUserName) {
		mqUserName = mUserName
	},
	/* MQ的密码 */
	setMqPassword : function(mPassword) {
		mqPassword = mPassword
	},
	/**
	 * 请求mq
	 * 
	 * @param sub
	 * @param callback
	 */
	initMq : function(subscribe, callback) {
		if (callback && typeof callback === "function"
				&& MqManager.requestMqResource
				&& typeof MqManager.requestMqResource === "function") {
			MqManager.requestMqResource(subscribe, callback);
		}
	},
	/**
	 * gps 上下线业务处理
	 * 
	 * @param datas
	 */
	mqGpsCompleteCallBack : function(datas) {
		console.log('gps收到mq推送的数据:' + datas);
		if (!datas)
			return;
		var data = datas.split("|");
		if (data.length == 1) {
			// down
			return;
		} else {// up
			MqManager.bulidPoliceAndCar(datas);
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
			MqManager.dobulidPoliceAndCar(datas);
		},500);
	},
	/**
	 * 解析MQ推送的GPS数据
	 * @param datas
	 */
	dobulidPoliceAndCar: function(datas){
		if(!datas || datas == null) return;
		var gpsId = null, lon,lat;
		var mqDatas = datas.split("|");
		if(mqDatas && mqDatas.length > 6){
			var en = new Object();
			en.id = en.name = mqDatas[1];
			en.longitude = mqDatas[5];
			en.latitude = mqDatas[6];
			en.type = 4;
			en.height = 30;
			en.width = 30;
			MqManager.mqResourceChart(en);
		}
	},
	mqResourceChart: function(entity){
		var type=entity.type;
		var titleName = entity.name;
		 entity.isTitle = true;
		 entity.titleStyle = {
				 name: titleName
		 }
		 //注册事件
		/* entity.action = "click";
		 entity.callback = MapToobar.openInfoWindow;*/

		 MapManager.clearOverlayByIdType(entity);
		 if(entity.type == 4){
   			entity.iconUrl = "http://127.0.0.1:8888/adminlte/dist/img/avatar5.png";
		 }
		 try{
			 MapManager.doResourceChart(entity);
		 }catch(e){}

	},

	/**
	 * 请求MQ的资源数据
	 * 
	 * @param url
	 *            mq服务地址
	 * @param userName
	 *            登录名称
	 * @param password
	 *            登录密码
	 * @param subscribe
	 *            标识
	 * @param callBack
	 *            回调函数
	 */
	requestMqResource : function(subscribe, callBack, url, userName, password) {
		/** ************初始值处理**start************ */
		if (!url)
			url = "http://25.30.9.3:15674/stomp";
		if (!userName)
			userName = "guest";
		if (!password)
			password = "guest";
		if (!subscribe) {
			return;
		}
		/** ************初始值处理**end************ */
		if (!url || url == "")
			return;

		var ws = new SockJS(url);
		var client = Stomp.over(ws);
		// SockJS does not support heart-beat: disable heart-beats
		client.heartbeat.incoming = 0;
		client.heartbeat.outgoing = 0;

		client.debug = function(e) {
			$('#second div').append($("<code>").text(e));
		};

		// default receive callback to get message from temporary queues
		client.onreceive = function(m) {
		}
		var on_connect = function(x) {
			console.log("MQ【", url, "】连接成功");
			id = client.subscribe(subscribe, function(m) {
				// 异步实现获取资源数据
				setTimeout(function() {
					// try{
					callBack(m.body);
					// }catch(e){}
				}, 200);
				console.log("路由【", subscribe, "】连接成功");
			});
		};
		var on_error = function(er) {
			client.disconnect(function() {
				mq_connection_error.count++;
				console.log('mq连接错误(' + url + ')，连接已释放，正在重连...');
			});
			// 错误链接次数超过设定值时，强制刷新界面20170922
			if (mq_connection_error.count > mq_connection_error.alarmNum) {
				window.location.reload();
			}
			// 断网报错时，重新建立连接
			try {
				setTimeout(function() {
					MapHandler.requestMqResource(subscribe, callBack, url,
							userName, password);
				}, 10000);
			} catch (e) {
			}
		};
		try {
			client.connect(userName, password, on_connect, on_error, '/');
		} catch (e) {
			console.log('MQ推送error...');
		}

	}

}

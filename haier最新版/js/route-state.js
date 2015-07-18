/**
 * system-setting相关js
 * @author renwei
 * 
 * @problem  lan口状态还没加，不知道lan1和lan2用返回的哪个字段判断
 */
var routeStateIndex = {
		/**
		 * 业务相关集合
		 */
		paramOperate : {
			/**
			 * 频段
			 */
			wifiBand : ['2G', '5G'],
			/**
			 * 业务类型
			 */
			businessServiceType : 'service',
			businessRouterType : 'router',
			businessUpdateType : 'update',
			businessWifiType : 'wifi',
			businessDiskType : 'disk',
			/**
			 * 方法集合
			 */
			method : {
				getTrafficInfo : 'WAN.getTrafficInfo',//获取wan口实时流量
				getIfaceBaseInfo : 'WAN.getIfaceBaseInfo',//获取wan口基本信息
				getWiFiInfo : 'WIFI.getWiFiInfo',//获取wifi配置信息
				resetReboot : 'SYS.Reboot',//重启路由器
				setMacName : 'WIFI.setMacName',//设置mac对应的名称
				getAssocList : 'WIFI.getAssocList',//获取关联station信息
				disk_stat : 'disk_stat'//磁盘信息
					
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			chars.show();
			this.getIfaceBaseInfo();
			for (var i = 0; i < this.paramOperate.wifiBand.length; i++) {
				this.getWifiInfo(this.paramOperate.wifiBand[i]);
			}
			this.getAssocList();
			this.getDiskInfo();
			this.eventList.bindShowStateInfo();
			this.eventList.bindResetRouter();
			this.eventList.bindEnterClick();
			this.eventList.bindWifiDeviceRefresh();
			this.eventList.bindWifiDeviceSetting();
			this.eventList.bindDiskRefresh();
			this.eventList.bindDiskSetting();
		},
		/**
		 * 事件绑定集合
		 */
		eventList : {
			/**
			 * 绑定查看状态详情按钮事件
			 */
			bindShowStateInfo : function() {
				$('.enterbut').click(function(){
					common.functions.loadInfor(2);
					common.functions.headerNow(2);
				});
			},
			/**
			 * 绑定重启路由器按钮事件
			 */
			bindResetRouter : function() {
				$('.routelist').find('a').click(function(){
					if (confirm('是否重启路由器？')) {
						common.showMask('正在重启路由器……');
						callRpc(rpcUrl + routeStateIndex.paramOperate.businessRouterType + token, routeStateIndex.paramOperate.method.resetReboot, null, function(data){
							common.functions.loadInfor(0);
							common.functions.headerNow(0);
							common.hideMask();
						});
						return;
					}
				});
			},
			/**
			 * 绑定修改名称事件
			 */
			bindEnterClick : function() {
				$('.wan_select').on('click', '.enter', function(){
					console.log('修改名称ing');
					routeStateIndex.editNameWithMacaddr(this);
				});
			},
			/**
			 * 绑定无线设备刷新按钮
			 */
			bindWifiDeviceRefresh : function() {
				$('#wifiDeviceRefresh').click(function(){
					routeStateIndex.getAssocList();
				});
			},
			/**
			 * 绑定无线设备设置按钮
			 */
			bindWifiDeviceSetting : function() {
				$('#wifiDeviceSetting').click(function(){
					common.functions.loadInfor(1);
					common.functions.headerNow(1);
				});
			},
			/**
			 * 绑定外接USB设备设置按钮
			 */
			bindDiskSetting : function() {
				$('#diskSetting').click(function(){
					common.functions.loadInfor(1);
					common.functions.headerNow(1);
				});
			},
			/**
			 * 绑定外接USB设备刷新按钮
			 */
			bindDiskRefresh : function() {
				$('#diskRefresh').click(function(){
					routeStateIndex.getDiskInfo();
				});
			}
		},
		/**
		 * 获取wan口基本信息
		 */
		getIfaceBaseInfo : function() {
			callRpc(rpcUrl + this.paramOperate.businessRouterType + token, this.paramOperate.method.getIfaceBaseInfo, null, function(data){
				var wanState = $('.routelist').children().eq(2);
				if (data.connected) {
					wanState.addClass('now');
					wanState.find('p').text('WAN已连接');
				}else {
					wanState.removeClass('now');
					wanState.find('p').text('WAN未连接');
				}
			});
		},
		/**
		 * 获取wifi配置信息
		 */
		getWifiInfo : function(band) {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.getWiFiInfo, band, function(data){
				switch (band) {
				case routeStateIndex.paramOperate.wifiBand[0]:
					var _2GState = $('.routelist').children().eq(4);
					if (data.enable) {
						_2GState.addClass('now');
						_2GState.find('p').text('2G-已开启');
					}else {
						_2GState.removeClass('now');
						_2GState.find('p').text('2G-未开启');
					}
					break;
				case routeStateIndex.paramOperate.wifiBand[1]:
					var _5GState = $('.routelist').children().eq(5);
					if (data.enable) {
						_5GState.addClass('now');
						_5GState.find('p').text('5G-已开启');
					}else {
						_5GState.removeClass('now');
						_5GState.find('p').text('5G-未开启');
					}
					break;
				}
			});
		},
		/**
		 * 修改对应mac的名称
		 */
		editNameWithMacaddr : function(obj) {
			common.showMask('正在修改……');
			var that = $(obj);
			var macaddr = that.prev().val();
			var newName = that.prev().prev().val();
			
			var url = rpcUrl + routeStateIndex.paramOperate.businessWifiType + token;
			var rpc = new jsonrpc.JsonRpc(url);
			var method = routeStateIndex.paramOperate.method.setMacName;
			rpc.call(method, macaddr, newName, function(data) {
				console.log(data);
				common.hideMask();
			});
		},
		/**
		 * 获取关联Station信息列表
		 */
		getAssocList : function() {
			common.showMask();
			callRpc(rpcUrl + routeStateIndex.paramOperate.businessWifiType + token, routeStateIndex.paramOperate.method.getAssocList, null, routeStateIndex.assocListCallBack);
		},
		/**
		 * 获取关联station信息回调
		 */
		assocListCallBack : function(data) {
			if (data.length) {
				var html = document.getElementById('online_device').innerHTML;
				var onlineDevice = $('#device_0');
				for (var i = 0; i < data.length; i++) {
					addHtml(onlineDevice, html, data[i]);
				}
				common.hideMask();
			}
		},
		/**
		 * 获取磁盘或USB设备信息
		 */
		getDiskInfo : function() {
			common.showMask();
			callRpcNotId(rpcUrl + routeStateIndex.paramOperate.businessDiskType + token, routeStateIndex.paramOperate.method.disk_stat, null, routeStateIndex.diskInfoCallBack);
		},
		/**
		 * 获取磁盘或USB设备信息回调
		 */
		diskInfoCallBack : function(data) {
			console.log(data);
			if (data.length) {
				var html = document.getElementById('disk_device').innerHTML;
				var diskDevice = $('#device_1');
				for (var i = 0; i < data.length; i++) {
					if (0 != data[i].type && 3 != data[i].type) {
						addHtml(diskDevice, html, data[i]);
					}
				}
			}
			common.hideMask();
		},
		/**
		 * 字节数转换为可读数据
		 * @see kb 字节数
		 */
		convertBytesToReadBytes : function(kb) {
			kb = kb / 1000;
			var unitNum = 1000;//进位
			var unitName = ['KB','MB','GB','TB'];
			var readkb = '0.00' + unitName[0];
			if (kb > 0) {
				if (kb <= unitNum) {//KB
					readkb = kb + unitName[0];
				}else if (kb > 1000 && kb <= Math.pow(unitNum,2)) {//MB
					readkb = (kb/unitNum).toFixed(2) + unitName[1];
				}else if (kb > Math.pow(unitNum,2) && kb <= Math.pow(unitNum,3)) {//GB
					readkb = (kb/(Math.pow(unitNum,2))).toFixed(2) + unitName[2];
				}else if (kb > Math.pow(unitNum,3) && kb <= Math.pow(unitNum,4)) {//TB
					readkb = (kb/(Math.pow(unitNum,3))).toFixed(2) + unitName[3];
				}
			}
			return readkb;
		}
}


/**
 * 追加html
 * @author renwei
 * @param obj
 * @param html
 */
var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm'); //i g m是指分别用于指定区分大小写的匹配、全局匹配和多行匹配。
function addHtml(obj,html,data){
	switch (obj.attr('id')) {
	case 'device_0':
		obj.html(html.replace(reg, function (node, key) { 
			return { 'deviceName': data.host, 'band': (data.band=='2G'?'<icon class="wifi_2_4G"></icon>':'<icon class="wifi_5G"></icon>'), 'macaddr': data.mac}[key]; 
		}));
		break;
	case 'device_1':
		obj.html(html.replace(reg, function (node, key) { 
			return { 'diskName': data.name, 'totalSize': routeStateIndex.convertBytesToReadBytes(data.total), 'useSize': routeStateIndex.convertBytesToReadBytes(data.used), 'diskType': (data.type == 1 ? '硬盘存储' : 'USB存储')}[key]; 
		}));
		break;
	}
}


/**
 * dom加载完成即执行 
 */
$(function(){
	routeStateIndex.init();
});

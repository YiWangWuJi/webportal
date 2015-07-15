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
			/**
			 * 方法集合
			 */
			method : {
				getTrafficInfo : 'WAN.getTrafficInfo',//获取wan口实时流量
				getIfaceBaseInfo : 'WAN.getIfaceBaseInfo',//获取wan口基本信息
				getWiFiInfo : 'WIFI.getWiFiInfo',//获取wifi配置信息
				resetReboot : 'SYS.Reboot',//重启路由器
				setMacName : 'WIFI.setMacName'//设置mac对应的名称
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
			this.eventList.bindShowStateInfo();
			this.eventList.bindResetRouter();
			this.eventList.bindEnterClick();
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
				$('.enter').click(function(){
					routeStateIndex.editNameWithMacaddr(this);
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
		}
}

/**
 * dom加载完成即执行 
 */
$(function(){
	routeStateIndex.init();
});

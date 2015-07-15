/**
 * connectionDevice相关js
 * @author renwei
 */
var connectionDevice = {
		/**
		 * 业务相关集合
		 */
		paramOperate : {
			/**
			 * 业务类型
			 */
			businessWifiType : 'wifi',
			/**
			 * 方法集合
			 */
			method : {
				getAssocList : 'WIFI.getAssocList',//获取关联station信息
				getBlackList : 'WIFI.getBlackList',//获取mac访问黑名单
				addBlackList : 'WIFI.addBlackList',//增加mac访问黑名单
				deleteBlackList : 'WIFI.deleteBlackList'//删除mac访问黑名单
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getAssocList();
			this.getBlackList();
			this.eventList.bindButton();
			this.eventList.bindOnlineAndBlackListRefreshButton();
		},
		/**
		 * 事件绑定集合
		 */
		eventList : {
			/**
			 * 绑定移除/加入黑名单按钮事件
			 */
			bindButton : function() {
				$('.enterbut').click(function(){
					var that = $(this);
					switch (that.attr('name')) {
					case 'yichu':
						var currMac = that.prev().find('dd').eq(1).text().replace('MAC地址：','');
						connectionDevice.addBlackList(currMac);
						break;
					case 'jiaru':
						var currMac = that.prev().prev().find('dd').eq(1).text().replace('MAC地址：','');
						connectionDevice.removeBlackList(currMac);
						break;
					}
				});
			},
			/**
			 * 绑定在线设备/黑名单刷新按钮事件
			 */
			bindOnlineAndBlackListRefreshButton : function() {
				$('#online_black_button').click(function(){
					connectionDevice.getAssocList();                      //获取关联station
					connectionDevice.getBlackList();                      //获取黑名单
				});
			}
		},
		/**
		 * 获取关联Station信息列表
		 */
		getAssocList : function() {
			common.showMask();
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.getAssocList, null, this.assocListCallBack);
		},
		/**
		 * 获取关联station信息回调
		 */
		assocListCallBack : function(data) {
			if (data.length) {
				var html = document.getElementById('online_device').innerHTML;
				var onlineDevice = $('#device_0');
				$('#online_count').text('(' + data.length + ')');
				for (var i = 0; i < data.length; i++) {
					addHtml(onlineDevice, html, data[i]);
				}
				common.hideMask();
			}
		},
		/**
		 * 获取mac访问黑名单
		 */
		getBlackList : function() {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.getBlackList, null, this.blackListCallBack);
		},
		/**
		 * 获取mac访问黑名单回调
		 */
		blackListCallBack : function(data) {
			if (data.length) {
				var html = document.getElementById('black_list').innerHTML;
				var blackList = $('#device_10');
				$('#black_count').text('(' + data.length + ')');
				for (var i = 0; i < data.length; i++) {
					addHtml(blackList, html, data[i]);
				}
			}
		},
		/**
		 * 增加mac访问黑名单
		 */
		addBlackList : function(mac) {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.addBlackList, null, function(data){
				console.log(data);
			});
		},
		/**
		 * 删除mac访问黑名单
		 */
		removeBlackList : function(mac) {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.deleteBlackList, null, function(data){
				console.log(data);
			});
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
			return { 'deviceName': data.host, 'device': '机器（暂写死）', 'ipaddr': data.ip, 'band': (data.band=='2G'?'<icon class="wifi_2_4G"></icon>':'<icon class="wifi_5G"></icon>'), 'macaddr': data.mac}[key]; 
		}));
		break;
	case 'device_10':
		obj.html(html.replace(reg, function (node, key) { 
			return { 'deviceName': data.host, 'macaddr': data.mac}[key]; 
		}));
		break;
	}
}

/**
 * dom加载完成即执行 
 */
$(function(){
	connectionDevice.init();
});

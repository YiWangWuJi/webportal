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
			businessDiskType : 'disk',
			/**
			 * 方法集合
			 */
			method : {
				getAssocList : 'WIFI.getAssocList',//获取关联station信息
				getBlackList : 'WIFI.getBlackList',//获取mac访问黑名单
				addBlackList : 'WIFI.addBlackList',//增加mac访问黑名单
				deleteBlackList : 'WIFI.deleteBlackList',//删除mac访问黑名单
				getHistoryDevList : 'WIFI.getHistoryDevList',//获取历史设备
				disk_stat : 'disk_stat',//磁盘信息
				setMacName : 'WIFI.setMacName',//设置mac对应的名称
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.maskShow = new maskCtrl(4, common.hideMask, common);
			this.getAssocList();
			this.getHistoryDevList();
			this.getBlackList();
			this.getDiskInfo();
			this.eventList.bindButton();
			this.eventList.bindOnlineAndBlackListRefreshButton();
			this.eventList.bindEnterClick();
			this.eventList.bindDiskRefresh();
			//this.eventList.bindAddTimeUnit();

			var refreshFunc = function() {
				if ($('#connecting_device').length == 0) {
					clearInterval(refreshId);
					return;
				}
				connectionDevice.getAssocList();
				connectionDevice.getHistoryDevList();
				connectionDevice.getBlackList();
				connectionDevice.getDiskInfo();
			};

			var refreshId = setInterval(refreshFunc, 5000);
		},
		/**
		 * 事件绑定集合
		 */
		eventList : {
			/**
			 * 绑定移除/加入黑名单按钮事件
			 */
			bindButton : function() {
				$('.wan_select').on('click', '.enterbut', function(){
					var that = $(this);
					switch (that.attr('name')) {
					case 'yichu':
						var currMac = that.prev().find('dd[data-name="mac"]').text().replace('MAC地址：','');
						connectionDevice.removeBlackList(currMac);
						break;
					case 'jiaru':
						var currMac = that.parent().find('dd[data-name="mac"]').text().replace('MAC地址：','');
						connectionDevice.addBlackList(currMac);
						break;
					}
				});
			},
			/**
			 * 绑定在线设备/黑名单刷新按钮事件
			 */
			bindOnlineAndBlackListRefreshButton : function() {
				$('#online_black_button').click(function(){
					connectionDevice.maskShow = new maskCtrl(3, common.hideMask, common);
					connectionDevice.getAssocList();                      //获取关联station
					connectionDevice.getBlackList();                      //获取黑名单
					connectionDevice.getHistoryDevList();                 //获取历史设备
				});
			},
			/**
			 * 绑定修改名称事件
			 */
			bindEnterClick : function() {
				$('.wan_select').on('click', '.enter', function(){
					connectionDevice.editNameWithMacaddr(this);
				});
			},
			/**
			 * 绑定外接USB设备刷新按钮
			 */
			bindDiskRefresh : function() {
				$('#diskRefresh').click(function(){
					connectionDevice.maskShow = new maskCtrl(1, common.hideMask, common);
					connectionDevice.getDiskInfo();
				});
			},
			/**
			 * 绑定添加时间单元按钮
			 */
			bindAddTimeUnit : function() {
				$('.infor').off().on('click', '.addtimeunit', function(count){
					var mac      = $(this).parent().parent().attr("name");
					//console.log(mac);
					var unitList = $(this).parent().prev();
					var count    = unitList.find('div').length; 
					var html     = document.getElementById('parent_ctrl').innerHTML;
					unitList.html(unitList.html() + html);
					unitList.find('div:last span:first').text('时间单元' + count);
				});
			}
		},
		/**
		 * 获取关联Station信息列表
		 */
		getAssocList : function() {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.getAssocList, null, this.assocListCallBack);
		},
		/**
		 * 获取关联station信息回调
		 */
		assocListCallBack : function(data) {
			$('#device_0').html("");
			if (data.length) {
				var html = document.getElementById('online_device').innerHTML;
				var onlineDevice = $('#device_0');
				$('#online_count').text('(' + data.length + ')');
				for (var i = 0; i < data.length; i++) {
					addHtml(onlineDevice, html, data[i]);
				}
			} else { 
				$('#online_count').text('(' + 0 + ')');
			}
			if ((connectionDevice.maskShow != null) && connectionDevice.maskShow)  {
					connectionDevice.maskShow.decRef();      
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
			$('#device_2').html("");
			if (data.length) {
				var html = document.getElementById('black_list').innerHTML;
				var blackList = $('#device_2');
				$('#black_count').text('(' + data.length + ')');
				for (var i = 0; i < data.length; i++) {
					addHtml(blackList, html, data[i]);
				}
			}else {
				$('#black_count').text('(' + 0 + ')');
			}

			if ((connectionDevice.maskShow != null) && connectionDevice.maskShow)  {
					connectionDevice.maskShow.decRef();      
			}

		},
		/**
		 * 增加mac访问黑名单
		 */
		addBlackList : function(mac) {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.addBlackList, mac, function(data){
				if (data) {
					connectionDevice.getAssocList();
					connectionDevice.getBlackList();
				}
			});
		},
		/**
		 * 删除mac访问黑名单
		 */
		removeBlackList : function(mac) {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.deleteBlackList, mac, function(data){
				//console.log(data);
				connectionDevice.getAssocList();
				connectionDevice.getBlackList();
			});
		},
		/**
		 * 获取历史设备数据
		 */
		getHistoryDevList : function() {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.getHistoryDevList, null, this.historyDevListCallBack);
		},
		/**
		 * 历史设备数据回调
		 */
		historyDevListCallBack : function(data) {
			$('#device_1').html("");
			if (data.length) {
				if (data.length) {
					var html = document.getElementById('history_device').innerHTML;
					var historyDevice = $('#device_1');
					$('#history_count').text('(' + data.length + ')');
					for (var i = 0; i < data.length; i++) {
						addHtml(historyDevice, html, data[i]);
					}
				}
			} else {
				$('#history_count').text('(' + 0 + ')');
			}
			if ((connectionDevice.maskShow != null) && connectionDevice.maskShow)  {
					connectionDevice.maskShow.decRef();      
			}
		},
		/**
		 * 获取磁盘或USB设备信息
		 */
		getDiskInfo : function() {
			callRpcNotId(rpcUrl + connectionDevice.paramOperate.businessDiskType + token, connectionDevice.paramOperate.method.disk_stat, null, connectionDevice.diskInfoCallBack);
		},
		/**
		 * 获取磁盘或USB设备信息回调
		 */
		diskInfoCallBack : function(data) {
			$('#disk_list').html("");
			if (data.length) {
				var html = document.getElementById('disk_device').innerHTML;
				var diskDevice = $('#disk_list');
				for (var i = 0; i < data.length; i++) {
					if (0 != data[i].type && 3 != data[i].type) {
						addHtml(diskDevice, html, data[i]);
					}
				}
			}
			
			if ((connectionDevice.maskShow != null) && connectionDevice.maskShow)  {
					connectionDevice.maskShow.decRef();      
			}
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
		},
		/**
		 * 修改对应mac的名称
		 */
		editNameWithMacaddr : function(obj) {
			common.showMask('正在修改……');
			var that = $(obj);
			var newName = that.prev().val();
			var reg_name=/[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/;
			var macAddr = that.parent().next().text().match(reg_name);
			var url = rpcUrl + connectionDevice.paramOperate.businessWifiType + token;
			var rpc = new jsonrpc.JsonRpc(url);
			var method = connectionDevice.paramOperate.method.setMacName;
			rpc.call(method, macAddr[0], newName, function(data) {
				console.log(data);
				common.hideMask();
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
		obj.html(obj.html() + html.replace(reg, function (node, key) { 
			return { 'deviceName': data.host, 'ipaddr': data.ip, 'band': (data.band=='2G'?'<icon class="wifi_2_4G"></icon>':'<icon class="wifi_5G"></icon>'), 'macaddr': data.mac}[key]; 
		}));
		break;
	case 'device_1':
		obj.html(obj.html() + html.replace(reg, function (node, key) { 
			return { 'deviceName': data.name, 'macaddr': data.mac}[key]; 
		}));
		break;
	case 'device_2':
		obj.html(obj.html() + html.replace(reg, function (node, key) { 
			return { 'deviceName': data.host, 'macaddr': data.mac}[key]; 
		}));
		break;
	case 'disk_list':
		obj.html(obj.html() + html.replace(reg, function (node, key) { 
			return { 'diskName': data.name, 'totalSize': connectionDevice.convertBytesToReadBytes(data.total), 'useSize': connectionDevice.convertBytesToReadBytes(data.used), 'diskType': (data.type == 1 ? '硬盘存储' : 'USB存储')}[key]; 
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

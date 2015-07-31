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
			businessRouterType : 'router',
			/**
			 * 方法集合
			 */
			method : {
				getAssocList : 'WIFI.getAssocList',					//获取关联station信息
				getBlackList : 'WIFI.getBlackList',					//获取mac访问黑名单
				addBlackList : 'WIFI.addBlackList',					//增加mac访问黑名单
				deleteBlackList : 'WIFI.deleteBlackList',			//删除mac访问黑名单
				getHistoryDevList : 'WIFI.getHistoryDevList',		//获取历史设备
				disk_stat : 'disk_stat',							//磁盘信息
				setMacName : 'WIFI.setMacName',						//设置mac对应的名称
				getParentalControl : 'QOS.getParentalControl',		//获取家长控制报文
				setParentalControl : 'QOS.setParentalControl'       //设置家长控制
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
//			this.eventList.bindOpenHomeCtrl();

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
			 * 绑定家长设置打开按钮
			 */
			bindOpenHomeCtrl: function(mac) {
//				$('.wan_select').on("click",".home_but",function(){
//					var mac  = $(this).attr("name");
				if($('.home[name="' + mac + '"]').length == 0) {	
					var reg  = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
					var html = document.getElementById("homectrl_device").innerHTML;

					html = html.replace(reg, function(node, key) { 
						return {"macaddr":mac}[key];
					});
					$(".infor").append(html);
					//绑定select选框
					common.events.selectList();
					//绑定家长控制关闭
					connectionDevice.eventList.bindParentControlOff(mac);
					//绑定添加按钮
					connectionDevice.eventList.bindAddtimeunit(mac);
					//绑定保存家长控制单元
					connectionDevice.eventList.bindSaveParentControl(mac);
					//获取已有的控制数据
					connectionDevice.getParentControlByMacAddr();
				}

				common.homeC = true;
				$('.home[name="' + mac + '"]').animate({left:0},400,function(){
					$(".coonent").hide();
					$('.home[name="' + mac + '"]').css("position","static");
				}); 
					

//				});
			},
			/**
			 * 绑定家长控制关闭
			 */
			bindParentControlOff : function(mac) {
				//家长控制关闭
				$('.home[name="' + mac + '"]').on("click", '.home_icon', function(){
					var mac = $(this).parent().parent().parent().attr("name");
					common.homeC = false;
					$(".coonent").show();
					$('.home[name="' + mac + '"]').css("position","absolute").animate({left:"100%"},400,null,function(){
						$('section[name="' + mac + '"]').remove();
					});
				}); 
			},
			/**
			 * 添加时间单元按钮事件
			 */
			bindAddtimeunit : function(mac) {
				//添加时间单元添加按钮事件
				$('.home[name="' + mac + '"]').on('click', '.addtimeunit', function(){
					var mac      = $(this).parent().parent().attr("name");
					var unitList = $(this).parent().prev();
					var count    = unitList.find('> div').length;
					var html     = document.getElementById('parent_ctrl').innerHTML;
					unitList.html(unitList.html() + html);
					unitList.find('> div:last span:first').text('时间单元' + (count + 1));

					unitList.find('> div').find('.radiocheck').off().on("click",function(){
						$(this).toggleClass("selected");
						
						if ($(this).attr('name') == 'everyday'){
							if ($(this).hasClass('selected')) {
								$(this).parent().parent().next().find('.radiocheck').addClass("selected");
							}else {

								$(this).parent().parent().next().find('.radiocheck').removeClass("selected");
							}
						}

						if (($(this).attr('name') == 'monday')  || ($(this).attr('name') == 'tuesday') 
						|| ($(this).attr('name') == 'wednesday')|| ($(this).attr('name') == 'thursday') 
						|| ($(this).attr('name') == 'friday')   || ($(this).attr('name') == 'satday')   
						|| ($(this).attr('name') == 'sunday')){
							 ($(this).parent().parent().find('.selected').length == 7) ?
								$(this).parent().parent().prev().find('.radiocheck').addClass("selected") :
								$(this).parent().parent().prev().find('.radiocheck').removeClass("selected");
						}

						if ($(this).attr('name') == 'wholeday'){
							if ($(this).hasClass('selected')) {
								$(this).parent().parent().next().find('input').css('color','#e0dfdf');
							}else {
								$(this).parent().parent().next().find('input').css('color','#656565');
							}
						}

					});

					unitList.find('> div').find('.up').off().on("click",function(){
						var tval = parseInt($(this).prev().val()) + 1;
						if ($(this).hasClass('hours')) {
							tval = (tval == 24) ? 0:tval;
						}else {
							tval = (tval == 60) ? 0:tval;
						}

						if(tval < 10) {
							tval = '0' + tval.toString();
						}else{
							tval = tval.toString();
						}
						$(this).prev().val(tval);
						$(this).prev().attr('value',tval);
					});

					unitList.find('> div').find('.down').off().on("click",function(){
						var tval = parseInt($(this).prev().prev().val()) - 1;
						if ($(this).hasClass('hours')) {
							tval = (tval < 0) ? 23:tval;
						}else {
							tval = (tval < 0) ? 59:tval;
						}

						if(tval < 10) {
							tval = '0' + tval.toString();
						}else{
							tval = tval.toString();
						}
						$(this).prev().prev().val(tval);
						$(this).prev().prev().attr('value',tval);
					});
				});
			},
			/**
			 * 绑定保存家长控制单元
			 */
			bindSaveParentControl : function(mac) {
				$('.home[name="' + mac + '"]').on('click', '.savetimeunit', function(){
					var controlParam = connectionDevice.disposeParentControlParam(mac,this)();
					callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token, connectionDevice.paramOperate.method.setParentalControl, controlParam, function(data){
						if (data) {
							$('.home_icon').click();
						}else {
							alert('这里是错误提示，我不知道写什么，按需要改吧');
						}
					});
				});
			}
		},
		/**
		 * 收集当前进行家长控制设置的参数
		 */
		disposeParentControlParam : function(mac,obj) {
			var param = [];
			var timeUnits = []; var timeUnit; //这两个我不知道是干嘛用的，没有动
			var length = $(obj).parent().prev().find('> div').length;
			var tmac   = $('.home[name="' + mac + '"]').attr('name');//这个也不知道是干嘛用的，没有动

			for (var i = 0; i < length; i++) {
				var currEnable = true;//这里的enable不知道是在哪获取以及起什么作用，临时写死的
				var tdays = [];
				timeUnit = new Object();
				var unit = $(obj).parent().prev().find('> div')[i];
				var days = $(unit).find(':nth-child(4)').find('.radiocheck');
				for (var j = 0; j < days.length; j++) {
					if ($(days[j]).hasClass('selected')) {
						tdays.push(j + 1);   	
					}
				}
				if ($(unit).find('.radiocheck[name=wholeday]').hasClass('selected')){
					var startTime = '00:00:00';
					var endTime   = '23:59:00';
				}else {
					var times = $(unit).find('div > input');
					var startTime = $(times[0]).val() + ':' + $(times[1]).val() + ':' + '00';
					var endTime   = $(times[2]).val() + ':' + $(times[3]).val() + ':' + '00';
				}
				param.push({macaddr:mac,enable:currEnable,weekdays:tdays,starttime:startTime,endtime:endTime});
			}
			return function(){
				return param;
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
		},
		/**
		 * 获取对应mac的家长控制数据
		 */
		getParentControlByMacAddr : function(macAddr) {
			callRpc(rpcUrl + connectionDevice.paramOperate.businessRouterType + token, connectionDevice.paramOperate.method.getParentalControl, macAddr, connectionDevice.echoParentControl, macAddr);
		},
		/**
		 * 回显对应mac的家长控制数据
		 */
		echoParentControl : function(data,mac) {
			if (data && data.length > 0) {
				var initWeekdays = [1, 2, 3, 4, 5, 6, 7];
				var reg  = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
				var html = document.getElementById("homectrl_device").innerHTML;
				var currSection = $('section[name="' + mac + '"]');
				for (var i in data) {
					html = html.replace(reg, function(node, key) { 
						return {"macaddr":mac}[key];
					});
					$(".infor").append(html);
					
					$('.addtimeunit').click();
					var currData = data[i];
					var currUnitDiv = currSection.find('div[name="timeUnit"]').eq(i);
					//enable不知道往页面的哪里设置，这里没做操作
					
					//回显星期
					var weekLable = currUnitDiv.find(':nth-child(3)');
					if (currData.weekdays.sort().toString() === initWeekdays.sort().toString()) {
						weekLable.find('.radiocheck').addClass('selected');
						weekLable.next().find('radiocheck').each(function(){$(this).addClass('selected')});
					}else {
						for (var z in currData.weekdays) {
							weekLable.eq(currData.weekdays[z] - 1).addClass('selected');
						} 
					}
					//回显时间
					var currStartTime = currData.starttime;
					var currEndTime = currData.endtime;
					if (currStartTime === currEndTime) {
						currUnitDiv.find(':nth-child(6)').find('icon[name="wholeday"]').addClass('selected');
					}else {
						var currStartTimeHour = currStartTime.split(':')[0];   //开始时间小时
						var currStartTimeMin = currStartTime.split(':')[1];	   //开始时间分钟
						var currEndTimeHour = currEndTime.split(':')[0];       //结束时间小时
						var currEndTimeMin = currEndTime.split(':')[1];        //结束时间分钟
						var timeArray = currUnitDiv.find('.time_select').find('div');
						timeArray[0].child('input').val(currStartTimeHour);
						timeArray[1].child('input').val(currStartTimeMin);
						timeArray[2].child('input').val(currEndTimeHour);
						timeArray[3].child('input').val(currEndTimeMin);
					}
				}
			}
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

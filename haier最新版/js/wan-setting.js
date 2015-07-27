/**
 * wan-setting相关js
 * @author renwei
 */
var wanIndex = {
		/**
		 * 业务相关集合
		 */
		paramOperate : {
			/**
			 * 业务类型
			 */
			businessType : 'router',
			/**
			 * 方法集合
			 */
			method : {
				getWanConnectInfo : 'WAN.getConnectInfo',//获取wan连接信息method
				setWanConnectInfo : 'WAN.setConnectInfo',//设置wan连接信息method
				notifyIfaceCreatedInfo : 'WAN.notifyIfaceCreatedInfo',//wan口连接建立通知信息
				notifyIfaceLostInfo : 'WAN.notifyIfaceLostInfo',//wan口连接失败通知信息
				getIfaceBaseInfo : 'WAN.getIfaceBaseInfo',//获取wan口基本信息
				getTrafficInfo : 'WAN.getTrafficInfo',//获取wan口实时流量
				setDnsInfo : 'WAN.setDnsInfo',//设置静态dns配置信息
				getDnsInfo : 'WAN.getDnsInfo'//获取静态dns配置信息
			},
			/**
			 * MTU键值约定
			 * @param dhcp-MTU 本地存储protocol为dhcp时的MTU值所使用的键名称（return number 类型）
			 * @param PPPoE-MTU 本地存储protocol为PPPoE时的MTU值所使用的键名称（return Boolean类型）
			 * @param static-MTU 本地存储protocol为static时的MTU值所使用的键名称（return number类型）
			 */
			MTUNameWithProtocol : ['dhcp-MTU','PPPoE-MTU','static-MTU'],
			/**
			 * MTU默认值（number类型默认1500，Boolean类型默认false）
			 */
			MTUInitVal : [1500,false]
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getWanConnectInfo();
			this.eventList.bindSaveButton();
			this.eventList.bindIpInput();
		},
		/**
		 * 事件绑定集合
		 */
		eventList : {
			/**
			 * 绑定保存按钮点击事件
			 */
			bindSaveButton : function() {
				$('.enterbut').click(function(){
					wanIndex.saveWanConnectInfo(this);
				});
			},
			
			bindIpInput : function() {
				$('#setting_3 .iptext input').keyup(function(){
					wanIndex.checkIpInput(this);
				});
			}
		},
		/**
		 * 检查IP地址输入
		 */
		checkIpInput(obj) {
			if (obj.value.length == obj.maxLength) {
				var ipSection = obj.value;
				if ((ipSection < 0) || (ipSection > 255)) {
					obj.value = "";
					alert("错误的ip地址输入");
					return;
				}
				var inputSet = $('#setting_3 .iptext input');
				var index = inputSet.index(obj);
				if ((index != -1) && (index != (inputSet.size() - 1))) {
					(inputSet.get(index + 1)).focus();
				}
			}
		},

		/**
		 * 获取wan连接信息
		 */
		getWanConnectInfo : function() {
			//这里需要加等待效果
			common.showMask();
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getWanConnectInfo, null, this.wanConnectInfoCallBack);
		},
		/**
		 * wan获取连接信息回调
		 */
		wanConnectInfoCallBack : function(data) {
			wanIndex.echoWanConnectInfo(data);
		},
		/**
		 * 回显wan连接信息
		 */
		echoWanConnectInfo : function(data) {
			console.log(data);
			var index;
			switch (data.protocol) {
			case 'dhcp':
				index = 1;
				$('#setting_' + index + ' input[name="mtu"]').val(data.info.mtu);//回显MTU
				//获取对应protocol为dhcp的wan口基本信息
				wanIndex.getIfaceBaseInfo([{protocol:data.protocol}],function(returnData){
					$('#dhcp_id').text(returnData.ipaddr);
					$('#dhcp_gateway').text(returnData.gwaddr);
					$('#dhcp_mask').text("255.255.255.0"); //--TODO wait 邦天`
					common.hideMask();
				});
				break;
			case 'pppoe':
				index = 2;
				$('#setting_' + index + ' input[name="userName"]').val(data.info.username);
				$('#setting_' + index + ' input[name="password"]').val(data.info.password);
				switch (data.info.mode) {
				case 'always':
					$('#connect_mode').find('h3').html($('#auto_con').text() + '<icon></icon>');
					break;
				case 'manual':
					$('#connect_mode').find('h3').html($('#manual_con').text() + '<icon></icon>');
					break;
				case 'demand':
					$('#connect_mode').find('h3').html($('#need_con').text() + '<icon></icon>');
					$('input[name="idletime"]').val(data.info.idletime);
					$("#idle_time").css('display','inline');
					break;
				}
				var mtu  = data.info.mtu;
				console.log(mtu);
				//TODO-- wait 邦天提供正确的接口
				//mtu ? $('#pppoe_mtu').removeClass('selected') : $('#pppoe_mtu').addClass('selected');//回显MTU
				//获取对应protocol为PPPoE的wan口基本信息
				wanIndex.getIfaceBaseInfo([{protocol:data.protocol}],function(returnData){
					common.hideMask();
				});
				break;
			case 'static':
				index = 3;
				var ipArray = data.info.ip.split('.');
				var netMaskArray = data.info.netmask.split('.');
				var gateWayArray = data.info.gateway.split('.');
				var ipInputArray = $('#ip_li').find('input');
				var netMaskInputArray = $('#netmask_li').find('input');
				var gateWayInputArray = $('#gateway_li').find('input');
				for (var i = 0; i < ipArray.length; i++) {
					$(ipInputArray[i]).val(ipArray[i]);
					$(netMaskInputArray[i]).val(netMaskArray[i]);
					$(gateWayInputArray[i]).val(gateWayArray[i]);
				}

				var dynamicDnsArray = data.info.dns.split(' ');
				for (i = 0; i < 2; i++) {
					if (dynamicDnsArray[i]) {
						var dynamicDnsElementArray = dynamicDnsArray[i].split('.');
						for (var z = 0; z < dynamicDnsElementArray.length; z++) {
							$('#static' + i + '_dns' + z).val(dynamicDnsElementArray[z]);
						}
					}
				}

				$('#setting_' + index + ' input[name="mtu"]').val(data.info.mtu);//回显MTU
				//获取对应protocol为static的wan口基本信息
				wanIndex.getIfaceBaseInfo([{protocol:data.protocol}],function(returnData){
					common.hideMask();
				});
				break;
			case 'wirelessRelay'://临时模拟写的，文档里面没有
				index = 4;
				common.hideMask();
				break;
			}
			var wanSetting = $('#setting_' + index);
			$('.radio_list').find(".radio").removeClass("selected");
			$('.radio_list').find(".radio").eq(index-1).addClass("selected");
			wanSetting.siblings('ul[id^="setting_"]').hide().end().show();
		},
		/**
		 * 获取wan口基本信息
		 */
		getIfaceBaseInfo : function(jsonParam,func) {
			common.showMask();
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getIfaceBaseInfo, jsonParam, func);
		},
		/**
		 * 保存连接设置
		 */
		saveWanConnectInfo : function(obj) {
			common.showMask("正在保存设置");
			var button = $(obj);
			var wanSetting = button.parent().parent();
			var paramArray = [];
			switch (wanSetting.attr('id')) {
			case 'setting_1'://保存dhcp
				paramArray.push('dhcp');
				var mtuVal = wanSetting.find('input[name="mtu"]').val();
				paramArray.push({mtu:("" == mtuVal ? 1500 : parseInt(mtuVal))});
				console.log(paramArray);
				break;
			case 'setting_2'://保存拨号上网
				paramArray.push('pppoe');
				var userName = $('#' + wanSetting.attr('id') + ' input[name="userName"]').val();
				var password = $('#' + wanSetting.attr('id') + ' input[name="password"]').val();
				if ("" == userName || "" == password) {alert('账号或密码不能为空');return;}
				var mtuVal = $('#pppoe_mtu').hasClass('selected') ? false : true; //是否开启MTU协商
				common.localdata.setLoData(wanIndex.paramOperate.MTUNameWithProtocol[1], wanIndex.paramOperate.MTUInitVal[1]);//手动给一个false默认值
				var modeStr = $('#connect_mode').find('h3').text();
				var modeVal = '';
				var idletimeVal = 1;
				switch (modeStr) {
				case '自动连接':
					modeVal = 'always';
					break;
				case '手动连接':
					modeVal = 'manual';
					break;
				case '按需连接':
					modeVal = 'demand';
					idletimeVal = parseInt($('input[name="idletime"]').val());
					if (idletimeVal < 0) {alert('选择按需连接时，重播间隔时间必须大于0');return;};
					break;
				}
				paramArray.push({username:userName, password:password, mtu:mtuVal, mode:modeVal});
				//paramArray.push({username:userName, password:password, mtu:mtuVal, mode:modeVal, idletime:idletimeVal});
				break;
			case 'setting_3'://保存静态ip
				paramArray.push('static');
				var ipArray = [];
				var netMaskArray = [];
				var gateWayArray = [];
				var ipInputArray = $('#ip_li').find('input');
				var netMaskInputArray = $('#netmask_li').find('input');
				var gateWayInputArray = $('#gateway_li').find('input');
				for (var i = 0; i < ipInputArray.length; i++) {
					ipArray.push($(ipInputArray[i]).val().trim());
					netMaskArray.push($(netMaskInputArray[i]).val().trim());
					gateWayArray.push($(gateWayInputArray[i]).val().trim());
				}
				var ipVal = ipArray.join('.');
				var netMaskVal = netMaskArray.join('.');
				var gateWayVal = gateWayArray.join('.');
				var dnsParam = wanIndex.getDynamicDnsWithProtocol('static');
				var mtuVal = wanSetting.find('input[name="mtu"]').val();
				common.localdata.setLoData(wanIndex.paramOperate.MTUNameWithProtocol[2], mtuVal);
				paramArray.push({ip:ipVal,mask:netMaskVal,gw:gateWayVal,dns:dnsParam,mtu:("" == mtuVal ? 1500 : parseInt(mtuVal))});
				break;
			case 'setting_4'://无线桥接
				break;
			}
			console.log(paramArray);
			//保存(此接口一旦调用即出现跨域问题)
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setWanConnectInfo, paramArray, function(data){
				console.log(data);
				common.hideMask();
			});
		},
		/**
		 * 获取对应protocol配置的动态dns
		 */
		getDynamicDnsWithProtocol : function(protocol) {
			var dns0Array = [];
			var dns1Array = [];
			var dnsParam = [];
			switch (protocol) {
			case 'static':
				$('#setting_3 input[id^="static0"]').each(function(){
					dns0Array.push($(this).val());
				});
				$('#setting_3 input[id^="static1"]').each(function(){
					dns1Array.push($(this).val());
				});
				dnsParam.push(dns0Array.join('.'));
				dnsParam.push(dns1Array.join('.'));
				dns0Array = null;
				dns1Array = null;
				break;
			}
			return dnsParam;
		}
}

/**
 * dom加载完成即执行 
 */
$(function(){
	wanIndex.init();
});

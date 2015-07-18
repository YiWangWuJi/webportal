﻿/**
 * lan-setting相关js
 * @author renwei
 */
var lanIndex = {
		/**
		 * 业务相关集合
		 */
		paramOperate : {
			/**
			 * 业务类型
			 */
			businessType : 'router',
			businessWifiType : 'wifi',
			/**
			 * 方法集合
			 */
			method : {
				getIfaceBaseInfo : 'LAN.getIfaceBaseInfo',//获取lan口基本信息
				getTrafficInfo : 'LAN.getTrafficInfo',//获取lan口实时流量信息
				getConfigInfo : 'DHCP.getConfigInfo',//获取dhcp配置信息
				setConfigInfo : 'DHCP.setConfigInfo',//设置dhcp配置信息
				setLanIpAddr : 'WIFI.setLanIpAddr'//设置网关ip
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getLanConnectInfo();
			this.getDhcpConfigInfo();//只要一调用这个接口，就会报跨域问题，并且其他的接口也都用不了了，只能重启路由器
			this.eventList.bindSaveButton();
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
					lanIndex.saveLanConnectInfo();
				});
			}
		},
		/**
		 * 获取lan连接信息
		 */
		getLanConnectInfo : function() {
			common.showMask();
			var params = ['ipaddr'];
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getIfaceBaseInfo, params, this.lanConnectInfoCallBack);
		},
		/**
		 * lan获取连接信息回调
		 */
		lanConnectInfoCallBack : function(data) {
			console.log(data);
			lanIndex.echoLanConnectInfo(data);
		},
		/**
		 * 回显lan连接信息
		 */
		echoLanConnectInfo : function(data) {
			var ipStr = data.ipaddr;
			if (null != ipStr && ipStr && "" != ipStr) {
				var ipArray = ipStr.split('.');
				var ipInputArray = $('#ip_li').find('input');
				ipInputArray.eq(0).val(ipArray[0]);
				ipInputArray.eq(1).val(ipArray[1]);
				ipInputArray.eq(2).val(ipArray[2]);
				console.log(ipArray);
				common.hideMask();
			}
		},
		/**
		 * 获取dhcp配置信息
		 */
		getDhcpConfigInfo : function() {
			common.showMask();
			var params = ['defaultgateway','start','limit','leasetime'];
//			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getConfigInfo, params, this.dhcpConfigInfoCallBack);
			var url = rpcUrl + this.paramOperate.businessType + token;
			var rpc = new jsonrpc.JsonRpc(url);
			var method = this.paramOperate.method.getConfigInfo;
			rpc.call(method, params[0], params[1], params[2], params[3], this.dhcpConfigInfoCallBack);
		},
		/**
		 * 获取dhcp配置信息回调
		 */
		dhcpConfigInfoCallBack : function(data) {
			lanIndex.echoDhcpConfigInfo(data);
		},
		/**
		 * 回显dhcp配置信息（ip地址段）
		 * @see dhcp服务器在接口文档里没有找到参数
		 */
		echoDhcpConfigInfo : function(data) {
			console.log(data);
			var startIp = data.start;
			var start = parseInt(startIp.substring(startIp.lastIndexOf('.') + 1, startIp.length));
			$('#ip_start').val(start);
			$('#ip_end').val(start + parseInt(data.limit));
			//没有找到放默认网关的地方，暂时放在隐藏域
			$('input[name="default_gateway"]').val(data.defaultgateway);
			//没有找到放租赁期限的地方，暂时放在隐藏域
			$('input[name="leasetime"]').val(data.leasetime);
			common.hideMask();
		},
		/**
		 * 保存lan设置(未完成)
		 */
		saveLanConnectInfo : function() {
			common.showMask('正在保存……');
			var ipStart = $('#ip_start').val();	
			var ipEnd = $('#ip_end').val();
			if ("" == ipStart) {
				alert("IP地址开始段不能为空");
				return;
			}
			if ("" == ipEnd) {
				alert("IP地址结束段不能为空");
				return;
			}
			if (parseInt(ipEnd) < parseInt(ipStart)) {
				alert("IP地址结束段不能小于开始段");
				return;
			}
			var ipLimit = ipEnd - ipStart;
			var params = [$('input[name="default_gateway"]').val(), $('#ip_start').prev().text() + ipStart, ipLimit, parseInt($('input[name="leasetime"]').val()) ];
			//保存lan
			lanIndex.savelanSetting();
			//保存
			var url = rpcUrl + this.paramOperate.businessType + token;
			var rpc = new jsonrpc.JsonRpc(url);
			var method = this.paramOperate.method.setConfigInfo;
			rpc.call(method, params[0], params[1], params[2], params[3], function(data){
				console.log(data);
				common.hideMask();
			});
		},
		/**
		 * 保存lan设置
		 */
		savelanSetting : function() {
			var ip_A = $('input[name="ip_A"]').val();
			var ip_B = $('input[name="ip_B"]').val();
			var ip_C = $('input[name="ip_C"]').val();
			var ip_D = $('input[name="ip_D"]').val();
			if (!isNumber(ip_C) || parseInt(ip_C) < 0 || parseInt(ip_C) >= 255 || !isNumber(ip_A) || '192' != ip_A || !isNumber(ip_B) || '168' != ip_B || !isNumber(ip_D) || '1' != ip_D) {alert('ip地址不合法，只允许192.168.X.1的格式，X取值范围0~254');return;}
			var ip = ip_A + ip_B + ip_C + ip_D;
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.setLanIpAddr, ip, function(data){
				console.log(data);
			});
			
		}
		
}
/**
 * 判断是否是数字 
 * @param oNum
 * @returns {Boolean}
 */
function isNumber(oNum) {
	if(!oNum) return false;
	var strP=/^\d+(\.\d+)?$/;
	if (!strP.test(oNum)) return false;
	try {
		if (parseFloat(oNum)!=oNum) return false;
	}
	catch(ex) {
		return false;
	}
	return true;
}

/**
 * dom加载完成即执行 
 */
$(function(){
	lanIndex.init();
});

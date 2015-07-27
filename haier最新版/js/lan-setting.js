/**
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
				getTrafficInfo   : 'LAN.getTrafficInfo',//获取lan口实时流量信息
				getConfigInfo    : 'DHCP.getConfigInfo',//获取dhcp配置信息
				setConfigInfo    : 'DHCP.setConfigInfo',//设置dhcp配置信息
				setLanIpAddr     : 'WIFI.setLanIpAddr',//设置网关ip
				enableServer     : 'DHCP.enableServer'//使能/关闭DHCP Server
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getLanConnectInfo();
			this.getDhcpConfigInfo();
			this.eventList.bindSaveButton();
			this.eventList.bindGatewayIpInputCheck();
			this.eventList.bindDhcpIpInputCheck();
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
					lanIndex.saveLanInfo();
				});
			},

			bindGatewayIpInputCheck : function() {
				$('#ip_li').find('input[name="ip_C"]').keyup(function(){
					lanIndex.syncDhcpGateway(this);
				});
			},

			bindDhcpIpInputCheck : function() {
				$('#ip_start').keyup(function(){
					lanIndex.dhcpIpInputCheck(this);
				});
				$('#ip_end').keyup(function(){
					lanIndex.dhcpIpInputCheck(this);
				});
			}
		},

		/**
		 * 同步DHCP地址输入
		 */
		syncDhcpGateway(obj) {
			var ipreg = /^(\d{1,3}|\*)/
			var ipSection = obj.value;
			if ((ipSection != "") && (ipSection.match(ipreg) == null) || (ipSection < 0) || (ipSection > 255)) {
				obj.value = "";
				$('#ip_start').prev().find('span').text("");
				$('#ip_end').prev().find('span').text("");
				alert("错误的ip地址输入");
				return;
			}
			$('#ip_start').prev().find('span').text(ipSection);
			$('#ip_end').prev().find('span').text(ipSection);
		},

		dhcpIpInputCheck(obj) {
			var ipreg = /^(\d{1,3}|\*)/
			var ipSection = obj.value;
			if ((ipSection != "") && (ipSection.match(ipreg) == null) || (ipSection < 0) || (ipSection > 255)) {
				obj.value = "";
				alert("错误的ip地址输入");
				return;
			}
		},

		/**
		 * 获取lan连接信息
		 */
		getLanConnectInfo : function() {
			common.showMask();
			var params = ['gwaddr'];
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
			var ipStr = data.gwaddr;
			if (null != ipStr && ipStr && "" != ipStr) {
				var ipArray = ipStr.split('.');
				var ipInputArray = $('#ip_li').find('input');
				ipInputArray.eq(0).val(ipArray[0]);
				ipInputArray.eq(1).val(ipArray[1]);
				ipInputArray.eq(2).val(ipArray[2]);
				console.log(ipArray);
			}
			common.hideMask();
		},
		/**
		 * 获取dhcp配置信息
		 */
		getDhcpConfigInfo : function() {
			common.showMask();
			var params = ['defaultgateway','start','limit','leasetime'];
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getConfigInfo, params, this.dhcpConfigInfoCallBack);
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
			var startIp = data.start;
			if (null != startIp && startIp && "" != startIp) {
				var ipArray = startIp.split('.');
				var start = parseInt(ipArray[3]);
				$('#ip_start').val(start);
				$('#ip_end').val(start + parseInt(data.limit));
				$('#ip_start').prev().find('span').text(ipArray[2]);
				$('#ip_end').prev().find('span').text(ipArray[2]);
			}
			$('input[name="default_gateway"]').val(data.defaultgateway);
                        $('input[name="leasetime"]').val(data.leasetime);
			common.hideMask();
		},
		/**
		 * 保存lan设置(未完成)
		 */
		saveLanInfo : function() {
			var ip_A = $('input[name="ip_A"]').val();
			var ip_B = $('input[name="ip_B"]').val();
			var ip_C = $('input[name="ip_C"]').val();
			var ip_D = $('input[name="ip_D"]').val();
			if (!isNumber(ip_C) || parseInt(ip_C) < 0 || parseInt(ip_C) >= 255 || !isNumber(ip_A) || '192' != ip_A 
			   || !isNumber(ip_B) || '168' != ip_B || !isNumber(ip_D) || '1' != ip_D) {
				alert('ip地址不合法，只允许192.168.X.1的格式，X取值范围0~255');
				return;
			}

			var gateway = ip_A + '.' + ip_B + '.' + ip_C + '.' + ip_D;
			if (gateway != $('input[name="default_gateway"]').val()) {
				$('input[name="default_gateway"]').val(gateway);
				common.showMask('网关地址已修改，系统将重新启动……');
			} else {
				common.showMask('正在保存……');
			}

			lanIndex.saveDhcpInfo(gateway);
			lanIndex.saveLanConnectInfo(gateway);
		},

		saveLanConnectInfo : function(gateway) {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.setLanIpAddr, gateway, function(data){
				console.log(data);
			});
		},

		saveDhcpInfo : function(gateway) {
			var ipStart = $('#ip_start').val();	
			var ipEnd   = $('#ip_end').val();
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
			var params = [gateway, $('#ip_start').prev().text() + ipStart, ipLimit, parseInt($('input[name="leasetime"]').val()) ];
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setConfigInfo, params, function(data){
				console.log(data);
			});

			var serverEnable = $('#dhcps_enable').hasClass('selected') ? false : true;
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.enableServer, serverEnable, function(data){
				console.log(data);
				common.hideMask();
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

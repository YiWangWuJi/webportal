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
			/**
			 * 方法集合
			 */
			method : {
				getIfaceBaseInfo : 'LAN.getIfaceBaseInfo',//获取lan口基本信息
				getTrafficInfo : 'LAN.getTrafficInfo',//获取lan口实时流量信息
				getConfigInfo : 'DHCP.getConfigInfo',//获取dhcp配置信息
				setConfigInfo : 'DHCP.setConfigInfo'//设置dhcp配置信息
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getLanConnectInfo();
			//this.getDhcpConfigInfo();//只要一调用这个接口，就会报跨域问题，并且其他的接口也都用不了了，只能重启路由器
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
			var params = ['ipaddr'];
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getIfaceBaseInfo, params, this.lanConnectInfoCallBack);
		},
		/**
		 * lan获取连接信息回调
		 */
		lanConnectInfoCallBack : function(data) {
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
			}
		},
		/**
		 * 获取dhcp配置信息
		 */
		getDhcpConfigInfo : function() {
			var params = ['defaultgateway'];
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
			console.log(data);
			$('#ip_start').val(data.start);
			$('#ip_end').val(data.start + data.limit);
			//没有找到放默认网关的地方，暂时放在隐藏域
			$('input[name="default_gateway"]').val(data.defaultgateway);
			//没有找到放租赁期限的地方，暂时放在隐藏域
			$('input[name="leasetime"]').val(data.leasetime);
		},
		/**
		 * 保存lan设置(未完成)
		 */
		saveLanConnectInfo : function() {
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
			if (ipEnd < ipStart) {
				alert("IP地址结束段不能小于开始段");
				return;
			}
			var ipLimit = ipEnd - ipStart;
			var params = [{'defaultgateway':$('input[name="default_gateway"]').val()}, {'start':$('#ip_start').val()}, {'limit':ipLimit}, {'leasetime':$('input[name="leasetime"]').val()} ];
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setConfigInfo, params, function(data){
				console.log(data);
			});
		}
		
}

/**
 * dom加载完成即执行 
 */
$(function(){
	lanIndex.init();
});

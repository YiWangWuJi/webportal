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
				setOnDemandMode   : 'WAN.setOnDemandMode',//使能/关闭按需拨号模式
				notifyIfaceCreatedInfo : 'WAN.notifyIfaceCreatedInfo',//wan口连接建立通知信息
				notifyIfaceLostInfo : 'WAN.notifyIfaceLostInfo',//wan口连接失败通知信息
				getIfaceBaseInfo : 'WAN.getIfaceBaseInfo',//获取wan口基本信息
				getTrafficInfo : 'WAN.getTrafficInfo',//获取wan口实时流量
				setDnsInfo : 'WAN.setDnsInfo',//设置静态dns配置信息
				getDnsInfo : 'WAN.getDnsInfo'//获取静态dns配置信息
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getWanConnectInfo();
		},
		/**
		 * 获取wan连接信息
		 */
		getWanConnectInfo : function() {
			//这里需要加等待效果
			rpcUrl = rpcUrl + this.paramOperate.businessType;
			callRpc(rpcUrl + token, this.paramOperate.method.getWanConnectInfo, null, this.wanConnectInfoCallBack);
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
				index = 0;
				break;
			case 'pppoe':
				$('input[name="userName"]').val(data.info.username);
				$('input[name="password"]').val(data.info.password);
				$('input[name="userName"]').val(data.info.username);
				switch (data.info.mode) {
				case 'always':
					$('#connect_mode').find('h3').text($('#auto_con').text() + '<icon></icon>');
					break;
				case 'manual':
					$('#connect_mode').find('h3').text($('#manual_con').text() + '<icon></icon>');
					break;
				case 'demand':
					$('#connect_mode').find('h3').text($('#need_con').text() + '<icon></icon>');
					$('input[name="idletime"]').val(data.info.idletime);
					break;
				}
				index = 1;
				break;
			case 'static':
				index = 2;
				break;
			case 'wirelessRelay'://临时模拟写的，文档里面没有
				index = 3;
				break;
			}
			var wanSetting = $('#setting_' + index);
			$('.radio_list').find(".radio").removeClass("selected");
			$('.radio_list').find(".radio").eq(index).addClass("selected");
			wanSetting.show();
		},
		/**
		 * 获取wan口基本信息
		 */
		getIfaceBaseInfo : function() {
			
		}
}

/**
 * dom加载完成即执行 
 */
$(function(){
	wanIndex.init();
});

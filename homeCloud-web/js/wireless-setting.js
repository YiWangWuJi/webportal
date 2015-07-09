/**
 * wifi-setting相关js
 * @author renwei
 */
var wifiIndex = {
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
			businessType : 'wifi',
			/**
			 * 方法集合
			 */
			method : {
				getWiFiInfo : 'WIFI.getWiFiInfo',//获取wifi配置信息
				getWiFiRadioInfo : 'WIFI.getWiFiRadioInfo',//获取wifi物理层信息
				setWiFiInfo : 'WIFI.setWiFiInfo'//设置wifi配置信息
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			for (var i = 0; i < this.paramOperate.wifiBand.length; i++) {
				this.getWifiInfo(this.paramOperate.wifiBand[i]);
			}
			//this.getWiFiRadioInfo();
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
		 * 获取wifi配置信息
		 */
		getWifiInfo : function(band) {
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getWiFiInfo, band, this.wifiInfoCallBack, band);
		},
		/**
		 * 获取wifi配置信息回调
		 */
		wifiInfoCallBack : function(data,band) {
			wifiIndex.echoWifiInfo(data,band);
		},
		/**
		 * 回显wifi配置信息
		 */
		echoWifiInfo : function(data,band) {
			console.log(data);
			switch (band) {
			case wifiIndex.paramOperate.wifiBand[0]://2G
				$('input[name="' + band + '_ssid"]').val(data.ssid);
				var hidden = $('icon[name="' + band + '_hidden"]');
				if (data.hidden) {
					hidden.removeClass('selected');
				}else {
					hidden.addClass('selected');
				}
				$('input[name="' + band + '_password"]').val(data.key);
				var encryption = data.encryption;
				console.log('encryption------>' + encryption);
				switch (encryption) {
				case 'none':
					
					break;
				case 'WPAPSK+AES':
					
					break;
				case 'WPAPSK+TKIP':
					
					break;
				case 'WPAPSK+TKIPAES':
					
					break;
				case 'WPA2PSK+AES':
					
					break;
				case 'WPA2PSK+TKIP':
					
					break;
				case 'WPA2PSK+TKIPAES':
					
					break;
				}
				break;
			case wifiIndex.paramOperate.wifiBand[1]://5G
				
				break;
			}
		},
		/**
		 * 获取wifi物理层信息
		 */
		getWiFiRadioInfo : function(band) {
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getWiFiRadioInfo, band, this.wifiRadioInfoCallBack, band);
		},
		/**
		 * wifi物理层信息回调
		 */
		wifiRadioInfoCallBack : function(data,band) {
			console.log(data);
		},
		/**
		 * 保存wifi设置(未完成)
		 */
		savewWifitInfo : function() {
			
		}
		
}

/**
 * dom加载完成即执行 
 */
$(function(){
	wifiIndex.init();
//	var param = ['2G',null,null,null,'WPAPSK+TKIPAES','123123'];
//	callRpc(rpcUrl + wifiIndex.paramOperate.businessType + token, wifiIndex.paramOperate.method.setWiFiInfo, param, wifiIndex.wifiRadioInfoCallBack);
});

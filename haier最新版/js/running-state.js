/**
 * running-state相关js
 * @author renwei
 */
var runningIndex = {
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
				getIfaceBaseInfo : 'WAN.getIfaceBaseInfo',//获取wan口基本信息
				getLanIfaceBaseInfo : 'LAN.getIfaceBaseInfo',//获取lan口基本信息
				getWiFiInfo : 'WIFI.getWiFiInfo',//获取wifi配置信息
				getWiFiRadioInfo : 'WIFI.getWiFiRadioInfo'//获取wifi物理层信息
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getIfaceBaseInfo();
			this.getLanConnectInfo();
			for (var i = 0; i < this.paramOperate.wifiBand.length; i++) {
				this.getWifiInfo(this.paramOperate.wifiBand[i]);
			}
			this.eventList.bindRefreshTongJi();
			this.eventList.bindWanState();
			this.eventList.bindRefreshWanState();
			this.eventList.bindRefreshLanState();
			this.eventList.bindRefreshWifiState();
			this.eventList.bindWifiState();
		},
		/**
		 * 事件绑定集合
		 */
		eventList : {
			/**
			 * 刷新总流量统计
			 */
			bindRefreshTongJi : function() {
				$('#tongji_refresh').click(function(){
					runningIndex.getIfaceBaseInfo();
				});
			},
			/**
			 * 设置互联网连接状态
			 */
			bindWanState : function() {
				$('#wan-setting').click(function(){
					common.functions.loadInfor(2);
					common.functions.headerNow(2);
				});
			},
			/**
			 * 刷新互联网连接状态
			 */
			bindRefreshWanState : function() {
				$('#wan-refresh').click(function(){
					runningIndex.getIfaceBaseInfo();
				});
			},
			/**
			 * 刷新局域网连接状态
			 */
			bindRefreshLanState : function() {
				$('#lan-refresh').click(function(){
					runningIndex.getLanConnectInfo();
				});
			},
			/**
			 * 刷新无线运行状态
			 */
			bindRefreshWifiState : function() {
				$('#wifi-refresh').click(function(){
					for (var i = 0; i < runningIndex.paramOperate.wifiBand.length; i++) {
						runningIndex.getWifiInfo(runningIndex.paramOperate.wifiBand[i]);
					}
				});
			},
			/**
			 * 设置无线wifi
			 */
			bindWifiState : function() {
				$('#wifi-setting').click(function(){
					common.functions.loadInfor(5);
					common.functions.headerNow(5);
				});
			}
		},
		/**
		 * 获取wan口基本信息
		 */
		getIfaceBaseInfo : function() {
			common.showMask();
			var params = ['ipaddr'];
			callRpc(rpcUrl + this.paramOperate.businessRouterType + token, this.paramOperate.method.getIfaceBaseInfo, params, this.wanSimCallBack);
		},
		/**
		 * wan口基本信息回调
		 */
		wanSimCallBack : function(data) {
			runningIndex.echoWanSimInfo(data);
		},
		/**
		 * 回显wan口基本信息
		 */
		echoWanSimInfo : function(data) {
			console.log(data);
			$('#rxbytes').text(this.convertBytesToReadBytes(data.rxbytes));//接收总字节数
			$('#txbytes').text(this.convertBytesToReadBytes(data.txbytes));//发送总字节数
			$('#rxpacket').text(data.rxpacket);//接收总包数
			$('#txpacket').text(data.txpacket);//发送总包数
			$('#gwaddr').text(data.gwaddr);//网关
			$('#mtu').text(1500);//MTU(这里不知道应该是取数值的MTU还是去Boolean的MTU，wan-setting中有两种数值)
			$('#protocol').text(data.protocol);//protocol
			$('#macaddr').text(data.macaddr);//mac地址
			if (null != data.dnsaddr && data.dnsaddr) {
				for (var i = 0; i < data.dnsaddr.length; i++) {
					$('#dns_' + i).text(data.dnsaddr[i]);
				}
			}
			common.hideMask();
		},
		/**
		 * 字节数转换为可读数据
		 * @see bytes 字节数
		 */
		convertBytesToReadBytes : function(bytes) {
			var unitNum = 1000;//进位
			var unitName = ['KB','MB','GB','TB'];
			var readBytes = '0.00' + unitName[0];
			if (bytes > 0) {
				if (bytes <= unitNum) {//KB
					readBytes = bytes + unitName[0];
				}else if (bytes > 1000 && bytes <= Math.pow(unitNum,2)) {//MB
					readBytes = (bytes/unitNum).toFixed(2) + unitName[1];
				}else if (bytes > Math.pow(unitNum,2) && bytes <= Math.pow(unitNum,3)) {//GB
					readBytes = (bytes/(Math.pow(unitNum,2))).toFixed(2) + unitName[2];
				}else if (bytes > Math.pow(unitNum,3) && bytes <= Math.pow(unitNum,4)) {//TB
					readBytes = (bytes/(Math.pow(unitNum,3))).toFixed(2) + unitName[3];
				}
			}
			return readBytes;
		},
		/**
		 * 获取lan连接信息
		 */
		getLanConnectInfo : function() {
			common.showMask();
			var params = ['ipaddr'];
			callRpc(rpcUrl + this.paramOperate.businessRouterType + token, this.paramOperate.method.getLanIfaceBaseInfo, params, this.lanSimCallBack);
		},
		/**
		 * 获取lan连接信息回调
		 */
		lanSimCallBack : function(data) {
			console.log(data);
			runningIndex.echoLanSimInfo(data);
		},
		/**
		 * 回显lan连接信息
		 */
		echoLanSimInfo : function(data) {
			$('#lan_ip').text(data.ipaddr);//ip
			$('#lan_time').text('0小时');//租赁时长（目前写死，没有在文档中找到此参数）
			$('#lan_macaddr').text(data.macaddr);
			$('#lan_dhcp_o').text('开启');//dhcp服务器是否开启（目前写死，没有在文档中找到此参数）
			common.hideMask();
		},
		/**
		 * 获取wifi配置信息
		 */
		getWifiInfo : function(band) {
			common.showMask();
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.getWiFiInfo, band, this.wifiInfoCallBack, band);
		},
		/**
		 * 获取wifi配置信息回调
		 */
		wifiInfoCallBack : function(data,band) {
			runningIndex.echoWifiInfo(data,band);
		},
		/**
		 * 回显wifi配置信息
		 */
		echoWifiInfo : function(data,band) {
			console.log(data);
			switch (band) {
			case runningIndex.paramOperate.wifiBand[0]://2G
				$('#2G_enable').text(data.enable ? '开启' : '关闭');
				$('#2G_ssid').text(data.ssid);
				$('#2G_password').text(data.encryption == 'OPEN' ? '关闭' : '开启');
				runningIndex.getWiFiRadioInfo(runningIndex.paramOperate.wifiBand[0]);
				break;
			case runningIndex.paramOperate.wifiBand[1]://5G
				$('#5G_enable').text(data.enable ? '开启' : '关闭');
				$('#5G_ssid').text(data.ssid);
				$('#5G_password').text(data.encryption == 'OPEN' ? '关闭' : '开启');
				runningIndex.getWiFiRadioInfo(runningIndex.paramOperate.wifiBand[1]);
				break;
				}
		},
		/**
		 * 获取wifi物理层信息
		 */
		getWiFiRadioInfo : function(band) {
			callRpc(rpcUrl + this.paramOperate.businessWifiType + token, this.paramOperate.method.getWiFiRadioInfo, band, this.wifiRadioInfoCallBack, band);
		},
		/**
		 * wifi物理层信息回调
		 */
		wifiRadioInfoCallBack : function(data,band) {
			switch (band) {
			case runningIndex.paramOperate.wifiBand[0]://2G
				runningIndex.echoWifiRadioInfo(runningIndex.paramOperate.wifiBand[0], 'channel', data.channel, true);//回显channel
				runningIndex.echoWifiRadioInfo(runningIndex.paramOperate.wifiBand[0], 'txpower', data.txpower, true);//回显txpower
				runningIndex.echoWifiRadioInfo(runningIndex.paramOperate.wifiBand[0], 'htmode', data.htmode, true);//回显htmode
				runningIndex.echoWifiRadioInfo(runningIndex.paramOperate.wifiBand[0], 'mode', data.mode, true);//回显mode
				break;
			case runningIndex.paramOperate.wifiBand[1]://5G
				runningIndex.echoWifiRadioInfo(runningIndex.paramOperate.wifiBand[1], 'channel', data.channel, true);//回显channel
				runningIndex.echoWifiRadioInfo(runningIndex.paramOperate.wifiBand[1], 'txpower', data.txpower, true);//回显txpower
				runningIndex.echoWifiRadioInfo(runningIndex.paramOperate.wifiBand[1], 'htmode', data.htmode, true);//回显htmode
				runningIndex.echoWifiRadioInfo(runningIndex.paramOperate.wifiBand[1], 'mode', data.mode, true);//回显mode
				break;
			}
		},
		/**
		 * 回显wifi物理层信息
		 * @see band 频段
		 * @see paramName 参数名
		 * @see paramVal 参数值
		 * @see oprateType 操作类型（true回显、false取值）boolean 类型
		 */
		echoWifiRadioInfo : function(band,paramName,paramVal,oprateType) {
			switch (band) {
			case runningIndex.paramOperate.wifiBand[0]://2G
				switch (paramName) {
				case 'channel':
					switch (paramVal) {
					case 0:
						$('#2G_channel').text('自动');
						break;
					case 1:
						$('#2G_channel').text('信道1');
						break;
					case 2:
						$('#2G_channel').text('信道2');
						break;
					case 3:
						$('#2G_channel').text('信道3');
						break;
					case 4:
						$('#2G_channel').text('信道4');
						break;
					case 5:
						$('#2G_channel').text('信道5');
						break;
					case 6:
						$('#2G_channel').text('信道6');
						break;
					case 7:
						$('#2G_channel').text('信道7');
						break;
					case 8:
						$('#2G_channel').text('信道8');
						break;
					case 9:
						$('#2G_channel').text('信道9');
						break;
					case 10:
						$('#2G_channel').text('信道10');
						break;
					case 11:
						$('#2G_channel').text('信道11');
						break;
					case 12:
						$('#2G_channel').text('信道12');
						break;
					case 13:
						$('#2G_channel').text('信道13');
						break;
					}
					break;
				case 'txpower':
					switch (paramVal) {
					case 1:
						$('#2G_txpower').text('1');
						break;
					case 100:
						$('#2G_txpower').text('100');
						break;
					}
					break;
				case 'htmode':
					switch (paramVal) {
					case '0':
						$('#2G_htmode').text('20Mhz');
						break;
					case '1':
						$('#2G_htmode').text('20/40Mhz');
						break;
					case '2':
						console.log('出现错误，无意义');
						break;
					}
					break;
				case 'mode':
					switch (paramVal) {
					case 1:
						$('#2G_mode').text('11B');
						break;
					case 4:
						$('#2G_mode').text('11G');
						break;
					case 6:
						$('#2G_mode').text('11N only with 2.4G');
						break;
					case 7:
						$('#2G_mode').text('11G/N');
						break;
					case 9:
						$('#2G_mode').text('11B/G/N default');
						break;
					}
					break;
				}
				break;
			case runningIndex.paramOperate.wifiBand[1]://5G
				switch (paramName) {
				case 'channel':
					switch (paramVal) {
					case 0:
						$('#5G_channel').text('自动');
						break;
					case 149:
						$('#5G_channel').text('信道149');
						break;
					case 153:
						$('#5G_channel').text('信道153');
						break;
					case 157:
						$('#5G_channel').text('信道157');
						break;
					case 161:
						$('#5G_channel').text('信道161');
						break;
					case 165:
						$('#5G_channel').text('信道165');
						break;
					}
					break;
				case 'txpower':
					switch (paramVal) {
					case 1:
						$('#5G_txpower').text('1');
						break;
					case 100:
						$('#5G_txpower').text('100');
						break;
					}
					break;
				case 'htmode':
					switch (paramVal) {
					case '0':
						$('#5G_htmode').text('20Mhz');
						break;
					case '1':
						$('#5G_htmode').text('20/40Mhz');
						break;
					case '2':
						$('#5G_htmode').text('20/40/80Mhz');
						break;
					}
					break;
				case 'mode':
					switch (paramVal) {
					case 1:
						$('#5G_mode').text('11B');
						break;
					case 2:
						$('#5G_mode').text('11A');
						break;
					case 3:
						$('#5G_mode').text('11A/B/G');
						break;
					case 4:
						$('#5G_mode').text('11G');
						break;
					case 5:
						$('#5G_mode').text('11A/B/G/N');
						break;
					case 6:
						$('#5G_mode').text('11N only with 2.4G');
						break;
					case 7:
						$('#5G_mode').text('11G/N');
						break;
					case 8:
						$('#5G_mode').text('11A/N');
						break;
					case 9:
						$('#5G_mode').text('11B/G/N');
						break;
					case 10:
						$('#5G_mode').text('11A/G/N');
						break;
					case 11:
						$('#5G_mode').text('11N only with 5G');
						break;
					case 12:
						$('#5G_mode').text('11B/G/N/A/AC');
						break;
					case 13:
						$('#5G_mode').text('11G/N/A/AC');
						break;
					case 14:
						$('#5G_mode').text('11N/A/AC default');
						break;
					}
					break;
				}
				break;
			}
			common.hideMask();
		}
}

/**
 * dom加载完成即执行 
 */
$(function(){
	runningIndex.init();
});

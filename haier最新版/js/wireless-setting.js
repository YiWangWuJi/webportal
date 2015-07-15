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
				setWiFiInfo : 'WIFI.setWiFiInfo',//设置wifi配置信息
				setRadioInfo : 'WIFI.setRadioInfo'//设置wifi物理层信息
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			for (var i = 0; i < this.paramOperate.wifiBand.length; i++) {
				this.getWifiInfo(this.paramOperate.wifiBand[i]);
				this.getWiFiRadioInfo(this.paramOperate.wifiBand[i]);//无法调用
			}
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
					wifiIndex.savewWifitInfo();
				});
			},
			/**
			 * "应用与2.4G相同的设置"选框的绑定事件（魏少楠应该是写了的，没找到，没起作用，这里简单绑定）
			 */
			bindSame2GRadio : function() {
				var divEle = $('#same_2G');
				var iconEle = $('#same_2G_icon');
				if (iconEle.hasClass('selected')) {//应用相同设置
					divEle.css('display','block');
				}else {//不应用相同设置
					divEle.css('display','none');
				}
			}
		},
		/**
		 * 获取wifi配置信息
		 */
		getWifiInfo : function(band) {
			common.showMask();
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getWiFiInfo, band, this.wifiInfoCallBack, band);
		},
		/**
		 * 获取wifi配置信息回调
		 */
		wifiInfoCallBack : function(data,band) {
			switch (band) {
			case wifiIndex.paramOperate.wifiBand[0]:
				//cache 2G 基本配置信息
				_2GSimInfo = data;
				break;
			case wifiIndex.paramOperate.wifiBand[1]:
				//cache 5G 基本配置信息
				_5GSimInfo = data;
				break;
			}
			if (null != _2GSimInfo && null != _5GSimInfo && _2GSimInfo && _5GSimInfo) {
				if ((_2GSimInfo.ssid == _5GSimInfo.ssid) && (_2GSimInfo.hidden == _5GSimInfo.hidden) && (_2GSimInfo.key == _5GSimInfo.key) && (_2GSimInfo.encryption == _5GSimInfo.encryption)) {
					$('#same_2G_icon').addClass('selected');
					$('#same_2G').css('display','none');
				}else {
					$('#same_2G_icon').removeClass('selected');
					$('#same_2G').css('display','block');
				}
			}
			wifiIndex.echoWifiInfo(data,band);
		},
		/**
		 * 回显wifi配置信息(enable没加)
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
				switch (encryption) {
				case 'OPEN':
					$('#enc_suanfa_li').hide();
					$('#password_li').hide();
					break;
				case 'WPAPSK+AES':
					$('#2G_authMode').find('h3').html($('#wpa_enc').text() + '<icon></icon>');
					$('#2G_enctype').find('h3').html($('#aes').text() + '<icon></icon>');
					break;
				case 'WPAPSK+TKIP':
					$('#2G_authMode').find('h3').html($('#wpa_enc').text() + '<icon></icon>');
					$('#2G_enctype').find('h3').html($('#tkip').text() + '<icon></icon>');
					break;
				case 'WPAPSK+TKIPAES':
					$('#2G_authMode').find('h3').html($('#wpa_enc').text() + '<icon></icon>');
					$('#2G_enctype').find('h3').html($('#aes_tkip').text() + '<icon></icon>');
					break;
				case 'WPA2PSK+AES':
					$('#2G_authMode').find('h3').html($('#wpa2_enc').text() + '<icon></icon>');
					$('#2G_enctype').find('h3').html($('#aes').text() + '<icon></icon>');
					break;
				case 'WPA2PSK+TKIP':
					$('#2G_authMode').find('h3').html($('#wpa2_enc').text() + '<icon></icon>');
					$('#2G_enctype').find('h3').html($('#tkip').text() + '<icon></icon>');
					break;
				case 'WPA2PSK+TKIPAES':
					$('#2G_authMode').find('h3').html($('#wpa2_enc').text() + '<icon></icon>');
					$('#2G_enctype').find('h3').html($('#aes_tkip').text() + '<icon></icon>');
					break;
				}
				wifiIndex.getWiFiRadioInfo(wifiIndex.paramOperate.wifiBand[0]);
				common.hideMask();
				break;
			case wifiIndex.paramOperate.wifiBand[1]://5G
				$('input[name="' + band + '_ssid"]').val(data.ssid);
				var hidden = $('icon[name="' + band + '_hidden"]');
				if (data.hidden) {
					hidden.removeClass('selected');
				}else {
					hidden.addClass('selected');
				}
				$('input[name="' + band + '_password"]').val(data.key);
				var encryption = data.encryption;
				switch (encryption) {
				case 'OPEN':
					$('#5G_enc_suanfa_li').hide();
					$('#5G_password_li').hide();
					break;
				case 'WPAPSK+AES':
					$('#5G_authMode').find('h3').html($('#5G_wpa_enc').text() + '<icon></icon>');
					$('#5G_enctype').find('h3').html($('#5G_aes').text() + '<icon></icon>');
					break;
				case 'WPAPSK+TKIP':
					$('#5G_authMode').find('h3').html($('#5G_wpa_enc').text() + '<icon></icon>');
					$('#5G_enctype').find('h3').html($('#5G_tkip').text() + '<icon></icon>');
					break;
				case 'WPAPSK+TKIPAES':
					$('#5G_authMode').find('h3').html($('#5G_wpa_enc').text() + '<icon></icon>');
					$('#5G_enctype').find('h3').html($('#5G_aes_tkip').text() + '<icon></icon>');
					break;
				case 'WPA5PSK+AES':
					$('#5G_authMode').find('h3').html($('#5G_wpa2_enc').text() + '<icon></icon>');
					$('#5G_enctype').find('h3').html($('#5G_aes').text() + '<icon></icon>');
					break;
				case 'WPA2PSK+TKIP':
					$('#5G_authMode').find('h3').html($('#5G_wpa2_enc').text() + '<icon></icon>');
					$('#5G_enctype').find('h3').html($('#5G_tkip').text() + '<icon></icon>');
					break;
				case 'WPA2PSK+TKIPAES':
					$('#5G_authMode').find('h3').html($('#5G_wpa2_enc').text() + '<icon></icon>');
					$('#5G_enctype').find('h3').html($('#5G_aes_tkip').text() + '<icon></icon>');
					break;
				}
				wifiIndex.getWiFiRadioInfo(wifiIndex.paramOperate.wifiBand[1]);
				common.hideMask();
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
			switch (band) {
			case wifiIndex.paramOperate.wifiBand[0]://2G
				wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[0], 'channel', data.channel, true);//回显channel
				wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[0], 'txpower', data.txpower, true);//回显txpower
				wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[0], 'htmode', data.htmode, true);//回显htmode
				wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[0], 'mode', data.mode, true);//回显mode
				break;
			case wifiIndex.paramOperate.wifiBand[1]://5G
				wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[1], 'channel', data.channel, true);//回显channel
				wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[1], 'txpower', data.txpower, true);//回显txpower
				wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[1], 'htmode', data.htmode, true);//回显htmode
				wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[1], 'mode', data.mode, true);//回显mode
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
			var targetVal;//供取值使用
			switch (band) {
			case wifiIndex.paramOperate.wifiBand[0]://2G
				switch (paramName) {
				case 'channel':
//					alert('paramVal--->' + paramVal);
//					alert('paramVal type--->' + typeof paramVal);
					switch (paramVal) {
					case 0:
						oprateType ? $('#2G_channel').find('h3').html($('#auto').text() + '<icon></icon>') : (targetVal = 0);
						//$('#2G_channel').find('h3').html($('#auto').text() + '<icon></icon>');
						break;
					case 1:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_1').text() + '<icon></icon>') : (targetVal = 1);
						//$('#2G_channel').find('h3').html($('#channel_1').text() + '<icon></icon>');
						break;
					case 2:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_2').text() + '<icon></icon>') : (targetVal = 2);
						//$('#2G_channel').find('h3').html($('#channel_2').text() + '<icon></icon>');
						break;
					case 3:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_3').text() + '<icon></icon>') : (targetVal = 3);
						//$('#2G_channel').find('h3').html($('#channel_3').text() + '<icon></icon>');
						break;
					case 4:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_4').text() + '<icon></icon>') : (targetVal = 4);
						//$('#2G_channel').find('h3').html($('#channel_4').text() + '<icon></icon>');
						break;
					case 5:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_5').text() + '<icon></icon>') : (targetVal = 5);
						//$('#2G_channel').find('h3').html($('#channel_5').text() + '<icon></icon>');
						break;
					case 6:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_6').text() + '<icon></icon>') : (targetVal = 6);
						//$('#2G_channel').find('h3').html($('#channel_6').text() + '<icon></icon>');
						break;
					case 7:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_7').text() + '<icon></icon>') : (targetVal = 7);
						//$('#2G_channel').find('h3').html($('#channel_7').text() + '<icon></icon>');
						break;
					case 8:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_8').text() + '<icon></icon>') : (targetVal = 8);
						//$('#2G_channel').find('h3').html($('#channel_8').text() + '<icon></icon>');
						break;
					case 9:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_9').text() + '<icon></icon>') : (targetVal = 9);
						//$('#2G_channel').find('h3').html($('#channel_9').text() + '<icon></icon>');
						break;
					case 10:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_10').text() + '<icon></icon>') : (targetVal = 10);
						//$('#2G_channel').find('h3').html($('#channel_10').text() + '<icon></icon>');
						break;
					case 11:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_11').text() + '<icon></icon>') : (targetVal = 11);
						//$('#2G_channel').find('h3').html($('#channel_11').text() + '<icon></icon>');
						break;
					case 12:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_12').text() + '<icon></icon>') : (targetVal = 12);
						//$('#2G_channel').find('h3').html($('#channel_12').text() + '<icon></icon>');
						break;
					case 13:
						oprateType ? $('#2G_channel').find('h3').html($('#channel_13').text() + '<icon></icon>') : (targetVal = 13);
						//$('#2G_channel').find('h3').html($('#channel_13').text() + '<icon></icon>');
						break;
					}
					break;
				case 'txpower':
					switch (paramVal) {
					case 1:
						oprateType ? $('#2G_txpower').find('h3').html($('#txpower_1').text() + '<icon></icon>') : (targetVal = 1);
						//$('#2G_txpower').find('h3').html($('#txpower_1').text() + '<icon></icon>');
						break;
					case 100:
						oprateType ? $('#2G_txpower').find('h3').html($('#txpower_100').text() + '<icon></icon>') : (targetVal = 100);
						//$('#2G_txpower').find('h3').html($('#txpower_100').text() + '<icon></icon>');
						break;
					}
					break;
				case 'htmode':
					switch (paramVal) {
					case '0':
						oprateType ? $('#2G_htmode').find('h3').html($('#htmode_0').text() + '<icon></icon>') : (targetVal = '0');
						//$('#2G_htmode').find('h3').html($('#htmode_20').text() + '<icon></icon>');
						break;
					case '1':
						oprateType ? $('#2G_htmode').find('h3').html($('#htmode_1').text() + '<icon></icon>') : (targetVal = '1');
						//$('#2G_htmode').find('h3').html($('#htmode_20_40').text() + '<icon></icon>');
						break;
					case '2':
						console.log('出现错误，无意义');
						break;
					}
					break;
				case 'mode':
					switch (paramVal) {
					case 1:
						oprateType ? $('#2G_mode').find('h3').html($('#mode_1').text() + '<icon></icon>') : (targetVal = 1);
						//$('#2G_mode').find('h3').html($('#mode_11B').text() + '<icon></icon>');
						break;
					case 4:
						oprateType ? $('#2G_mode').find('h3').html($('#mode_4').text() + '<icon></icon>') : (targetVal = 4);
						//$('#2G_mode').find('h3').html($('#mode_11G').text() + '<icon></icon>');
						break;
					case 6:
						oprateType ? $('#2G_mode').find('h3').html($('#mode_6').text() + '<icon></icon>') : (targetVal = 6);
						//$('#2G_mode').find('h3').html($('#mode_11N_2G').text() + '<icon></icon>');
						break;
					case 7:
						oprateType ? $('#2G_mode').find('h3').html($('#mode_7').text() + '<icon></icon>') : (targetVal = 7);
						//$('#2G_mode').find('h3').html($('#mode_11GN').text() + '<icon></icon>');
						break;
					case 9:
						oprateType ? $('#2G_mode').find('h3').html($('#mode_9').text() + '<icon></icon>') : (targetVal = 9);
						//$('#2G_mode').find('h3').html($('#mode_11BGN_default').text() + '<icon></icon>');
						break;
					}
					break;
				}
				break;
			case wifiIndex.paramOperate.wifiBand[1]://5G
				switch (paramName) {
				case 'channel':
					switch (paramVal) {
					case 0:
						oprateType ? $('#5G_channel').find('h3').html($('#5G_auto').text() + '<icon></icon>') : (targetVal = 0);
						//$('#5G_channel').find('h3').html($('#5G_auto').text() + '<icon></icon>');
						break;
					case 149:
						oprateType ? $('#5G_channel').find('h3').html($('#5G_channel_149').text() + '<icon></icon>') : (targetVal = 149);
						//$('#5G_channel').find('h3').html($('#5G_channel_149').text() + '<icon></icon>');
						break;
					case 153:
						oprateType ? $('#5G_channel').find('h3').html($('#5G_channel_153').text() + '<icon></icon>') : (targetVal = 153);
						//$('#5G_channel').find('h3').html($('#5G_channel_153').text() + '<icon></icon>');
						break;
					case 157:
						oprateType ? $('#5G_channel').find('h3').html($('#5G_channel_157').text() + '<icon></icon>') : (targetVal = 157);
						//$('#5G_channel').find('h3').html($('#5G_channel_157').text() + '<icon></icon>');
						break;
					case 161:
						oprateType ? $('#5G_channel').find('h3').html($('#5G_channel_161').text() + '<icon></icon>') : (targetVal = 161);
						//$('#5G_channel').find('h3').html($('#5G_channel_161').text() + '<icon></icon>');
						break;
					case 165:
						oprateType ? $('#5G_channel').find('h3').html($('#5G_channel_165').text() + '<icon></icon>') : (targetVal = 165);
						//$('#5G_channel').find('h3').html($('#5G_channel_165').text() + '<icon></icon>');
						break;
					}
					break;
				case 'txpower':
					switch (paramVal) {
					case 1:
						oprateType ? $('#5G_txpower').find('h3').html($('#5G_txpower_1').text() + '<icon></icon>') : (targetVal = 1);
						//$('#5G_txpower').find('h3').html($('#5G_txpower_1').text() + '<icon></icon>');
						break;
					case 100:
						oprateType ? $('#5G_txpower').find('h3').html($('#5G_txpower_100').text() + '<icon></icon>') : (targetVal = 100);
						//$('#5G_txpower').find('h3').html($('#5G_txpower_100').text() + '<icon></icon>');
						break;
					}
					break;
				case 'htmode':
					switch (paramVal) {
					case '0':
						oprateType ? $('#5G_htmode').find('h3').html($('#5G_htmode_0').text() + '<icon></icon>') : (targetVal = '0');
						//$('#5G_htmode').find('h3').html($('#5G_htmode_20').text() + '<icon></icon>');
						break;
					case '1':
						oprateType ? $('#5G_htmode').find('h3').html($('#5G_htmode_1').text() + '<icon></icon>') : (targetVal = '1');
						//$('#5G_htmode').find('h3').html($('#5G_htmode_20_40').text() + '<icon></icon>');
						break;
					case '2':
						oprateType ? $('#5G_htmode').find('h3').html($('#5G_htmode_2').text() + '<icon></icon>') : (targetVal = '2');
						//$('#5G_htmode').find('h3').html($('#5G_htmode_20_40_80').text() + '<icon></icon>');
						break;
					}
					break;
				case 'mode':
					switch (paramVal) {
					case 1:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_1').text() + '<icon></icon>') : (targetVal = 1);
						//$('#5G_mode').find('h3').html($('#5G_mode_11B').text() + '<icon></icon>');
						break;
					case 2:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_2').text() + '<icon></icon>') : (targetVal = 2);
						//$('#5G_mode').find('h3').html($('#5G_mode_11A').text() + '<icon></icon>');
						break;
					case 3:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_3').text() + '<icon></icon>') : (targetVal = 3);
						//$('#5G_mode').find('h3').html($('#5G_mode_11A_B_G').text() + '<icon></icon>');
						break;
					case 4:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_4').text() + '<icon></icon>') : (targetVal = 4);
						//$('#5G_mode').find('h3').html($('#5G_mode_11G').text() + '<icon></icon>');
						break;
					case 5:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_5').text() + '<icon></icon>') : (targetVal = 5);
						//$('#5G_mode').find('h3').html($('#5G_mode_11A_B_G_N').text() + '<icon></icon>');
						break;
					case 6:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_6').text() + '<icon></icon>') : (targetVal = 6);
						//$('#5G_mode').find('h3').html($('#5G_mode_11N_2G').text() + '<icon></icon>');
						break;
					case 7:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_7').text() + '<icon></icon>') : (targetVal = 7);
						//$('#5G_mode').find('h3').html($('#5G_mode_11G_N').text() + '<icon></icon>');
						break;
					case 8:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_8').text() + '<icon></icon>') : (targetVal = 8);
						//$('#5G_mode').find('h3').html($('#5G_mode_11A_N').text() + '<icon></icon>');
						break;
					case 9:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_9').text() + '<icon></icon>') : (targetVal = 9);
						//$('#5G_mode').find('h3').html($('#5G_mode_11B_G_N').text() + '<icon></icon>');
						break;
					case 10:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_10').text() + '<icon></icon>') : (targetVal = 10);
						//$('#5G_mode').find('h3').html($('#5G_mode_11A_G_N').text() + '<icon></icon>');
						break;
					case 11:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_11').text() + '<icon></icon>') : (targetVal = 11);
						//$('#5G_mode').find('h3').html($('#5G_mode_11N_5G').text() + '<icon></icon>');
						break;
					case 12:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_12').text() + '<icon></icon>') : (targetVal = 12);
						//$('#5G_mode').find('h3').html($('#5G_mode_11B_G_N_A_AC').text() + '<icon></icon>');
						break;
					case 13:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_13').text() + '<icon></icon>') : (targetVal = 13);
						//$('#5G_mode').find('h3').html($('#5G_mode_11G_N_A_AC').text() + '<icon></icon>');
						break;
					case 14:
						oprateType ? $('#5G_mode').find('h3').html($('#5G_mode_14').text() + '<icon></icon>') : (targetVal = 14);
						//$('#5G_mode').find('h3').html($('#5G_mode_11N_A_AC').text() + '<icon></icon>');
						break;
					}
					break;
				}
				break;
			}
			return targetVal;
		},
		/**
		 * 保存wifi设置
		 */
		savewWifitInfo : function() {
			common.showMask();
			//保存2G设置
			var _2GWifiSim = this.getWifiSimValWithBand(wifiIndex.paramOperate.wifiBand[0]);                           //2G基本配置值（数组）
			var _2GWifiRadio = this.getWifiRadioValWithBand(wifiIndex.paramOperate.wifiBand[0]);                       //2G物理层值（数组）
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setWiFiInfo, _2GWifiSim, function(data){console.log('2G-sim--->' + data);});
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setRadioInfo, _2GWifiRadio, function(data){console.log('2G-redio--->' + data);});
			//保存5G设置
			var _5GWifiSim = this.getWifiSimValWithBand(wifiIndex.paramOperate.wifiBand[1]);                           //5G基本配置值（数组）
			var _5GWifiRadio = this.getWifiRadioValWithBand(wifiIndex.paramOperate.wifiBand[1]);                       //5G物理层值（数组）
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setWiFiInfo, _5GWifiSim, function(data){console.log('5G-sim--->' + data);});
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setRadioInfo, _5GWifiRadio, function(data){console.log('5G-radio--->' + data);});
			common.hideMask();
		},
		/**
		 * 根据band获取wifi基本配置
		 * @return params Array类型
		 */
		getWifiSimValWithBand : function(band) {
			var params = [];
			//判断2G与5G是否选用了相同的配置
			if ($('#same_2G_icon').hasClass('selected')) {
				var sameEnable = $('#2G_enable').hasClass('selected') ? false : true;                                       //是否启用
				var sameSsid = $('input[name="2G_ssid"]').val();                                                            //ssid
				var sameHidden = $('icon[name="2G_hidden"]').hasClass('selected') ? true : false;                           //是否隐藏
				var sameKey = $('input[name="2G_password"]').val();                                                         //密码
				var sameEncryption = this.getEncryptionWithBand(wifiIndex.paramOperate.wifiBand[0]);                        //加密
				//组织2G基本配置参数
				//参数顺序：band,enable,ssid,hidden,encryption,key
				params = [wifiIndex.paramOperate.wifiBand[0], sameEnable, sameSsid, sameHidden, sameEncryption, sameKey];
			}else {
				switch (band) {
				case wifiIndex.paramOperate.wifiBand[0]:
					var _2GEnable = $('#2G_enable').hasClass('selected') ? false : true;                                       //是否启用2G
					var _2GSsid = $('input[name="2G_ssid"]').val();                                                            //2G ssid
					var _2GHidden = $('icon[name="2G_hidden"]').hasClass('selected') ? true : false;                           //2G是否隐藏
					var _2GKey = $('input[name="2G_password"]').val();                                                         //2G密码
					var _2GEncryption = this.getEncryptionWithBand(wifiIndex.paramOperate.wifiBand[0]);                        //2G加密
					//组织2G基本配置参数
					//参数顺序：band,enable,ssid,hidden,encryption,key
					params = [wifiIndex.paramOperate.wifiBand[0], _2GEnable, _2GSsid, _2GHidden, _2GEncryption, _2GKey];
					break;
				case wifiIndex.paramOperate.wifiBand[1]:
					var _5GEnable = $('#5G_enable').hasClass('selected') ? false : true;                                       //是否启用5G
					var _5GSsid = $('input[name="5G_ssid"]').val();                                                            //5G ssid
					var _5GHidden = $('icon[name="5G_hidden"]').hasClass('selected') ? true : false;                           //5G是否隐藏
					var _5GKey = $('input[name="5G_password"]').val();                                                         //5G密码
					var _5GEncryption = this.getEncryptionWithBand(wifiIndex.paramOperate.wifiBand[1]);                        //5G加密
					//组织5G基本配置参数
					//参数顺序：band,enable,ssid,hidden,encryption,key
					params = [wifiIndex.paramOperate.wifiBand[1], _5GEnable, _5GSsid, _5GHidden, _5GEncryption, _5GKey];
					break;
				}
			}
			return params;
		},
		/**
		 * 根据band获取wifi物理层信息值
		 * @return params Array类型
		 */
		getWifiRadioValWithBand : function(band) {
			var params = [];
			switch (band) {
			case wifiIndex.paramOperate.wifiBand[0]:
				var _2GChannelEle = $('#2G_channel');
				var _2GTxpowerEle = $('#2G_txpower');
				var _2GModeEle = $('#2G_mode');
				var _2GHtmodeEle = $('#2G_htmode');
				var getChannelTargetVal;                     //2G信道用户选值
				var getTxpowerTargetVal;                     //2G功率用户选值
				var getModeTargetVal;                        //2G网络模式用户选值
				var getHtmodeTargetVal;                      //2G工作频宽用户选值
				//判断2G信道
				_2GChannelEle.find('a').each(function(){
					if (_2GChannelEle.find('h3').text() == $(this).text()) {
						var channelEleId = $(this).attr('id');
						getChannelTargetVal = (channelEleId == 'auto') ? 0 :channelEleId.substring(channelEleId.indexOf('_') + 1, channelEleId.length);
					}
				});
				//判断2G功率
				_2GTxpowerEle.find('a').each(function(){
					if (_2GTxpowerEle.find('h3').text() == $(this).text()) {
						var txpowerEleId = $(this).attr('id');
						getTxpowerTargetVal = txpowerEleId.substring(txpowerEleId.indexOf('_') + 1, txpowerEleId.length);
					}
				});
				//判断2G网络模式
				_2GModeEle.find('a').each(function(){
					if (_2GModeEle.find('h3').text() == $(this).text()) {
						var modeEleId = $(this).attr('id');
						getModeTargetVal = modeEleId.substring(modeEleId.indexOf('_') + 1, modeEleId.length);
					}
				});
				//判断2G工作频宽
				
				_2GHtmodeEle.find('a').each(function(){
					if (_2GHtmodeEle.find('h3').text() == $(this).text()) {
						var htmodeEleId = $(this).attr('id');
						getHtmodeTargetVal = htmodeEleId.substring(htmodeEleId.indexOf('_') + 1, htmodeEleId.length);
					}
				});
				//对应参数名取值
				var _2GChannel = wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[0],'channel',parseInt(getChannelTargetVal),false);     //2G信道
				var _2GTxpower = wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[0],'txpower',parseInt(getTxpowerTargetVal),false);     //2G功率
				var _2GMode = wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[0],'mode',parseInt(getModeTargetVal),false);              //2G网络模式
				var _2GHtmode = wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[0],'htmode',getHtmodeTargetVal,false);                  //2G工作频宽
				//组织返回值（因现在有一些参数还不明白文档中的是什么意思，故现在用文档提供的默认值代替）           
				//数组参数顺序：band,channel,htmode,txpower,beacon(未知),mode,apsd(未知),shortgi(未知),wmm(未知)
				params = [wifiIndex.paramOperate.wifiBand[0], _2GChannel, _2GHtmode, _2GTxpower, 100, _2GMode, false, true, true];
				break;
			case wifiIndex.paramOperate.wifiBand[1]:
				var _5GChannelEle = $('#5G_channel');
				var _5GTxpowerEle = $('#5G_txpower');
				var _5GModeEle = $('#5G_mode');
				var _5GHtmodeEle = $('#5G_htmode');
				var getChannelTargetVal;                     //5G信道用户选值
				var getTxpowerTargetVal;                     //5G功率用户选值
				var getModeTargetVal;                        //5G网络模式用户选值
				var getHtmodeTargetVal;                      //5G工作频宽用户选值
				//判断5G信道
				_5GChannelEle.find('a').each(function(){
					if (_5GChannelEle.find('h3').text() == $(this).text()) {
						var channelEleId = $(this).attr('id');
						getChannelTargetVal = (channelEleId == '5G_auto') ? 0 :channelEleId.substring(channelEleId.lastIndexOf('_') + 1, channelEleId.length);
					}
				});
				//判断5G功率
				_5GTxpowerEle.find('a').each(function(){
					if (_5GTxpowerEle.find('h3').text() == $(this).text()) {
						var txpowerEleId = $(this).attr('id');
						getTxpowerTargetVal = txpowerEleId.substring(txpowerEleId.lastIndexOf('_') + 1, txpowerEleId.length);
					}
				});
				//判断5G网络模式
				_5GModeEle.find('a').each(function(){
					if (_5GModeEle.find('h3').text() == $(this).text()) {
						var modeEleId = $(this).attr('id');
						getModeTargetVal = modeEleId.substring(modeEleId.lastIndexOf('_') + 1, modeEleId.length);
					}
				});
				//判断5G工作频宽
				
				_5GHtmodeEle.find('a').each(function(){
					if (_5GHtmodeEle.find('h3').text() == $(this).text()) {
						var htmodeEleId = $(this).attr('id');
						getHtmodeTargetVal = htmodeEleId.substring(htmodeEleId.lastIndexOf('_') + 1, htmodeEleId.length);
					}
				});
				//对应参数名取值
				var _5GChannel = wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[1],'channel',parseInt(getChannelTargetVal),false);     //5G信道
				var _5GTxpower = wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[1],'txpower',parseInt(getTxpowerTargetVal),false);     //5G功率
				var _5GMode = wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[1],'mode',parseInt(getModeTargetVal),false);              //5G网络模式
				var _5GHtmode = wifiIndex.echoWifiRadioInfo(wifiIndex.paramOperate.wifiBand[1],'htmode',getHtmodeTargetVal,false);                  //5G工作频宽
				//组织返回值（因现在有一些参数还不明白文档中的是什么意思，故现在用文档提供的默认值代替）           
				//数组参数顺序：band,channel,htmode,txpower,beacon(未知),mode,apsd(未知),shortgi(未知),wmm(未知)
				params = [wifiIndex.paramOperate.wifiBand[1], _5GChannel, _5GHtmode, _5GTxpower, 100, _5GMode, false, true, true];
				break;
			}
			return params;
		},
		/**
		 * 根据band获取Encryption值
		 */
		getEncryptionWithBand : function(band) {
			var encryption = '';
			switch (band) {
			case wifiIndex.paramOperate.wifiBand[0]:
				switch ($('#2G_authMode').find('h3').text()) {
				case $('#none_enc').text()://不加密
					encryption = 'none';
					break;
				case $('#wpa_enc').text()://WPA-PSK加密
					switch ($('#2G_enctype').find('h3').text()) {
					case $('#aes_tkip').text()://AES/TKIP兼容
						encryption = 'WPAPSK+TKIPAES';
						break;
					case $('#tkip').text()://TKIP兼容
						encryption = 'WPAPSK+TKIP';
						break;
					case $('#aes').text()://AES兼容
						encryption = 'WPAPSK+AES';
						break;
					}
					break;
				case $('#wpa2_enc').text()://WPA2-PSK加密
					switch ($('#2G_enctype').find('h3').text()) {
					case $('#aes_tkip').text()://AES/TKIP兼容
						encryption = 'WPA2PSK+TKIPAES';
						break;
					case $('#tkip').text()://TKIP兼容
						encryption = 'WPA2PSK+TKIP';
						break;
					case $('#aes').text()://AES兼容
						encryption = 'WPA2PSK+AES';
						break;
					}
					break;
				}
				break;
			case wifiIndex.paramOperate.wifiBand[1]:
				switch ($('#5G_authMode').find('h3').text()) {
				case $('#5G_none_enc').text()://不加密
					encryption = 'none';
					break;
				case $('#5G_wpa_enc').text()://WPA-PSK加密
					switch ($('#5G_enctype').find('h3').text()) {
					case $('#5G_aes_tkip').text()://AES/TKIP兼容
						encryption = 'WPAPSK+TKIPAES';
						break;
					case $('#5G_tkip').text()://TKIP兼容
						encryption = 'WPAPSK+TKIP';
						break;
					case $('#5G_aes').text()://AES兼容
						encryption = 'WPAPSK+AES';
						break;
					}
					break;
				case $('#5G_wpa2_enc').text()://WPA2-PSK加密
					switch ($('#5G_enctype').find('h3').text()) {
					case $('#5G_aes_tkip').text()://AES/TKIP兼容
						encryption = 'WPA2PSK+TKIPAES';
						break;
					case $('#5G_tkip').text()://TKIP兼容
						encryption = 'WPA2PSK+TKIP';
						break;
					case $('#5G_aes').text()://AES兼容
						encryption = 'WPA2PSK+AES';
						break;
					}
					break;
				}
				break;
			}
			return encryption;
		}
}
//2G基本信息临时cache
var _2GSimInfo;
//5G基本信息临时cache
var _5GSimInfo;
/**
 * dom加载完成即执行 
 */
$(function(){
	wifiIndex.init();
});

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
				getWiFiInfo    : 'WIFI.getWiFiInfo',//获取wifi配置信息
				getRadioInfo   : 'WIFI.getRadioInfo',//获取wifi物理层信息
				setWiFiInfo    : 'WIFI.setWiFiInfo',//设置wifi配置信息
				setRadioInfo   : 'WIFI.setRadioInfo',//设置wifi物理层信息
				enableWiFiInfo : 'WIFI.enableWiFiInfo'//使能wifi配置
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.maskShow = new maskCtrl(4, common.hideMask, common);
			for (var i = 0; i < this.paramOperate.wifiBand.length; i++) {
				this.getWifiInfo(this.paramOperate.wifiBand[i]);
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
				var divEle = $('.same_2G');
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
			
			wifiIndex.echoWifiInfo(data,band);
		},
		/**
		 * 回显wifi配置信息
		 */
		echoWifiInfo : function(data,band) {
			var enable = $('icon[name="' + band + '_enable"]');
			if (data.enable) {
				enable.removeClass('selected');
			}else {
				enable.addClass('selected');
			}

			$('input[name="' + band + '_ssid"]').val(data.ssid);
			var hidden = $('icon[name="' + band + '_hidden"]');
			if (data.hidden) {
				hidden.removeClass('selected');
			}else {
				hidden.addClass('selected');
			}
			$('input[name="' + band + '_password"]').val(data.key);

			if (data.encryption == 'OPEN') {
				$('#' + band + '_suanfa_li').hide();
				$('#' + band + '_password_li').hide();
				$('#' + band + '_authMode').find('h3').html($('#' + band + '_authMode' + ' a[value=OPEN]').text() + '<icon></icon>');
				$('#' + band + '_authMode').find('h3').attr('value', 'OPEN');
			}else {
				/*是否需要check类型和是否匹配 ？*/
				var encryption = data.encryption.split('+', 2);
				var authMode = encryption[0];
				var encType  = encryption[1];
				$('#' + band + '_authMode').find('h3').html($('#' + band + '_authMode' + ' a[value=' + authMode + ']').text() + '<icon></icon>');
				$('#' + band + '_authMode').find('h3').attr('value', authMode);
				$('#' + band + '_enctype').find('h3').html($('#' + band + '_enctype' + ' a[value=' + encType + ']').text() + '<icon></icon>');
				$('#' + band + '_enctype').find('h3').attr('value', encType);
			}
			this.getRadioInfo(band); 
			
			if ((wifiIndex.maskShow != null) && wifiIndex.maskShow)  {
				wifiIndex.maskShow.decRef();      
			}
		},

		/**
		 * 获取wifi物理层信息
		 */
		getRadioInfo : function(band) {
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.getRadioInfo, band, this.radioInfoCallBack, band);
		},
		/**
		 * wifi物理层信息回调
		 */
		radioInfoCallBack : function(data,band) {
			switch (band) {
				case wifiIndex.paramOperate.wifiBand[0]:
					//cache 2G 基本配置信息
					_2GRadioInfo = data;
					break;
				case wifiIndex.paramOperate.wifiBand[1]:
					//cache 5G 基本配置信息
					_5GRadioInfo = data;
					break;
			}
			if ((null != _2GSimInfo && null != _5GSimInfo && _2GSimInfo && _5GSimInfo) 
			   && (null != _2GRadioInfo && null != _5GRadioInfo && _2GRadioInfo && _5GRadioInfo)) {
				if ((_2GSimInfo.hidden == _5GSimInfo.hidden) && (_2GSimInfo.encryption == _5GSimInfo.encryption)
				 && (_2GRadioInfo.txpower == _5GRadioInfo.txpower) && (_2GRadioInfo.beacon == _5GRadioInfo.beacon)
				 && ((_2GSimInfo.encryption == 'OPEN') || (_2GSimInfo.key == _5GSimInfo.key))) 
				{
					$('#same_2G_icon').addClass('selected');
					$('.same_2G').css('display','none');
				}else {
					$('#same_2G_icon').removeClass('selected');
					$('.same_2G').css('display','block');
				}
			}


			wifiIndex.echoRadioInfo(data, band); 
		},

		/**
		 * 回显wifi物理层信息
		 */
		echoRadioInfo : function(data, band) {
			/* 回显channel */
			$('#' + band + '_channel').find('h3').html($('#' + band + '_channel' + ' a[value=' + data.channel + ']').text() + '<icon></icon>');
			$('#' + band + '_channel').find('h3').attr('value', data.channel);
			
			/* 回显htmode */
			$('#' + band + '_htmode').find('h3').html($('#' + band + '_htmode' + ' a[value=' + data.htmode + ']').text() + '<icon></icon>');
			$('#' + band + '_htmode').find('h3').attr('value', data.htmode);
			
			/* 回显mode */
			$('#' + band + '_mode').find('h3').html($('#' + band + '_mode' + ' a[value=' + data.mode + ']').text() + '<icon></icon>');
			$('#' + band + '_mode').find('h3').attr('value', data.mode);

			/* 回显txpower */
			$('#' + band + '_txpower').find('h3').html($('#' + band + '_txpower' + ' a[value=' + data.txpower + ']').text() + '<icon></icon>');
			$('#' + band + '_txpower').find('h3').attr('value', data.txpower);

			/* 回显beacon间隔 */
			$('input[name="' + band + '_beacon"]').val(data.beacon);

			if ((wifiIndex.maskShow != null) && wifiIndex.maskShow)  {
				wifiIndex.maskShow.decRef();      
			}
		},
				/**
		 * 保存wifi设置
		 */
		savewWifitInfo : function() {
			common.showMask();
			//保存2G设置
			var _2GWifiSim   = this.getWifiSimValWithBand(wifiIndex.paramOperate.wifiBand[0]);                           //2G基本配置值（数组）
			var _2GWifiRadio = this.getWifiRadioValWithBand(wifiIndex.paramOperate.wifiBand[0]);                       //2G物理层值（数组）
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setWiFiInfo, _2GWifiSim, function(data){console.log('2G-sim--->' + data);});
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setRadioInfo, _2GWifiRadio, function(data){console.log('2G-redio--->' + data);});
			//保存5G设置
			var _5GWifiSim = this.getWifiSimValWithBand(wifiIndex.paramOperate.wifiBand[1]);                           //5G基本配置值（数组）
			var _5GWifiRadio = this.getWifiRadioValWithBand(wifiIndex.paramOperate.wifiBand[1]);                       //5G物理层值（数组）
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setWiFiInfo, _5GWifiSim, function(data){console.log('5G-sim--->' + data);});
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.setRadioInfo, _5GWifiRadio, function(data){console.log('5G-radio--->' + data);});
			callRpc(rpcUrl + this.paramOperate.businessType + token, this.paramOperate.method.enableWiFiInfo, 'double', function(data){
				console.log('5G-radio--->' + data);
				common.hideMask();
				});
		},
		/**
		 * 根据band获取wifi基本配置
		 * @return params Array类型
		 */
		getWifiSimValWithBand : function(band) {
			var params = [];
			var authMode;
			var encType;
			var encryption; 
			var key;
			var hidden;


			//判断2G与5G是否选用了相同的配置
			if ($('#same_2G_icon').hasClass('selected')) {
				hidden   = $('icon[name="2G_hidden"]').hasClass('selected') ? true : false;                           //是否隐藏
				key      = $('input[name="2G_password"]').val();                                                         //密码
				authMode = $('#2G_authMode').find('h3').attr('value');
				if (authMode != 'OPEN') {
					encType  = $('#2G_enctype').find('h3').attr('value');
				}
			} else {
				hidden   = $('icon[name='  + band + '_hidden]').hasClass('selected') ? true : false;                           //是否隐藏
				key      = $('input[name=' + band + '_password]').val();                                                         //密码
				authMode = $('#' + band + '_authMode').find('h3').attr('value');
				if (authMode != 'OPEN'){
					encType  = $('#' + band + '_enctype').find('h3').attr('value');
				}
			}

			var enable = $('icon[name=' + band + '_enable]').hasClass('selected') ? false : true;                                     //是否启用
			var ssid   = $('input[name=' + band + '_ssid]').val();                                                            //ssid
			if (authMode == 'OPEN') {
				encryption = 'none'; 
			} else {
				encryption = authMode + '+' + encType;  
			}

			params = [band, enable, ssid, hidden, encryption, key];
			return params;
		},
		/**
		 * 根据band获取wifi物理层信息值
		 * @return params Array类型
		 */
		getWifiRadioValWithBand : function(band) {
			var params = [];
			if ($('#same_2G_icon').hasClass('selected')) {
				var txpower = $('#2G_txpower').find('h3').attr('value');
				var beacon  = $('input[name="2G_beacon"]').val();                                                         //beacon间隔
			} else {
				var txpower = $('#' + band + '_txpower').find('h3').attr('value');
				var beacon  = $('input[name=' + band + '_beacon]').val();                                                         //beacon间隔
			}
			var channel = $('#' + band + '_channel').find('h3').attr('value');
			var mode    = $('#' + band + '_mode').find('h3').attr('value');
			var htmode  = $('#' + band + '_htmode').find('h3').attr('value');
			params = [band, parseInt(channel), parseInt(htmode), parseInt(txpower), parseInt(beacon), parseInt(mode)];
			return params;
		},
}
//2G基本信息临时cache
var _2GSimInfo;
//5G基本信息临时cache
var _5GSimInfo;
//2GRadio信息临时cache
var _2GRadioInfo;
//5GRaido信息临时cache
var _5GRadioInfo;
/**
 * dom加载完成即执行 
 */
$(function(){
	wifiIndex.init();
});

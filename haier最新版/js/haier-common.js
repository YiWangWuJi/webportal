/**
 *  引用公共js-rpc
 *  @see 供页面单独调用使用
 *  @author renwei
 */
document.write('<script type="text/javascript" src="js/jsonrpc.js"></script>');
document.write('<script type="text/javascript" src="js/common-rpc.js"></script>');	
/**
*	common javascript.
*	@Author Nlwy update 2015-07-04.
*	Copyright haier 2015.
*	@param str{String}
*/
var common = {
	/*
	*	dom集合
	*/
	el : {
		navLi  : "nav",			//首页导航
		radio  : ".radio_list",	//单选按钮
		radioc : ".radiocheck",	//选择按钮
		pw	   : ".password", 	//密码输入框
		check  : ".checkbox", 	//开关按钮
		select : ".select",		//下拉框
		iptext : ".iptext",		//DNS地址
		slide  : "i.open",		//收缩箭头
		infor  : ".infor",		//右边导航
		device : ".cdevice",	//连接设备管理器
		editun : ".wan_select",	//设备名称编辑
		home   : ".home_but"	//家长设置打开
	},
	/*
	 * interval集合
	 */
	intervalList : {
		chartsInter : {},//路由状态--->图表动态interval
	},
	/*
	*	页面加载完需要运行的方法不包括图片realy
	*/
	showReady: function(){
		/*
		*	默认首页加载的是路由状态
		*/
		common.history.getBrowseUrl();
	},
	/*
	*	页面加载完需要运行的方法包括图片load
	*/
	showLoad : function(){
		this.events.navEvent();
		this.events.radioList();
		this.events.passWord();
		this.events.checkBox();
		this.events.selectList();
		this.events.cdeviceList();
		this.events.ipTextEmpty();
		this.events.slideUL();
		this.events.edvEdit();
		this.events.bindLogout();
		this.functions.getNavIndex();
	},
	/*
	*	显示遮罩
	*	@param {value} string
	*/
	showMask : function(value){
		if(!value){ value = "正在加载中..."}
		if($("#mask").length == 0){
			var str = "<section id='mask'><aside><div class='spinner'><div class='spinner-container container1'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div><div class='spinner-container container2'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div><div class='spinner-container container3'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div></div><p>"+value+"</p></aside></section>";
			$("body").append(str);
		}
	},
	/*
	*	隐藏遮罩
	*/
	hideMask : function(){
		$("#mask").remove();
	},
	/*
	*	方法集合
	*/
	functions : {
		/*
		*	当前选择的功能
		*/
		getNavIndex : function(){
			if(common.localdata.getSiData("index")){$(common.el.navLi).eq(parseInt(common.localdata.getSiData("index"))).addClass("now");}
		},
		/*
		*	导航确定当前状态
		*	@param {number} index
		*/
		headerNow : function(index){
			$(common.el.navLi).find(" > ul > li").removeAttr("class").eq(index).addClass("now");
		},
		/*
		*	异步加载信息部分
		*	@param {number} index
		*/
		loadInfor: function(index){
			//加载结束回调
			getUrl = function(url){
				$(common.el.infor).load(url,function(){
					common.showLoad();
				});
			};
			//向浏览器存历史记录
			common.history.setBrowseUrl(index);
			//切换的页面
			switch(index){
				case 0 :
					getUrl("route-state.html");
				break;
				case 1 :
					common.stopInterval();
					getUrl("connecting-device.html");
				break;
				case 2 :
					common.stopInterval();
					getUrl("wan-setting.html");
				break;
				case 3 :
					common.stopInterval();
					getUrl("lan-setting.html");
				break;
				case 4 :
					common.stopInterval();
					getUrl("luyoubao.html");
				break;
				case 5 :
					common.stopInterval();
					getUrl("wifi-setting.html");
				break;
				case 6 :
					common.stopInterval();
					getUrl("system-setting.html");
				break;
				case 7 :
					common.stopInterval();
					getUrl("running-state.html");
				break;
			}
		}
	},
	/*
	*	事件集合
	*/
	events : {
		/*
		*	首页导航切换
		*/
		navEvent : function(){
			$(common.el.navLi).off().on("click"," > ul > li",function(){
				if(!$(this).hasClass("now")){
					common.functions.loadInfor($(this).index());
					$(this).siblings().removeAttr("class").end().addClass("now");
				}
			});
		},
		/*
		*	单选按钮切换
		*/
		radioList : function(){
			$(common.el.radio).off().on("click","label",function(){
				if(!$(this).find(".radio").hasClass("selected")){
					$(common.el.radio).find(".radio").removeClass("selected");
					$(this).find(".radio").addClass("selected");
					$("ul[id*=setting_]").hide();
					$("#setting_"+$(this).index()).show();
				}
			});

			

		},
		/*
		*	连接设备管理切换cdevice
		*/
		cdeviceList : function(){
			$(common.el.device).off().on("click"," h2 > label",function(){
				if(!$(this).hasClass("selected")){
					$(common.el.device).find(" h2 > label").removeClass("selected");
					$(this).addClass("selected");
					$("[id*=device_]").hide();
					$("#device_"+$(this).index()).show();
				}
			});
		},
		/*
		*	密码输入框明文显示
		*/
		passWord : function(){
			$(common.el.pw).find("icon").off().on({
				mouseenter : function(){
					$(this).prev().attr("type","text");
				},
				mouseleave: function(){
					$(this).prev().attr("type","password");
				}
			})
		},
		/*
		*	开关按钮
		*/
		checkBox : function(){
			$(common.el.check).off().on("click",function(){
				$(this).toggleClass("selected");
			});
		},
		/*
		*	下拉选择框
		*/
		selectList : function(){
			$(common.el.select).off().on("click",function(e){
				e.stopPropagation();
				if(!$(this).hasClass("open")){
					$(common.el.select).removeClass("open");
					$("aside").slideUp(100);
				};
				$(this).toggleClass("open");
				$(this).find("aside").slideToggle(100);
			}).find("a").off().on("click",function(){
				$(this).attr("id") == "need_con" ? $("#idle_time").css('display','inline') 
						: $("#idle_time").css('display','none');
				$(this).parent().parent().find("h3").html($(this).html()+"<icon></icon>");

				var selValue = $(this).attr('value');
				if (selValue != undefined) {
					$(this).parent().parent().find("h3").attr("value", selValue);
					if ((selValue == 'OPEN') || (selValue == 'WPAPSK') || (selValue == 'WPA2PSK')) {
						var bandPattern = /[25G]+/
						var band = $(this).parent().parent().attr("id");
						var band = band.match(bandPattern);
					
						if (selValue == 'OPEN') {
							$('#' + band + '_suanfa_li').hide();
							$('#' + band + '_password_li').hide();
						} else {
							$('#' + band + '_suanfa_li').show();
							$('#' + band + '_password_li').show();
						}
					}
					
				}
			});
			$(window).on("click",function(){
				$(common.el.select).removeClass("open").find("aside").slideUp(100);
			});
		},
		/*
		*	DNS清零
		*/
		ipTextEmpty : function(){
			$(common.el.iptext).find("icon").off().on("click",function(){
				$(this).prev().find("input").val("");
			});
		},
		/*
		*	收缩展开
		*/
		slideUL : function(){
			$(common.el.slide).off().on("click",function(){
				$(this).toggleClass("down");
				$(this).parent().parent().next().slideToggle(300);
			});
		},
		/*
		*	设备编辑
		*/
		edvEdit : function(){
			var name;//用来存设备名
			//点击编辑按钮进入编辑状态
			$(common.el.editun).on("click",".editun icon.edit",function(){
				name = $(this).parent().find("input").val();
				$(this).parent().find("input").addClass("edit").removeAttr("disabled");
				$(this).parent().find("icon.edit").hide();
				$(this).parent().find("icon.enter,icon.close,a").css("display","inline-block");
			});
			//点击红叉清空设备名
			$(common.el.editun).on("click",".editun icon.close",function(){
				$(this).parent().find("input").val("");
			});
			//还原默认设备名
			$(common.el.editun).on("click",".editun a",function(){
				$(this).parent().find("input").val(name);
			});
			//点击确认修改设备名（如果为空白用默认名）
			$(common.el.editun).on("click",".editun icon.enter",function(){
				if(!$(this).parent().find("input").val()){
					$(this).parent().find("input").val(name);
				};
				$(this).parent().find("input").removeClass("edit").attr("disabled","disabled");
				$(this).parent().find("icon.edit").css("display","inline-block");
				$(this).parent().find("icon.enter,icon.close,a").hide();
			});
		},
		/**
		 * 退出按钮绑定
		 */
		bindLogout : function() {
			$('#logout').click(function(){
				common.logout();
			})
		}
	},
	history : {
		/*
		*	向浏览器添加历史
		*	@param {josn} state
		*	@param {string} title
		*	@param {string} hash
		*/
		pushHistory : function(state, title, hash) {
			if(!!window.history && history.pushState){
				history.pushState(state, title, hash);
			};
		},
		/*
		*	替换浏览器历史不再增加history.length,参数和pushHistory一样
		*/
		replaceHistory : function(state, title, hash) {
			if(!!window.history && history.replaceState){
				history.replaceState(state, title, hash);
			};
		},
		/*
		*	获取浏览器地址hash
		*/
		getHash	: function() {
			return window.location.hash.replace("#","");
		},
		/*
		*	判断用户访问的页面
		*/
		getBrowseUrl : function() {

			switch(common.history.getHash()){
				case "" :
				case "routeState" :
					common.functions.loadInfor(0);
					common.functions.headerNow(0);
				break;
				case "connectingDevice" :
					common.functions.loadInfor(1);
					common.functions.headerNow(1);
				break;
				case "wanSetting" :
					common.functions.loadInfor(2);
					common.functions.headerNow(2);
				break;
				case "lanSetting" :
					common.functions.loadInfor(3);
					common.functions.headerNow(3);
				break;
				case "luyoubao" :
					common.functions.loadInfor(4);
					common.functions.headerNow(4);
				break;
				case "wifiSetting" :
					common.functions.loadInfor(5);
					common.functions.headerNow(5);
				break;
				case "systemSetting" :
					common.functions.loadInfor(6);
					common.functions.headerNow(6);
				break;
				case "runningState" :
					common.functions.loadInfor(7);
					common.functions.headerNow(7);
				break;
				default :
					return false;
				break;
			}

		},
		/*
		*	存储浏览器历史记录
		*/
		setBrowseUrl : function(index) {

			switch(index){
				case 0 :
					this.pushHistory({page : 0},"路由状态","#routeState");
				break;
				case 1 :
					this.pushHistory({page : 1},"连接设备管理器","#connectingDevice");
				break;
				case 2 :
					this.pushHistory({page : 2},"互联网WAN设置","#wanSetting");
				break;
				case 3 :
					this.pushHistory({page : 3},"局域网LAN设置","#lanSetting");
				break;
				case 4 :
					this.pushHistory({page : 4},"路由宝","#luyoubao");
				break;
				case 5 :
					this.pushHistory({page : 5},"无线设置","#wifiSetting");
				break;
				case 6 :
					this.pushHistory({page : 6},"系统设置","#systemSetting");
				break;
				case 7 :
					this.pushHistory({page : 7},"运行状态","#runningState");
				break;
				default :
					return false;
				break;
			}

		}
	},
	localdata : {
		/*
		*	本地存储永久保存需要手动删除
		*	@param {string} key,value
		*/
		setLoData : function(key,value){
			localStorage.setItem(key,value);
		},
		/*
		*	临时存储当关闭浏览器后自动删除
		*	@param {string} key,value
		*/
		setSiData : function(key,value){
			sessionStorage.setItem(key,value);
		},
		/*
		*	获取本地数据
		*	@param {string} key
		*/
		getLoData : function(key){
			return localStorage.getItem(key);
		},
		/*
		*	获取本地数据
		*	@param {string} key
		*/
		getSiData : function(key){
			return sessionStorage.getItem(key);
		}
	},
	/**
	 * 停止interval
	 */
	stopInterval : function() {
		common.isEmptyObject(common.intervalList.chartsInter) ? clearInterval(common.intervalList.chartsInter) : null;
	},
	/**
	 * 判断空对象
	 */
	isEmptyObject : function(obj) {
	    for(var n in obj){return false;}
	    return true;
	},
	/**
	 * 获取域名(没有加端口的获取，如果有需要，以后加上)
	 */
	getDomain : function() {
		var pro = window.location.protocol;
		var domain = window.location.host;
		return pro + '//' + domain + '/';
	},
	/**
	 * 获取token(如果有就获取，如果没有就跳转到登录页面)
	 */
	getToken : function() {
		var token = common.localdata.getSiData('token');
		if ((!token || '' == token || null == token) && window.location.href.indexOf('login.html') <= 0) {common.logout();return;}
		return token;
	},

	/**
	 * 获取rpcURL
	 */
	getRpcURL: function() {
		return 'http://' + document.domain + '/api/v1/';
	},

	/**
	 * 退出
	 */
	logout : function() {
		common.localdata.setSiData('token','');//清空token
		window.location.href = '/login.html';
		return;
	}


};

function maskCtrl(value, callBack, scope) {
	this.ref      = value;
	this.callBack = callBack;
	this.scope    = scope;
	this.scope.showMask();
}

maskCtrl.prototype = {
	constructor : maskCtrl,
	decRef      : function() {
		if (this.ref == 0) {
			return;
		}
		if (--this.ref == 0) {
			this.callBack.call(this.scope);
		}
	}
}

/**
 * 本地存储MTU公共方法
 * @see data "connect类型:MTU值" (json数据)
 */
var setMTUWithConnectType = function(data) {
	
}
/**
 * 本地获取MTU公共方法
 * @see connectType connect类型 (string数据)
 */
var getMTUWithConnectType = function(connectType) {
	
}
$(document).on("ready",function(){
	common.showReady();
});
$(window).on("load",function(){
	common.showLoad();
});
$(window).on("popstate",function(){
	common.history.getBrowseUrl();
});
/**
 * 临时写死调用rpc的url(业务类型和token需要自己拼接)
 */
var rpcUrl = common.getRpcURL();
/**
 * 临时写死token
 */
var token = '?token=' + common.getToken();

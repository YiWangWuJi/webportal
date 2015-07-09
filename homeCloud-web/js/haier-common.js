/**
 *  引用公共js-rpc
 *  @see 供页面单独调用使用
 *  @author renwei
 */
document.write('<script type="text/javascript" src="js/jsonrpc.js"></script>');
document.write('<script type="text/javascript" src="js/common-rpc.js"></script>');
/**
 * 临时写死调用rpc的url(业务类型和token需要自己拼接)
 */
var rpcUrl = 'http://192.168.68.2/api/v1/';
/**
 * 临时写死token
 */
var token = '?token=5d5f6e93b7f042a89927cd5c1e4d4d81';
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
		navLi : "nav",			//首页导航
		radio : ".radio_list",	//单选按钮
		radioc: ".radiocheck",	//选择按钮
		pw	  : ".password", 	//密码输入框
		check : ".checkbox", 	//开关按钮
		select: ".select",		//下拉框
		iptext: ".iptext",		//DNS地址
		slide : "i.open"		//收缩箭头
	},
	/*
	*	页面加载完需要运行的方法不包括图片realy
	*/
	showReady: function(){
		this.functions.loadNavHeader();
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
		this.events.ipTextEmpty();
		this.events.slideUL();
		this.functions.getNavIndex();
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
		*	加载导航和头部
		*/
		loadNavHeader: function(){
			$("nav").load("nav.html");
			$("#header").load("header.html");
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
			$(common.el.navLi).on("click"," > ul > li",function(){
				if(!$(this).hasClass("now")){
					$(this).siblings().removeAttr("class").end().addClass("now");
				}
			});
		},
		/*
		*	单选按钮切换
		*/
		radioList : function(){
			$(common.el.radio).on("click","label",function(){
				if(!$(this).find(".radio").hasClass("selected")){
					$(common.el.radio).find(".radio").removeClass("selected");
					$(this).find(".radio").addClass("selected");
					$("ul[id*=setting_]").hide();
					$("#setting_"+$(this).index()).show();
				}
			});
			$(common.el.radioc).on("click",function(){
				$(this).toggleClass("selected");
			});

		},
		/*
		*	密码输入框明文显示
		*/
		passWord : function(){
			$(common.el.pw).find("icon").on({
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
			$(common.el.check).on("click",function(){
				$(this).toggleClass("selected");
			});
		},
		/*
		*	下拉选择框
		*/
		selectList : function(){
			$(common.el.select).on("click",function(e){
				e.stopPropagation();
				if(!$(this).hasClass("open")){
					$(common.el.select).removeClass("open");
					$("aside").slideUp(100);
				};
				$(this).toggleClass("open");
				$(this).find("aside").slideToggle(100);
			}).find("a").on("click",function(){
				$(this).parent().parent().find("h3").html($(this).html()+"<icon></icon>");
			});
			$(window).on("click",function(){
				$(common.el.select).removeClass("open").find("aside").slideUp(100);
			});
		},
		/*
		*	DNS清零
		*/
		ipTextEmpty : function(){
			$(common.el.iptext).find("icon").on("click",function(){
				$(this).prev().find("input").val("");
			});
		},
		/*
		*	收缩展开
		*/
		slideUL : function(){
			$(common.el.slide).parent().on("click",function(){
				$(this).find("i").toggleClass("down");
				$(this).parent().next().slideToggle(300);
			});
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

			switch(this.getHash()){
				case "" :
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
					//this.pushHistory({page : 1},"WAN设置页","#");
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
	}

};
$(document).on("ready",function(){
	common.showReady();
});
$(window).on("load",function(){
	common.showLoad();
});

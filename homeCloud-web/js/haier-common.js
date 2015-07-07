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
		navLi : "nav ul li",//首页导航
	},
	/*
	*	页面加载完需要运行的方法包括图片load
	*/
	showLoad : function(){
		this.events.navEvent();
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
			if($(common.el.navLi)){
				$(common.el.navLi).on("click",function(){
					if(!$(this).hasClass("now")){
						try{
							common.localdata.setSiData("index",$(this).index());
						}catch(e){
							//alert(e);
						}
						$(this).siblings().removeAttr("class").end().addClass("now");
					}
				});
			}
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
					this.pushHistory({page : 1},"WAN设置页","#recharge");
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
$(window).on("load",function(){
	common.showLoad();
});
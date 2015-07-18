/**
 * login相关js
 * @author renwei
 */
var loginIndex = {
		/**
		 * 业务相关集合
		 */
		paramOperate : {
			/**
			 * 业务类型
			 */
			businessType : 'user',
			/**
			 * 方法集合
			 */
			method : {
				login : 'login'//登录
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.checkSupportHtml5();
			this.eventList.bindLoginButton();
		},
		/**
		 * 事件绑定集合
		 */
		eventList : {
			/**
			 * 绑定登录按钮点击事件
			 */
			bindLoginButton : function() {
				$('button').click(function(){
					loginIndex.login();
				});
			}
		},
		/**
		 * 登录
		 */
		login : function() {
			console.log(1);
			var userName = 'homecloud';
			var password = $('input').val();
			var params = [[userName, password]];
			if ('' == password) {
				alert('密码不能为空！');
				return;
			}
			var url = rpcUrl + this.paramOperate.businessType;
			var method = this.paramOperate.method.login;
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onreadystatechange = function () {
				if (xhr.readyState != 4) {
					return;
				}
				if (xhr.status != 200) {
					return;
				}
				loginIndex.loginCallBack(JSON.parse(xhr.responseText).result);
			};
			xhr.send('{"method":"' + method + '","params":["' + userName + '","' + password + '"]}');
		},
		/**
		 * 登录回调
		 */
		loginCallBack : function(data) {
			if (!data) {
				alert('密码错误');
				return;
			}
			//存储到sessionStorage
			console.log('token------>' + token);
			common.localdata.setSiData('token',data);
			window.location.href = common.getDomain() + '#routeState';
		},
		/**
		 * 判断是否支持html5
		 */
		checkSupportHtml5 : function() {
			 if (!window.applicationCache) {
			 	var password = $('input[type="password"]');
			 	var button = $('button');
            	var passLi = password.parent();
            	var buttonLi = button.parent();
            	password.remove();
            	button.remove();
            	passLi.html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的浏览器不支持html5');
            	buttonLi.html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请升级或更换浏览器');
	         }
		}
		
}

/**
 * dom加载完成即执行 
 */
$(function(){
	loginIndex.init();
});

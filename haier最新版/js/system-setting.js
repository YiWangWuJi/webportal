/**
 * system-setting相关js
 * @author renwei
 * 
 * @problem 没有在接口文档中找到获取密码的接口
 */
var systemIndex = {
		/**
		 * 业务相关集合
		 */
		paramOperate : {
			/**
			 * 业务类型
			 */
			businessServiceType :'service',
			businessRouterType : 'router',
			businessUpdateType : 'update',
			businessUserType   : 'user',
			/**
			 * 方法集合
			 */
			method : {
				curversion : 'FIRMWARE.curversion',//获取版本信息
				update     : 'FIRMWARE.update',//固件升级
				resetSys   : 'SYS.Reset',//恢复出厂设置
				passwd     : 'passwd'//修改管理员密码
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getSystemVersionInfo();
			this.eventList.bindResetButton();
			this.eventList.bindResetRouter();
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
					systemIndex.checkPassWord();		
				});
			},
			/**
			 * 绑定检查更新按钮事件
			 */
			bindResetButton : function() {
				$('#checkUpdate').click(function(){
					common.showMask();
					callRpcNotId(rpcUrl + systemIndex.paramOperate.businessUpdateType + token, systemIndex.paramOperate.method.update, null, function(data){
						console.log(data);
						common.hideMask();
					});
				});
			},
			/**
			 * 绑定恢复出厂设置按钮事件
			 */
			bindResetRouter : function() {
				$('.enterbut[id="resetRouter"]').click(function(){
					systemIndex.resetRouter();
				});
			}
		},
		/**
		 * 获取system版本信息
		 */
		getSystemVersionInfo : function() {
			callRpc(rpcUrl + this.paramOperate.businessUpdateType + token, this.paramOperate.method.curversion, [], this.systemVersionInfoCallBack);
		},
		/**
		 * system获取版本信息回调
		 */
		systemVersionInfoCallBack : function(data) {
			systemIndex.echoSystemVersionInfo(data);
		},
		/**
		 * 回显system版本信息
		 */
		echoSystemVersionInfo : function(data) {
			console.log(data.curversion);
			$('#versionStr').text(data.curversion);
		},
		/**
		 * 恢复出厂设置
		 */
		resetRouter : function() {
			if (confirm('确定恢复出厂设置？')) {
				common.showMask('正在恢复出厂设置……');
				callRpc(rpcUrl + this.paramOperate.businessRouterType + token, this.paramOperate.method.resetSys, null, function(data){
					console.log(data);
					common.hideMask();
				});
				return;
			}
		},

		/**
		 * check 密码设置
		 */
		checkPassWord: function() {
			var oldpasswd  = $('#old_passwd').val();
			var newpasswd1 = $('#new_passwd1').val();
			var newpasswd2 = $('#new_passwd2').val();

			if((newpasswd1 == null) || (newpasswd2 == null) || (newpasswd1 == "") 
			|| (newpasswd2 == "") || (oldpasswd == null) || (oldpasswd == "")) {
				alert("请输入正确的密码");
				return;
			}

			if(newpasswd1 != newpasswd2) {
				alert("两次输入的新密码不一致");
				return;
			}

			var callback = {	
				success:function(data){
					alert("修改密码成功");
					return;
				},
				failure:function(data){
					alert("原始密码不匹配");
					return;
				}
			};

			callRpc(rpcUrl + this.paramOperate.businessUserType + token, this.paramOperate.method.passwd, [newpasswd1, oldpasswd], callback);
		}
		
}

/**
 * dom加载完成即执行 
 */
$(function(){
	systemIndex.init();
});

/**
 * system-setting相关js
 * @author renwei
 * 
 * @problem 没有在接口文档中找到获取密码的接口
 * @problem 获取版本信息接口调用即错误
 */
var systemIndex = {
		/**
		 * 业务相关集合
		 */
		paramOperate : {
			/**
			 * 业务类型
			 */
			businessServiceType : 'service',
			businessRouterType : 'router',
			businessUpdateType : 'update',
			/**
			 * 方法集合
			 */
			method : {
				curversion : 'FIRMWARE.curversion',//获取版本信息
				update : 'FIRMWARE.update',//固件升级
				resetSys : 'SYS.Reset'//恢复出厂设置
			}
		},
		/**
		 * 初始化加载
		 */
		init : function() {
			this.getSystemVersionInfo();
			this.eventList.bindResetButton();
			this.eventList.bindResetRouter();
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
			callRpc(rpcUrl + this.paramOperate.businessUpdateType + token, this.paramOperate.method.curversion, null, this.systemVersionInfoCallBack);
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
			$('#versionStr').val(data);
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
		}
		
}

/**
 * dom加载完成即执行 
 */
$(function(){
	systemIndex.init();
});

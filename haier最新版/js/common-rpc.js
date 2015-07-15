/**
 * 出现异常
 */
var exceptionMsg = 'program appear exception!';
/**
 * 公共rpc调用(有返回id的时候使用)
 * @see 此方法为接口有id返回的时候使用
 * @see url需要手动拼好token
 * @see method 方法名需要完整的"业务.操作"
 * @see params 参数为数组
 * @see callBack 回调方法
 * @see optionalParam 可选参数，无实际意义，若存在则随回调方法 
 */
var callRpc = function(url,method,params,callBack,optionalParam) {
	var rpc = new jsonrpc.JsonRpc(url);
	var result;
	if (null != params && params) {
		rpc.call(method, params, function(data) {
			callFun(callBack,data,optionalParam);
			return;
		});
	}else {
		rpc.call(method, function(data) {
			callFun(callBack,data,optionalParam);
			return;
		});
	}
}


/**
 * 公共rpc调用
 * @see 此方法为接口无id返回的时候使用
 * @see url需要手动拼好token
 * @see method 方法名需要完整的"业务.操作"
 * @see params 参数为数组
 * @see callBack 回调方法
 * @see optionalParam 可选参数，无实际意义，若存在则随回调方法 
 */
var callRpcNotId = function(url,method,params,callBack,optionalParam) {
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
		if (null != callBack && callBack) {
			callFun(callBack,JSON.parse(xhr.responseText).result,optionalParam);
			return;
		}
	};
	if (null != params && params) {
		xhr.send('{"method":"' + method + '","params":"' + params + '"}');
	}else {
		xhr.send('{"method":"' + method + '"}');
	}
}

/**
 * 执行回调
 */
var callFun = function(callBack,data,optionalParam) {
	if ((null != callBack && callBack) || (null != data && data)) {
		if (null != optionalParam && optionalParam) {
			callBack(data,optionalParam);
		}else {
			callBack(data);
		}
	}else {
		throw new Error(exceptionMsg);
	}
}

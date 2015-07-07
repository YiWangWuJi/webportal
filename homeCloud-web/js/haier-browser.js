/**********************************************************************
    * Helper function to parse the user agent.  Sets the following form xiaonan 2014-07-11 16:59:19
    * .os.weixin
    * .os.webkit
    * .os.android
    * .os.ipad
    * .os.iphone
    * .os.webos
    * .os.touchpad
    * .os.blackberry
    * .os.opera
    * .os.fennec
    * .os.ie
    * .os.ieTouch
    * .os.supportsTouch
    * .os.playbook
    * .os.tizen
    * .feat.nativeTouchScroll
    * @api private
    if($.os.webkit){
        alert("I'm webkit browser");
    };
**********************************************************************/
function detectUA($, userAgent) {
    $.os = {};
    $.os.weixin = userAgent.match(/MicroMessenger\/([\d.]+)/) ? true : false;
    $.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
    $.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
    $.os.androidICS = $.os.android && userAgent.match(/(Android)\s4/) ? true : false;
    $.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
    $.os.iphone = !$.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
    $.os.ios7 = ($.os.ipad||$.os.iphone)&&userAgent.match(/7_/) ? true : false;
    $.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
    $.os.touchpad = $.os.webos && userAgent.match(/TouchPad/) ? true : false;
    $.os.ios = $.os.ipad || $.os.iphone;
    $.os.playbook = userAgent.match(/PlayBook/) ? true : false;
    $.os.blackberry10 = userAgent.match(/BB10/) ? true : false;
    $.os.blackberry = $.os.playbook || $.os.blackberry10|| userAgent.match(/BlackBerry/) ? true : false;
    $.os.chrome = userAgent.match(/Chrome/) ? true : false;
    $.os.opera = userAgent.match(/Opera/) ? true : false;
    $.os.fennec = userAgent.match(/fennec/i) ? true : userAgent.match(/Firefox/) ? true : false;
    $.os.ie = userAgent.match(/MSIE 10.0/i)||userAgent.match(/Trident\/7/i) ? true : false;
    $.os.ieTouch = $.os.ie && userAgent.toLowerCase().match(/touch/i) ? true : false;
    $.os.tizen = userAgent.match(/Tizen/i)?true:false;
    $.os.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || "ontouchstart" in window);
    $.os.kindle=userAgent.match(/Silk-Accelerated/)?true:false;
    //features
    $.feat = {};
    var head = document.documentElement.getElementsByTagName("head")[0];
    $.feat.nativeTouchScroll = typeof(head.style["-webkit-overflow-scrolling"]) !== "undefined" && ($.os.ios||$.os.blackberry10);
    $.feat.cssPrefix = $.os.webkit ? "Webkit" : $.os.fennec ? "Moz" : $.os.ie ? "ms" : $.os.opera ? "O" : "";
    $.feat.cssTransformStart = !$.os.opera ? "3d(" : "(";
    $.feat.cssTransformEnd = !$.os.opera ? ",0)" : ")";
    if ($.os.android && !$.os.webkit)
    $.os.android = false;
    var items=["Webkit","Moz","ms","O"];
    for(var j=0;j<items.length;j++){
        if(document.documentElement.style[items[j]+"Transform"]==="")
        $.feat.cssPrefix=items[j];
    }
}
detectUA($, navigator.userAgent);
$.__detectUA = detectUA; //needed for unit tests
/**
 * Created by BlackStar
 * @brief 一些通用的游戏方法
 */
namespace GameUtils {
	export function getHttpParams(name:string) {
		return egret.getOption(name);
    }

	export function getClientType():string
	{
		let ret:string = "native";

		if (GameUtils.isInBrowser()) {
			var ua = window.navigator.userAgent.toLowerCase();
			/* iphone */
			if (/iphone|ipad|ipod/.test(ua)) {
				ret = "iOS";
			/* android */
			} else if (/android/.test(ua)) {
				ret = "android";
			} else {
				ret = "desktop";
			}
		}
		
		return ret;
	}

	export function isInBrowser():boolean
	{
		let ret:boolean = true;
		if (window.navigator == undefined || navigator == null) {
			ret = false;
		}
		return ret;
	}

	/**
	 * 是否是在微信中
	 */
	export function isWeixin():boolean {
		if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
			return false;
		}
		return /micromessenger/.test(window.navigator.userAgent.toLowerCase()) && !/windowswechat/.test(window.navigator.userAgent.toLowerCase());
	}

	//数字显示
	export function transNumber(num:number, digit:number = 2):string {
		let result:string = "";
		let flag:number = 1;
		if (num < 0) {
			flag = -1;
			num *= (-1)
		}
		if(num < 1000) {
			result = (flag * num).toString();
		} else if (num < 1000000) {
			num = num/1000;
			num = num*flag;
			result = num.toFixed(digit) + 'K';
		} else if (num < 1000000000) {
			num = num/1000000;
			num = num*flag;
			result = num.toFixed(digit) + 'M';
		} else if(num < 9999000000000) {
			num = num/1000000000;
			num = num*flag;
			result = num.toFixed(digit) + 'B';
		} else {
			result = "9999B";
		}
		return result;
	}

	//format 格式: xx秒前/xx分钟前／xx小时前 
	export function formatTime(timestamp:number):string
	{
		let dateStr:string = "";

		let delta:number = Date.now() - timestamp;

		let minS:number = 60;
		let hourS:number = minS * 60;
		let dayS:number = hourS * 24;
		let weekS:number = dayS * 7;

		if (delta>weekS) {
			dateStr = "{0}周前".format("7");
		} else if (delta>dayS) {
			dateStr = "{0}天前".format(Math.floor(delta/dayS).toFixed(0));
		} else if (delta>hourS) {
			dateStr = "{0}小时前".format(Math.floor(delta/hourS).toFixed(0));
		} else if (delta>minS) {
			dateStr = "{0}分钟前".format(Math.floor(delta/minS).toFixed(0));
		} else {
			dateStr = "{0}秒前".format(Math.abs(delta).toFixed(0));
		}

		return dateStr;
	}

	//format 格式: xx:xx:xx timestamp 单位:秒
	export function formatTime2(timestamp:number, isContainSec: boolean = true ):string
	{
		let str:string = "";
		let minS:number = 60;
		let hourS:number = minS * 60;

		let hour:number = parseInt(Math.floor(timestamp/hourS).toFixed(0));
		timestamp = timestamp -(hour*hourS);
		let min:number = parseInt(Math.floor(timestamp/minS).toFixed(0));
		timestamp = (Math.ceil(timestamp -(min*minS)))%60;
		let sec:number = parseInt(timestamp.toFixed(0));
		if (isContainSec) {
			str = "{0}:{1}:{2}".format((hour >= 10? hour.toString():'0'+hour), 
										(min >= 10? min.toString():'0'+min), 
										(sec >= 10? sec.toString():'0'+sec));
		}
		else {
			str = "{0}:{1}".format((hour >= 10? hour.toString():'0'+hour), 
										(min >= 10? min.toString():'0'+min));
		}

		return str;
	}

	//format 格式: xx小时xx分钟xx秒 timestamp 单位:秒
	export function formatTime3(timestamp:number):string
	{
		let str:string = "";
		let minS:number = 60;
		let hourS:number = minS * 60;

		let hour:number = parseInt(Math.floor(timestamp/hourS).toFixed(0));
		timestamp = timestamp -(hour*hourS);
		let min:number = parseInt(Math.floor(timestamp/minS).toFixed(0));
		timestamp = (Math.ceil(timestamp -(min*minS)))%60;
		let sec:number = parseInt(timestamp.toFixed(0));
		if (hour > 0)
		{
			str += `${hour}${"时"}`;
		}
		if (min > 0)
		{
			str += `${min}${"分"}`;
		}
		if (sec > 0)
		{
			str += `${sec}${"秒"}`;
		}
		return str;
	}

	//format 格式: 剩余xx秒/剩余xx分钟／剩余xx小时 
	export function formatTime4(timestamp:number):string
	{
		let dateStr:string = "";

		let delta:number = timestamp - Date.now();
		if(delta < 0) {
			return dateStr;
		}
		let minS:number = 60;
		let hourS:number = minS * 60;
		let dayS:number = hourS * 24;
		let weekS:number = dayS * 7;

		if (delta>dayS) {
			dateStr = "剩余{0}天".format(Math.ceil(delta/dayS).toFixed(0));
		} else if (delta>hourS) {
			dateStr = "剩余{0}小时".format(Math.floor(delta/hourS).toFixed(0));
		} else if (delta>minS) {
			dateStr = "剩余{0}分钟".format(Math.floor(delta/minS).toFixed(0));
		} else {
			dateStr = "剩余{0}秒".format(Math.abs(delta).toFixed(0));
		}

		return dateStr;
	}


	export function drawMask(parent:any, x:number, y:number, iwidth:number, iheight:number, ialpha:number = 0.7, icolor:number = 0x000000)
	{
		let shape:egret.Shape = new egret.Shape();
        shape.x = x;
        shape.y = y;
        shape.graphics.beginFill(icolor, ialpha);
        shape.graphics.drawRect(0,0,iwidth,iheight);
        shape.graphics.endFill();
        parent.addChildAt(shape,0);
	}

}


interface String {
    /**
     * 格式化字符串, 支持格式
     * {0},{1}..
	 * {name},{level},..
	 * %d, %s
     * @param {...any[]} args
     * @returns {string}
     * 
     * @memberOf String
     */
    format(...args:any[]): string;
}

String.prototype.format = function(args:any, ...other) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key] !== undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined) {
　　　　　　　　　　　var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
			}
			
			for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined) {
　　　　　　　　　　　var reg= new RegExp("(%[sd])");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
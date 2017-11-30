// TypeScript file
enum LAYER_ACTION_TYPE {
	NO_ACTION = 0 ,
	Custom , 
	POP_IN , 		//弹出
	POP_OUT ,		//消失
	FADE_IN,		//渐现
	FADE_OUT,		//渐隐
	Left_To_Right,	//从左向右
	Right_To_Left,	//从右向左
	// Up_To_Down,		//从上到下
	// Down_To_Up		//从下到上
}
class GameLayerActionHelper
{
    constructor() {
    }

    public static createFadeInAction(target:any, time:number, callBackFunc:Function, thisObj:any)
	{
		let interval = time ;
		target.alpha = 0;
		let tw: egret.Tween = egret.Tween.get(target);
		tw.to({alpha: 1} , interval).call(
			function (evt:egret.Event) {
				if (callBackFunc && thisObj) {
					callBackFunc.call(thisObj);
				}
			}
		);
	}

	public static createFadeOutAction(target:any, time:number, callBackFunc:Function, thisObj:any)
	{
		let interval = time ;
		target.alpha = 1;
		let tw: egret.Tween = egret.Tween.get(target);
		tw.to({alpha: 0} , interval).call(
			function (evt:egret.Event) {
				if (callBackFunc && thisObj) {
					callBackFunc.call(thisObj);
				}
			}
		);
	}

    public static createPopInAction(panel:any, callBackFunc:Function, thisObj:any)
    {
        let popUpWidth:number = panel.width;
        let popUpHeight:number = panel.height;
        panel.alpha = 0;
        panel.scaleX = 0.5;
        panel.scaleY = 0.5;
        panel.x = panel.x + popUpWidth/4;
        panel.y = panel.y + popUpHeight/4;
        egret.Tween.get(panel).to({alpha:1,scaleX:1,scaleY:1,x:panel.x - popUpWidth/4,y:panel.y - popUpHeight/4},300,egret.Ease.backOut)
                .call(
			function (evt:egret.Event) {
				if (callBackFunc && thisObj) {
					callBackFunc.call(thisObj);
				}
			}
            );
    }

    public static createPopOutAction(panel:any, callBackFunc:Function, thisObj:any)
    {
        egret.Tween.get(panel).to({alpha:0,scaleX:0,scaleY:0,x:panel.x + panel.width/2,y:panel.y + panel.height/2},300, egret.Ease.backIn)
            .call(
			function (evt:egret.Event) {
				if (callBackFunc && thisObj) {
					callBackFunc.call(thisObj);
				}
			}
            );
    }

	public static createLeftToRightAction(panel:any, callBackFunc:Function, thisObj:any)
	{
		let stadeWidth:number = egret.MainContext.instance.stage.stageWidth;
		panel.x = -panel.width;
		egret.Tween.get(panel).to({x:stadeWidth/2 - panel.width/2},500,egret.Ease.cubicOut)
			 .call(
			function (evt:egret.Event) {
				if (callBackFunc && thisObj) {
					callBackFunc.call(thisObj);
				}
			}
            );
	}

	public static createRightToLeftAction(panel:any, callBackFunc:Function, thisObj:any)
	{
		egret.Tween.get(panel).to({x:-panel.width},500,egret.Ease.cubicOut)
			 .call(
			function (evt:egret.Event) {
				if (callBackFunc && thisObj) {
					callBackFunc.call(thisObj);
				}
			}
            );
	}

	// public static createUpToDownAction(panel:any, callBackFunc:Function, thisObj:any)
	// {
	// 	egret.Tween.get(panel).to({y:panel.height},500,egret.Ease.cubicOut)
	// 		 .call(
	// 		function (evt:egret.Event) {
	// 			if (callBackFunc && thisObj) {
	// 				callBackFunc.call(thisObj);
	// 			}
	// 		}
    //         );
	// }

	// public static createDownToUpAction(panel:any, callBackFunc:Function, thisObj:any)
	// {
	// 	egret.Tween.get(panel).to({y:-panel.height},500,egret.Ease.cubicOut)
	// 		 .call(
	// 		function (evt:egret.Event) {
	// 			if (callBackFunc && thisObj) {
	// 				callBackFunc.call(thisObj);
	// 			}
	// 		}
    //         );
	// }
}
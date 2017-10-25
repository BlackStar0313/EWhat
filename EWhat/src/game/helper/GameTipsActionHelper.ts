// TypeScript file
class GameTipsActionHelper
{
    constructor() {
    }

    //从下到上弹出
    public static ScreenTip(str:string, size:number, color:number, delayTime: number = 1000, height:number = 180 )
    {
        if (!LayerManager.GetInstance() || !LayerManager.GetInstance().GetMainScene() || str.length <= 0) {
            return ; 
        }

        let effectTips = new egret.TextField();
        // effectTips.cacheAsBitmap = true;
        effectTips.size = 42;
        effectTips.y = LayerManager.GetInstance().GetScreenHeight()/2;
        effectTips.textColor = color;
        
        effectTips.text = str;
        effectTips.strokeColor = 0x000000;
        effectTips.scaleX = LayerManager.GetInstance().getScreenScale();
        effectTips.scaleY = LayerManager.GetInstance().getScreenScale();
        effectTips.x = LayerManager.GetInstance().GetScreenWidth()/2-effectTips.width/2*effectTips.scaleX;       
        effectTips.stroke  = 2;
        effectTips.bold = true;
        effectTips.textAlign = egret.HorizontalAlign.CENTER;


        if(!LayerManager.GetInstance().GetMainScene().contains(effectTips)){
            LayerManager.GetInstance().GetMainScene().addChild( effectTips );
        }        

        var onComplete2:Function = function(){
            if(effectTips && effectTips.parent){
                effectTips.parent.removeChild(effectTips) ;
                effectTips = null;
            }
        };
        // var onComplete1:Function = function(){
        //     egret.Tween.get(effectTips).to({alpha:0},1000).call(onComplete2,this);   
        // };
        effectTips.visible = true;
        // egret.Tween.get(effectTips).to({y:effectTips.y - 180},1000,egret.Ease.backOut).call(onComplete2,this); 
        egret.Tween.get(effectTips).to({y:effectTips.y - height},delayTime).call(onComplete2,this); 
    }

    // //从上到下弹出
    // public static showTipsDownToUp(str:string, size:number, color:number, posX:number, posY:number)
    // {
    //     let effectTips = new egret.TextField();
    //     // effectTips.cacheAsBitmap = true;
    //     effectTips.size = size;
    //     effectTips.y = posY;
    //     effectTips.textColor = color;
        
    //     effectTips.text = str;
    //     effectTips.strokeColor = 0x000000;
    //     effectTips.x = posX-effectTips.width/2;       
    //     effectTips.stroke  = 2;
    //     effectTips.bold = true;
    //     effectTips.textAlign = egret.HorizontalAlign.CENTER;

    //     if(!LayerManager.GetInstance().getMainScene().contains(effectTips)){
    //         LayerManager.GetInstance().getMainScene().addChild( effectTips );
    //     }        

    //     var onComplete2:Function = function(){
    //         if(LayerManager.GetInstance().getMainScene().contains(effectTips)){
    //             LayerManager.GetInstance().getMainScene().removeChild( effectTips );
    //             effectTips = null;
    //         }
    //     };
    //     // var onComplete1:Function = function(){
    //     //     egret.Tween.get(effectTips).to({alpha:0},300).call(onComplete2,this);   
    //     // };
    //     effectTips.visible = true;
    //     egret.Tween.get(effectTips).to({y:effectTips.y - 180},1000,egret.Ease.backOut).call(onComplete2,this);  
    // }

    // //从左向右，或从右向左
    // public static showTipsLeftOrRight(str:string, size:number, color:number, posY:number, isFromeLeft:boolean = false):void
    // {
    //     let stageWidth:number = egret.MainContext.instance.stage.stageWidth;
    //     let effectTips = new egret.TextField();
    //     // effectTips.cacheAsBitmap = true;
    //     effectTips.size = size;
    //     effectTips.y = posY;
    //     effectTips.alpha = 0;
    //     effectTips.textColor = color;
        
    //     effectTips.text = str;
    //     effectTips.strokeColor = 0x000000;
    //     if(isFromeLeft){
    //         effectTips.x = - effectTips.width;        
    //     }else{
    //         effectTips.x = stageWidth;        
    //     }
    //     effectTips.stroke  = 2;
    //     effectTips.bold = true;
    //     effectTips.textAlign = egret.HorizontalAlign.CENTER;

    //     if(!LayerManager.GetInstance().getMainScene().contains(effectTips)){
    //         LayerManager.GetInstance().getMainScene().addChild( effectTips );
    //     }        

    //     if(isFromeLeft){
    //         egret.Tween.get(effectTips).to({x:stageWidth/2 - effectTips.width/2 - 50,alpha:1},300,egret.Ease.sineInOut);   
    //     }else{
    //         egret.Tween.get(effectTips).to({x:stageWidth/2 - effectTips.width/2 + 50,alpha:1},300,egret.Ease.sineInOut);   
    //     }

    //     egret.setTimeout(function () {
    //         if(isFromeLeft){
    //             egret.Tween.get(effectTips).to({x:effectTips.x + 100},500);  
    //         }else{
    //             egret.Tween.get(effectTips).to({x:effectTips.x - 100},500);   
    //         }
    //     }, this, 300);  

    //     egret.setTimeout(function () {
    //         if(isFromeLeft){
    //             egret.Tween.get(effectTips).to({x:stageWidth},300,egret.Ease.sineIn);    
    //         }else{
    //             egret.Tween.get(effectTips).to({x:-effectTips.width},300,egret.Ease.sineIn);    
    //         }
    //     }, this, 800);  

    //     egret.setTimeout(function () {
    //         if(LayerManager.GetInstance().getMainScene().contains(effectTips)){
    //             LayerManager.GetInstance().getMainScene().removeChild( effectTips );
    //             effectTips = null;
    //         }
    //     }, this, 1100); 
    // }

    // //从里到外
    // public static showTipsFromCenter(str:string, size:number, color:number, posX:number, posY:number):void
    // {
    //     let stagetHight:number = egret.MainContext.instance.stage.stageHeight;
    //     let stageWidth:number = egret.MainContext.instance.stage.stageWidth;
    //     var effectTips = new egret.TextField();
    //     // effectTips.cacheAsBitmap = true;
    //     effectTips.size = size;
    //     effectTips.y = posY;
    //     effectTips.alpha = 0;
    //     effectTips.textColor = color;
        
    //     effectTips.text = str;
    //     effectTips.strokeColor = 0x000000;
    //     effectTips.x = posX;      
    //     effectTips.stroke  = 2;
    //     effectTips.bold = true;
    //     effectTips.textAlign = egret.HorizontalAlign.CENTER;

    //     if(!LayerManager.GetInstance().getMainScene().contains(effectTips)){
    //         LayerManager.GetInstance().getMainScene().addChild( effectTips );
    //     }        

    //     effectTips.anchorOffsetX = effectTips.width/2;
    //     effectTips.anchorOffsetY = effectTips.height/2;
    //     effectTips.scaleX = 0;
    //     effectTips.scaleY = 0;
        
    //     var onComplete2:Function = function(){
    //         if(LayerManager.GetInstance().getMainScene().contains(effectTips)){
    //             LayerManager.GetInstance().getMainScene().removeChild( effectTips );
    //             effectTips = null;
    //         }
    //     };
    //     egret.Tween.get(effectTips).to({scaleX:1,scaleY:1,alpha:1},200); 
    //     egret.setTimeout(function () {
    //         egret.Tween.get(effectTips).to({alpha:0},500).call(onComplete2,this);   
    //     }, this, 1000);
    // }

    // //从外向里
    // public static showTipsBigToSmall(str:string = "", size:number, color:number, posX:number, posY:number):void
    // {
    //     var effectTips = new egret.TextField();
    //     // effectTips.cacheAsBitmap = true;
    //     effectTips.size = size;
    //     effectTips.y = posY;
    //     effectTips.alpha = 0;
    //     effectTips.textColor = color;
        
    //     effectTips.text = str;
    //     effectTips.strokeColor = 0x000000;
    //     effectTips.x = posX;       
    //     effectTips.stroke  = 2;
    //     effectTips.bold = true;
    //     effectTips.textAlign = egret.HorizontalAlign.CENTER;

    //     if(!LayerManager.GetInstance().getMainScene().contains(effectTips)){
    //         LayerManager.GetInstance().getMainScene().addChild( effectTips );
    //     }        

    //     effectTips.anchorOffsetX = effectTips.width / 2;
    //     effectTips.anchorOffsetY = effectTips.height / 2;
    //     effectTips.scaleX = 4;
    //     effectTips.scaleY = 4;
        
    //     var onComplete2:Function = function(){
    //         if(LayerManager.GetInstance().getMainScene().contains(effectTips)){
    //             LayerManager.GetInstance().getMainScene().removeChild( effectTips );
    //             effectTips = null;
    //         }
    //     };
    //     egret.Tween.get(effectTips).to({scaleX:1,scaleY:1,alpha:1},200); 
    //     egret.setTimeout(function () {
    //         egret.Tween.get(effectTips).to({alpha:0},500).call(onComplete2,this);   
    //     }, this, 1000);   
    // }
}
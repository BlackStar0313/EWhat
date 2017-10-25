// TypeScript file

class LocalEvents {
    public static CLOSE_ITEM = "close_item";     //淘汰一个Item
    public static RESTART = "restart";           //重新开始
    public static FIRST_TIME_RUN = "first_time_run";    //进入游戏后第一次开始
    public static SELECT_TAG = "select_tag";        //选中了一个tag
}


/**
 * NotifyCenter extends egret.EventDispatcher
 */
class NotifyCenter extends egret.EventDispatcher {

    private static _ins:NotifyCenter = null;
    constructor() {
        super();
    }

    public static getInstance():NotifyCenter{
        if (NotifyCenter._ins==null) {
            NotifyCenter._ins = new NotifyCenter();
        }

        return NotifyCenter._ins;
    }

    public dispatchEventWithDelay(evt:egret.Event, delay:number) {
        let timer:egret.Timer = new egret.Timer(delay, 1);
        timer.addEventListener(egret.TimerEvent.TIMER, function() {
            NotifyCenter.getInstance().dispatchEvent(evt);
        }, this);
        timer.start();
    }
}
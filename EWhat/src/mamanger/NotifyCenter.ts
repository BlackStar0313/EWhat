// TypeScript file

class LocalEvents {
    public static CLOSE_ITEM = "close_item";     //淘汰一个Item
    public static RESTART = "restart";           //重新开始
    public static FIRST_TIME_RUN = "first_time_run";    //进入游戏后第一次开始
    public static SELECT_TAG = "select_tag";        //选中了一个tag
    public static SELECT_TAG_ONLY_IMG = "select_tag_only_img";  //在创建tag的时候选中一个图片
    public static ADD_NEW_TAG = "add_new_tag";      //增加新标签
    public static ADD_NEW_SHOP = "add_new_shop";       //增加新商店后通知
    public static SWITCH_TAG = "switch_tag";        //切换商店所属tag 
    public static SHOP_CHANGE_TAG = "shop_change_tag";  //商店tag刷新
    public static CHANGE_SHOP_NAME = "change_shop_name";    //修改商店的名字
    public static START_RAND = "start_rand";           
    public static STOP_RAND = "stop_rand";

    public static DB_DATA = "db_data";
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
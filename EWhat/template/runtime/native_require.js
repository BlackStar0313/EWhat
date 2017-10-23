
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/res/res.js",
	"libs/modules/eui/eui.js",
	"libs/modules/tween/tween.js",
	"libs/modules/dragonBones/dragonBones.js",
	"polyfill/promise.js",
	"bin-debug/utils/BasicItemRenderer.js",
	"bin-debug/utils/BasicLayer.js",
	"bin-debug/Main.js",
	"bin-debug/data/ItemData.js",
	"bin-debug/game/cell/RandCell.js",
	"bin-debug/game/EditShopLayer.js",
	"bin-debug/game/helper/StoreShopLocalHelper.js",
	"bin-debug/game/MainScene.js",
	"bin-debug/game/RandLayer.js",
	"bin-debug/game/ShopPoolLayer.js",
	"bin-debug/game/UserCenter.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/utils/GameLayerActionHelper.js",
	"bin-debug/mamanger/asLocalStorage.js",
	"bin-debug/mamanger/DataManager.js",
	"bin-debug/mamanger/DragonBonesConfig.js",
	"bin-debug/mamanger/DragonBonesManager.js",
	"bin-debug/mamanger/GameStoreShopManager.js",
	"bin-debug/mamanger/LayerManager.js",
	"bin-debug/mamanger/NotifyCenter.js",
	"bin-debug/text.js",
	"bin-debug/ThemeAdapter.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/data/interface/ItemDataInterface.js",
	"bin-debug/Constants.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 750,
		contentHeight: 1206,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};
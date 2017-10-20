enum LAYER_TYPE {
	DefaultLayer = 0,	//最底层
	BasicUIlayer, 		//基础ui层
	FrontGround,		//前置层，招募,英雄，建筑界面
	ForeGround,			//表层,
	PopUpLayer,			//弹出界面层,例如排行榜，战报,城市信息等界面
	ComfirmLayer,		//确认界面层
	AlertLayer,			//告警层
	TopLayer,			//顶层
	GuideLayer,			//引导层
	LevelUpLayer,		//升级动画展示层
	SystemMsg,			//系统消息
}

class LayerManager {
	private static  m_pThis = null;
	private m_dictLayer:{[order:number]: Array<BasicLayer>} = {};
	private m_currentCommonLayer:BasicLayer;//common layer 只有一个或者没有
	private m_mainScene:egret.DisplayObjectContainer = null;
	private m_mask:egret.Shape = null;
	private m_screenScale:number = -1;		//屏幕自适应缩放倍数。
	private m_screenLeftBorder:number = -1;	//屏幕自适应后屏幕左边界的位置。
	private m_screenWidth:number = 0;
	private m_screenheight:number = 0;

	public openAction:boolean = false;//是否打开所有layer切换的动画效果
	public constructor() {
	}

	public static GetInstance(): LayerManager {
		if (LayerManager.m_pThis === null ) {
			LayerManager.m_pThis = new LayerManager();
		}
		return LayerManager.m_pThis;
	}

	public GetMainScene():egret.DisplayObjectContainer { return this.m_mainScene; }
	public GetScreenHeight():number { return this.m_mainScene.stage.stageHeight; }
	public GetScreenWidth():number { return this.m_mainScene.stage.stageWidth; }
	public GetBodyScreenWidth() { return this.m_screenWidth; }
	public GetBodyScreenHeight() { return this.m_screenheight; }


	public initScene(scene:egret.DisplayObjectContainer) {
		if (scene)
		{
			this.m_mainScene = scene;
		}
	}

	public calcScreenScale() {
		let standardWidth = 750;
		let standardHeight = 1206;
		let scaleNumber = standardWidth/standardHeight;
		let w,h;
		if(LayerManager.GetInstance().GetMainScene().stage.scaleMode == egret.StageScaleMode.SHOW_ALL) {
			w = standardWidth
			h = standardHeight
		} else {
			w = LayerManager.GetInstance().GetMainScene().parent.width;
			h = LayerManager.GetInstance().GetMainScene().parent.height;
		}
		this.m_screenWidth = w;
		this.m_screenheight = h;
		let nowScaleNumber = w/h;
		if(nowScaleNumber <= scaleNumber) {
			this.m_screenScale = w / standardWidth;
		} else {
			this.m_screenScale = h / standardHeight;
		}
		this.m_screenLeftBorder = (w-standardWidth*this.m_screenScale)/2;
		egret.log("Screen Scale = " + this.m_screenScale);
	}

	public getScreenScale() {
		if (this.m_screenScale <= 0 ) {
			this.calcScreenScale();
		}
		return this.m_screenScale;
	}

	public getScreenLeftBorder() {
		if (this.m_screenLeftBorder <= 0) {
			this.calcScreenScale();
		}
		return this.m_screenLeftBorder;
	}

	/**
	 * 添加新layer
	 * @param layer:要添加的layer 
	 * @param type:层级 hasMask:是否添加遮罩 
	 * @param openSwitch:是否带有layer切换效果
	 * */

	public pushLayer(layer: BasicLayer, type:LAYER_TYPE, hasMask:boolean = false, openSwitch:boolean = false) : void {
		if (!layer)
		{
			return ;
		}
		layer.layerType = type;
		layer.hasMask = hasMask;
		if (openSwitch)
		{
			this.switchLayer(layer, hasMask);
		} else 
		{
			this.addLayer(layer);
		}
	}

	private switchLayer(layer:BasicLayer, hasMask:boolean) : void
	{
		let type:LAYER_TYPE = layer.layerType;
		// this.clearOneTypeLayer(type);
		let dict:{[order:number]: Array<BasicLayer>} = this.m_dictLayer;
		if (!dict)
		{
			egret.error("error: no layer!");
		}
		let arr:Array<BasicLayer> = dict[type];
		if (arr && arr.length > 0)
		{
			let prelayer:BasicLayer = arr[arr.length - 1];
			prelayer.changeLayer(layer);
		} else 
		{
			this.addLayer(layer);
		}
	}

	//只有在BasicLayer中使用不对外使用
	public addLayer(layer:BasicLayer):void
	{
		let type:LAYER_TYPE = layer.layerType;
		let order:number = this.findOrderIndex(type);
		if (!this.m_dictLayer[type])
		{
			let temp:Array<BasicLayer> = new Array<BasicLayer> ();
			temp.push(layer);
			this.m_dictLayer[type] = temp;
		} else {
			this.m_dictLayer[type].push(layer);
		}

		this.m_mainScene.addChildAt(layer, order+1);

		this.resetMask();

	}

	public resetMask()
	{
		if (this.m_mask == null) {
			this.createMask();
		}

		if (this.m_mask.parent != null) {
			this.m_mask.parent.removeChild(this.m_mask);
		}
		
		let maskIndex:number = -1;
		for (let length:number = this.m_mainScene.$children.length, i = length-1; i >=0; i--) {

			if ( this.m_mainScene.getChildAt(i) instanceof BasicLayer) {
				let bl:BasicLayer = <BasicLayer> this.m_mainScene.getChildAt(i);
				if (bl.hasMask) {
					maskIndex = i;
					break;
				}
			}
		}
		if (maskIndex>=0) {
			if (this.m_mask.parent == this.m_mainScene)
			{
				this.m_mainScene.setChildIndex(this.m_mask, maskIndex>0?maskIndex-1:0);
			} else {
				if (this.m_mask.parent != null) this.m_mask.parent.removeChild(this.m_mask);
				this.m_mainScene.addChildAt(this.m_mask, maskIndex);
			}
			//会存在缩放屏幕导致之前绘制的遮罩大小不对
			this.m_mask.graphics.clear();
			this.m_mask.graphics.beginFill(0x000000, 0.75);
			this.m_mask.graphics.drawRect(0,0,egret.MainContext.instance.stage.stageWidth,egret.MainContext.instance.stage.stageHeight);
			this.m_mask.graphics.endFill();
		} else {
			if (this.m_mask.parent == this.m_mainScene)
			{
				this.m_mainScene.removeChild(this.m_mask);
			}
		}
	}

	public GetTopLayer(): BasicLayer {
		let dict:{[order:number]: Array<BasicLayer>} = this.m_dictLayer;
		let keys:Array<string> = Object.keys(dict).sort();
		for(let i = keys.length-1, e=0; i>=e; i--) {
			let k:string = keys[i];
			let arr:Array<BasicLayer> = dict[k]
			if(arr!= undefined && arr.length > 0) {
				return arr[arr.length - 1] ;
			}
		}
		return null ; 
	}
	
	/**
	 * 销毁界面
	 * @param layer:要删除的layer 
	 * */
	public popLayer(layer:BasicLayer = null, popTopLayers:boolean = false) : void {
		let dict:{[order:number]: Array<BasicLayer>} = this.m_dictLayer;

		//清除当前栈中的最上一个layer
		if (layer == null || layer == undefined)
		{
			let keys:Array<string> = Object.keys(dict).sort();
			for(let i = keys.length-1, e=0; i>=e; i--) {
				let k:string = keys[i];
				let arr:Array<BasicLayer> = dict[k]
				if(arr!= undefined && arr.length > 0) {
					arr.pop().doOutAction();
					if (arr.length <= 0 )
					{
						delete dict[k];
					}
					break;
				}
			}
		} else {
			if(popTopLayers) {
				let keys:Array<string> = Object.keys(dict).sort();

				//清除layerType以上的layer类型
				let s:number = keys.lastIndexOf(layer.layerType.toString());
				for(let i = s, l = keys.length-1; s >= 0 && i < l; l--) {
					let a:Array<BasicLayer> = dict[l];
					for(let j=a.length, k=0;j>k;j--) {
						this.removeFromMain(a.pop());
					}
				}

				//清除当前layerType中 layer及layer以上的
				let arr:Array<BasicLayer> = dict[layer.layerType];
				if (arr != undefined && arr != null) {
					let ss:number = arr.lastIndexOf(layer)
					for(let i = ss, l = arr.length; ss >= 0 && i < l; l--)
					{
						this.removeFromMain(arr.pop());
					}
					
					if (arr.length <= 0 )
					{
						delete dict[layer.layerType];
					}
				}

			} else {
				let arr:Array<BasicLayer> = dict[layer.layerType];
				if (!arr)
				{
					egret.error("error: empty layer stack!");
					return;
				}
				if (arr.length <= 0)
				{
					egret.error("error: layer not exit!");
					return;
				}

				let idx:number = arr.lastIndexOf(layer);
				if(idx>=0) {
					arr.splice(idx,1);
					if (arr.length <= 0 )
					{
						delete dict[layer.layerType];
					}
					layer.doOutAction();
				} else {
					console.error(false, 'layer is not managed by LayerManager!');
				}
			}
			
		}

		// 重置遮罩效果
		this.resetMask();
	}

	public clear():void {
		let dict:{[order:number]: Array<BasicLayer>} = this.m_dictLayer;
		for (let key in dict)
		{
			let arr:Array<BasicLayer> = dict[key];
			while(arr && arr.length > 0)
			{
				this.removeFromMain(arr.pop());
			}
		}
		this.m_dictLayer = {};
		this.m_mask = null;
		this.m_mainScene = null;
	}

	//清除type以上层次所有layer
	public clearAllLayer(type:LAYER_TYPE)
	{
		let dict:{[order:number]: Array<BasicLayer>} = this.m_dictLayer;
		for (let key in dict)
		{
			if (parseInt(key) > type && parseInt(key) != LAYER_TYPE.SystemMsg) //系统消息不被清除
			{ 
				this.clearOneTypeLayer(parseInt(key));
			}
		}
	}

	//清除type层所有layer
	public clearOneTypeLayer(type:LAYER_TYPE)
	{
		let dict:{[order:number]: Array<BasicLayer>} = this.m_dictLayer;
		if(dict.hasOwnProperty(type.toString()))
		{
			let arr:Array<BasicLayer> = dict[type];
			while(arr && arr.length > 0)
			{
				this.removeFromMain(arr.pop());
			}
			delete dict[type];
		}

		this.resetMask();
	}

	//FixMe: 这里可能有问题
	private removeFromMain(layer:BasicLayer) {
		if (this.m_mainScene.contains(layer))
		{
			this.m_mainScene.removeChild(layer);
		} else {
			egret.error('~~~~~this.m_mainScene is not contains layer, skinName = ', layer.skinName);
		}

	}

	private findOrderIndex(type:LAYER_TYPE):number
	{
		let retIndex = this.m_mainScene.$children.length-1;

		let layersDict:{[order:number]: Array<BasicLayer>} = this.m_dictLayer;
		for (let length = this.m_mainScene.$children.length, i = 0; i < length; i++) {

			if ( this.m_mainScene.getChildAt(i) instanceof BasicLayer )
			{
				let bl:BasicLayer = <BasicLayer>this.m_mainScene.getChildAt(i);
				if (bl.layerType > type)
				{
					retIndex = i-1;
					break;
				}
			}
		}

		return retIndex;
	}

	private createMask():void
	{
		if (!this.m_mask)
		{
			this.m_mask = new egret.Shape();
			this.m_mask.x = 0;
			this.m_mask.y = 0;
			// this.m_mask.graphics.beginFill(0x000000, 0.75);
			// this.m_mask.graphics.drawRect(0,0,egret.MainContext.instance.stage.stageWidth,egret.MainContext.instance.stage.stageHeight);
			// this.m_mask.graphics.endFill();
			this.m_mask.touchEnabled = true;
		}
	}

	//检查某界面上层是否有界面 isCheckLevelUp用于是否判断level up界面
	public isTopLayer(ilayer:BasicLayer, isCheckLevelUp:boolean = true):boolean
	{
		if (!ilayer)
		{
			console.error("error : ilayer is not exit!");
			return false;
		}
		for (let length = this.m_mainScene.$children.length, i = length-1; i >= 0; i--) {

			if ( this.m_mainScene.getChildAt(i) instanceof BasicLayer )
			{
				let layer:BasicLayer = <BasicLayer>this.m_mainScene.getChildAt(i);
				if (ilayer == layer)
				{
					return true;
				}
				
				if (!egret.is(layer, "CGuideLayer") && 
					( (layer.layerType > LAYER_TYPE.ForeGround && isCheckLevelUp) || 
					(!isCheckLevelUp && (layer.layerType > LAYER_TYPE.ForeGround && layer.layerType != LAYER_TYPE.LevelUpLayer))))
				{
					return false;
				}
			}
		}
	}

	public FindLayerBySkinName(name:string):BasicLayer
	{
		for (let length = this.m_mainScene.$children.length, i = 0; i < length; i++) {
			let layer:BasicLayer = <BasicLayer>this.m_mainScene.getChildAt(i)
			if (egret.is(layer, name))
			{
				return layer
			}
		}
		return null;
	}

	public isLayerExist(ilayer:BasicLayer): boolean
	{
		for (let length = this.m_mainScene.$children.length, i = 0; i < length; i++) {
			let layer:BasicLayer = <BasicLayer>this.m_mainScene.getChildAt(i)
			if (ilayer == layer)
			{
				return true;
			}
		}
		return false;
	}

	public isLayerInstanceOf(layerClass):boolean {
		for (let length = this.m_mainScene.$children.length, i = 0; i < length; i++) {
			let layer:BasicLayer = <BasicLayer>this.m_mainScene.getChildAt(i)
			if (layer instanceof layerClass)
			{
				return true;
			}
		}
		return false;
	}

}
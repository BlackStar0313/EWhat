
/**
 * @berif 提供了，界面创建，移除，创建动画, 界面层级控制，是否自动点击移除，ui中container的显示位置设置
 */
class BasicLayer extends eui.Component implements  eui.UIComponent {
	private m_inActionType : LAYER_ACTION_TYPE = LAYER_ACTION_TYPE.NO_ACTION ; 
	private m_outActionType : LAYER_ACTION_TYPE = LAYER_ACTION_TYPE.NO_ACTION;

	private m_exitCallBack:Function = null;//关闭界面动画结束后的回调函数
	private m_exitTarget:any = null;

	private m_createCallBack:Function = null;//弹出界面时动画结束后的回调函数
	private m_createTarget:any = null;

	private m_actionTarget:any = null;
	private m_layerType:LAYER_TYPE = LAYER_TYPE.DefaultLayer;

	private m_hasMask:boolean = false;//当前界面是否有遮罩
	private m_nextLayer:BasicLayer = null;//要切换的界面

	private m_touchBg: eui.Group = null ;  		//点击该界面显示区域外就退出界面
	private m_touchBgCallBackFunc: Function = null ; 
	private m_touchBgCallBackObj: any = null ; 
	private m_showContainer: any = null ; 					//显示区域
	private m_showContainerPos: egret.Point = new egret.Point(0,0) ; 		//显示区域的位置

	private m_isAutoPopUp:boolean = false;	//是否是进入游戏后的自动弹出窗口。

	private m_layerId:number = -1;  //用于引导(同一界面不同idx信息，例如副本挑战界面)
	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	public get layerType():LAYER_TYPE { return this.m_layerType; }
	public set layerType(v:LAYER_TYPE) { this.m_layerType = v; }
	public get hasMask():boolean { return this.m_hasMask; }
	public set hasMask(v:boolean) { this.m_hasMask = v; }

	public isAutoPopUpLayer():boolean { return this.m_isAutoPopUp; }
	public setAutoPopup() {	 this.m_isAutoPopUp = true; }   // 当窗口为进入游戏自动弹出时，会执行这个方法

	protected screenAdaptive() {
		//let scaleNumber = 750/1206;
		if(
			this.layerType == LAYER_TYPE.FrontGround ||
			this.layerType == LAYER_TYPE.BasicUIlayer ||
			this.layerType == LAYER_TYPE.PopUpLayer ||
			this.layerType == LAYER_TYPE.TopLayer ||
			this.layerType == LAYER_TYPE.ComfirmLayer ||
			this.layerType == LAYER_TYPE.AlertLayer ||
			this.layerType == LAYER_TYPE.LevelUpLayer
		)
		{
			/*let w = LayerManager.GetInstance().getMainScene().parent.width;
			let h = LayerManager.GetInstance().getMainScene().parent.height;
			let nowScaleNumber = w/h;
			if(nowScaleNumber <= scaleNumber) {
				let scale = w / 750;
				for(let key in this.$children) {
					let item = this.$children[key];
					item.x = item.x*scale;
					item.y = item.y*scale;
					item.scaleX = scale;
					item.scaleY = scale;
				}
			} else {
				let scale = h / 1206;
				for(let key in this.$children) {
					let item = this.$children[key];
					item.x = item.x*scale;
					item.y = item.y*scale;
					item.scaleX = scale;
					item.scaleY = scale;
				}
			}*/
			let w = LayerManager.GetInstance().GetMainScene().parent.width;
			let h = LayerManager.GetInstance().GetMainScene().parent.height;
			let scale = LayerManager.GetInstance().getScreenScale();
			for(let key in this.$children) {
				let item = this.$children[key];
				item.x = item.x*scale;
				item.y = item.y*scale;
				item.scaleX = scale;
				item.scaleY = scale;
			}
			this.width  = w;
			this.height = h;

			egret.log("~~~~~~~~  screen scale is " , scale );
		}
	}

	protected childrenCreated():void
	{
		super.childrenCreated();


		this.doInAction();
		this.screenAdaptive();
	}

	//设置layer action相关的配置 默认不做action
	protected SetLayerActionConfig(inAction: LAYER_ACTION_TYPE , outAction: LAYER_ACTION_TYPE, target:any) {
		this.m_inActionType = inAction ; 
		this.m_outActionType = outAction;
		this.m_actionTarget = target;
	}

	//设置执行完退出界面动画的回调函数
	protected SetExitCallBack(target:any, callBackFunc:Function)
	{
		this.m_exitTarget = target;
		this.m_exitCallBack = callBackFunc;
	}

	//设置执行完进入界面动画的回调函数
	protected SetCreateCallBack(target:any, callBackFunc:Function)
	{
		this.m_createTarget = target;
		this.m_createCallBack = callBackFunc;
	}


	//点击其他位置可以自动关闭界面
	protected SetAutoRemove(callBackFunc: Function = null , thisObject: any = null , touchThrough: boolean = false ): void {
		this.m_touchBg = new eui.Group() ; 
		this.addChildAt(this.m_touchBg , 0 ) ; 
		this.m_touchBg.x = 0  ; 
		this.m_touchBg.y = 0 ; 
		this.m_touchBg.width = this.width ; 
		this.m_touchBg.height = this.height; 
		this.m_touchBg.touchEnabled = true ; 
		this.m_touchBg.touchThrough = false ; 

		this.m_touchBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN , this.bgTouch , this  );

		if (callBackFunc && thisObject) {
			this.m_touchBgCallBackFunc = callBackFunc ; 
			this.m_touchBgCallBackObj = thisObject ; 
		}
	}


	//设置显示位置用
	//<<<<<<<<<<<<<<<<<<<<<
	protected SetShowContainer(container: any ): void {
		this.m_showContainer = container ; 
		this.m_showContainer.x = this.m_showContainerPos.x ; 
		this.m_showContainer.y = this.m_showContainerPos.y ; 
	}

	protected GetShowContaniner(): any {
		return this.m_showContainer ; 
	}

	public SetShowContainerPos(posX: number , posY: number): void {
		this.m_showContainerPos.x = posX ; 
		this.m_showContainerPos.y = posY ;
	}
	//>>>>>>>>>>>>>>>>>>>>>

	private doInAction() : void {
		if (!this.m_actionTarget)
		{
			this.m_actionTarget = this;
		}	

		if (!LayerManager.GetInstance().openAction) 
		{
			if (this.m_createCallBack && this.m_createTarget) 
			{
				this.m_createCallBack.call(this.m_createTarget);
			}
			return;
		}
		else if (this.m_layerType == LAYER_TYPE.PopUpLayer && this.m_outActionType == LAYER_ACTION_TYPE.NO_ACTION) {
			this.m_inActionType = LAYER_ACTION_TYPE.POP_IN;
		}

		switch (this.m_inActionType)
		{
			case LAYER_ACTION_TYPE.FADE_IN:
			{
				GameLayerActionHelper.createFadeInAction(this.m_actionTarget, 300, this.m_createCallBack, this.m_createTarget);
				break;
			}
			case LAYER_ACTION_TYPE.POP_IN:
			{
				GameLayerActionHelper.createPopInAction(this.m_actionTarget, this.m_createCallBack, this.m_createTarget)
				break;
			}
			case LAYER_ACTION_TYPE.Left_To_Right:
			{
				GameLayerActionHelper.createLeftToRightAction(this.m_actionTarget, this.m_createCallBack, this.m_createTarget)
				break;
			}
			// case LAYER_ACTION_TYPE.Up_To_Down:
			// {
			// 	GameLayerActionHelper.createUpToDownAction(this.m_actionTarget, this.m_createCallBack, this.m_createTarget);
			// 	break;
			// }
			// case LAYER_ACTION_TYPE.Down_To_Up:
			// {
			// 	GameLayerActionHelper.createDownToUpAction(this.m_actionTarget, this.m_createCallBack, this.m_createTarget);
			// 	break;
			// }
			// case LAYER_ACTION_TYPE.NO_ACTION:
			// {
			// 	if (this.m_createCallBack && this.m_createTarget) {
			// 		this.m_createCallBack.call(this.m_createTarget);
			// 	}
			// 	break;
			// }
			default:
			{
				if (this.m_createCallBack && this.m_createTarget) {
					this.m_createCallBack.call(this.m_createTarget);
				}
				break;
			}
		}
	}

	public doOutAction(): void {
		if (!this.m_actionTarget)
		{
			this.m_actionTarget = this;
		}

		if (!LayerManager.GetInstance().openAction) 
		{
			this.Exit();
			return;
		}
		else if (this.m_layerType == LAYER_TYPE.PopUpLayer && this.m_outActionType == LAYER_ACTION_TYPE.NO_ACTION) {
			this.m_outActionType = LAYER_ACTION_TYPE.POP_OUT;
		}

		switch (this.m_outActionType)
		{
			case LAYER_ACTION_TYPE.FADE_OUT:
			{
				GameLayerActionHelper.createFadeOutAction(this.m_actionTarget, 300, this.Exit, this);
				break;
			}
			case LAYER_ACTION_TYPE.POP_OUT:
			{
				GameLayerActionHelper.createPopOutAction(this.m_actionTarget, this.Exit, this);
				break;
			}
			case LAYER_ACTION_TYPE.Right_To_Left:
			{
				GameLayerActionHelper.createRightToLeftAction(this.m_actionTarget, this.Exit, this);
				break;
			}
			
			// case LAYER_ACTION_TYPE.Up_To_Down:
			// {
			// 	GameLayerActionHelper.createUpToDownAction(this.m_actionTarget, this.Exit, this);
			// 	break;
			// }
			// case LAYER_ACTION_TYPE.Down_To_Up:
			// {
			// 	GameLayerActionHelper.createDownToUpAction(this.m_actionTarget, this.Exit, this);
			// 	break;
			// }

			// case LAYER_ACTION_TYPE.NO_ACTION:
			// {
			// 	this.Exit();
			// 	break;
			// }

			default:
			{
				this.Exit();
				break;
			}
			
		}
	}

	public Exit()
	{
		if (this.m_exitCallBack && this.m_exitTarget) {
			this.m_exitCallBack.call(this.m_exitTarget);
		}

		this.m_exitTarget = null;
		this.m_exitCallBack = null;
		this.m_actionTarget = null;
		
		// if (this.hasMask)
		// {
		// 	// LayerManager.GetInstance().resetMaskOrder(this);
		// 	LayerManager.GetInstance().resetMask();
		// }
		
		this.parent.removeChild(this);
		if (this.m_nextLayer)
		{
			LayerManager.GetInstance().addLayer(this.m_nextLayer);
			this.m_nextLayer = null;
		} else {
			if (this.hasMask)
			{
				// LayerManager.GetInstance().resetMaskOrder(this);
				LayerManager.GetInstance().resetMask();
			}
		}


		
	}

	public changeLayer(layer:BasicLayer)
	{
		this.m_nextLayer = layer;
		LayerManager.GetInstance().popLayer(this);
		// this.m_nextLayerHasMask = hasMask;
	}

	private bgTouch(evt:egret.TouchEvent):void
	{
		switch(evt.target) {
			case this.m_touchBg: {
				if (this.m_touchBgCallBackObj && this.m_touchBgCallBackFunc) {
					this.m_touchBgCallBackFunc.call(this.m_touchBgCallBackObj) ; 
				}
				else {
					LayerManager.GetInstance().popLayer(this);
					egret.log("child layer should set call back func and listner ~~~");
				}
				break;
			}

			default:
				break;
		}
	}

	//点击检查是否为当前引导步骤，若不是则不执行点击事件
	protected checkTouch(target:any):boolean
	{
		return false;
	}

	protected CheckResponse(name:string): void
	{
		
	}

	protected setData(idx:number):void 
	{
		this.m_layerId = idx;
	}
}
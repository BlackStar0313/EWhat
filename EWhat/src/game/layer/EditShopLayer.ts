class EditShopLayer extends BasicLayer {
public edit_name:eui.EditableText;

	private mShopKey: number = 0 ; 
	public constructor(shopkey: number) {
		super();
		this.mShopKey = shopkey ; 
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.init();

	}
	
	private init(): void {
		this.edit_name.addEventListener(egret.Event.FOCUS_IN, this.onFocusIn, this);
		this.edit_name.addEventListener(egret.Event.FOCUS_OUT, this.onFocusOut, this);
		this.edit_name.addEventListener(egret.Event.CHANGE, this.onTextChange, this);

		// egret.TouchEvent.dispatchTouchEvent(this.edit_name, egret.TouchEvent.TOUCH_BEGIN);
		// this.edit_name.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_BEGIN, true));
		// this.edit_name.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_IN, true));

		// this.once(egret.Event.ENTER_FRAME, this.onEnterFrame, this);

		let beforeShopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfo(this.mShopKey);
		this.edit_name.text = beforeShopInfo.name;
	}

	private onEnterFrame(): void {
		// egret.TouchEvent.dispatchTouchEvent(this.edit_name, egret.TouchEvent.TOUCH_BEGIN);
		// this.edit_name.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_IN, true));
		this.dispatchEvent(new egret.Event("focus"));
	}

	private onFocusIn(evt: egret.Event): void {
		this.edit_name.text = "";
	}

	private onFocusOut(evt: egret.Event): void {
		let text:string = evt.target.text;

		let beforeShopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfo(this.mShopKey);

		let shopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfoByName(text);
		if (shopInfo ) {
			GameTipsActionHelper.ScreenTip("该店名已存在", 34 , CONST_CONFIG.warningColor);
			LayerManager.GetInstance().popLayer(this);
			return ;
		}

		if (text == "") {
			GameTipsActionHelper.ScreenTip("店名不能为空", 34 , CONST_CONFIG.warningColor);
			LayerManager.GetInstance().popLayer(this);
			return ;
		}

		beforeShopInfo.name = text ; 
		GameStoreShopInfoManager.GetInstance().updateShopName(beforeShopInfo);
		NotifyCenter.getInstance().dispatchEventWith(LocalEvents.CHANGE_SHOP_NAME  );
		let str: string = "名字修改为" + text ; 
		GameTipsActionHelper.ScreenTip(str, 34 , CONST_CONFIG.successColor);


		LayerManager.GetInstance().popLayer(this);
	}

	private onTextChange(evt: egret.Event): void {
		let text:string = evt.target.text;
		if (text != "") {
			this.edit_name.text = text ; 
		}
	}
}
class AddShopLayer extends BasicLayer {
public btn_next:eui.Button;
public btn_close:eui.Button;
public edit_name:eui.EditableText;

	private mShopName: string = "";

	public constructor(shopName: string ) {
		super();
		this.mShopName = shopName;
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
		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_next.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		this.edit_name.addEventListener(egret.Event.FOCUS_IN, this.onFocusIn, this);
		this.edit_name.addEventListener(egret.Event.FOCUS_OUT, this.onFocusOut, this);
		this.edit_name.addEventListener(egret.Event.CHANGE, this.onTextChange, this);

		if (this.mShopName != "") {
			this.edit_name.text = this.mShopName ; 
		}
	}

	public handleTouch(event:egret.Event):void
	{ 
		switch(event.target)
		{
			case this.btn_close:
			{
				LayerManager.GetInstance().popLayer(this);
				break;
			}

			case this.btn_next:
			{
				if (this.mShopName == "") {
					GameTipsActionHelper.ScreenTip("请输入店名", 42, CONST_CONFIG.warningColor);
					return;
				}
				
				LayerManager.GetInstance().popLayer(this);

				let layer: AddShopTagLayer = new AddShopTagLayer(this.mShopName);
				LayerManager.GetInstance().pushLayer(layer , LAYER_TYPE.PopUpLayer);
				break;
			}
			default:
			break;
		}
	}

	private onFocusIn(evt: egret.Event): void {
		this.edit_name.text = "";
		this.mShopName = "";
	}

	private onFocusOut(evt: egret.Event): void {
		let text:string = evt.target.text;
		if (text == "") {
			text = "输入店名";
			this.edit_name.text = text ;
			this.mShopName = "" ; 
		}
		else {
			this.mShopName = text ; 
		}
	}

	private onTextChange(evt: egret.Event): void {
		let text:string = evt.target.text;
		if (text != "") {
			this.edit_name.text = text ; 
		}
	}
}
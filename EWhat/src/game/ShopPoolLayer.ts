class ShopPoolLayer extends BasicLayer {
public btn_close:eui.Button;
public group_filter:eui.Group;
public btn_confirm:eui.Button;
public btn_add_shop:eui.Button;
public btn_add_tag:eui.Button;

	public constructor() {
		super();
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
		this.btn_add_tag.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_add_shop.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_confirm.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
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

			case this.btn_add_shop:
			{
				let layer: EditShopLayer = new EditShopLayer();
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);
				break;
			}

			case this.btn_add_tag:
			{
				break;
			}

			case this.btn_confirm:
			{
				break;
			}
			default:
			break;
		}
	}
	
}
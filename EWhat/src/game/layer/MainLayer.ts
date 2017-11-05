class MainLayer extends BasicLayer {
public btn_start:eui.Button;
public btn_config:eui.Button;
public btn_add:eui.Button;
public btn_shop:eui.Button;


	public constructor( ) {
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
		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_config.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_add.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_shop.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		// NotifyCenter.getInstance().addEventListener(LocalEvents.SHOP_CHANGE_TAG , this.refreshShow , this );
		// NotifyCenter.getInstance().addEventListener(LocalEvents.CHANGE_SHOP_NAME , this.refreshShopInfo , this );
		// this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
		// 	NotifyCenter.getInstance().removeEventListener(LocalEvents.SHOP_CHANGE_TAG , this.refreshShow , this );
		// 	NotifyCenter.getInstance().removeEventListener(LocalEvents.CHANGE_SHOP_NAME , this.refreshShopInfo , this );
		// }, this);

	}

	public handleTouch(event:egret.Event):void
	{ 
		switch(event.target)
		{
			case this.btn_add:
			{
				LayerManager.GetInstance().popLayer(this);

				let layer: AddShopLayer = new AddShopLayer("", true );
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);
				break;
			}

			case this.btn_config:
			{

				// let layer: EditShopTagLayer = new EditShopTagLayer(this.mShopKey);
				// LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer)
				break;
			}

			case this.btn_shop:
			{
				LayerManager.GetInstance().popLayer(this);

				let layer: ShopPoolLayer = new ShopPoolLayer();
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);
				break;
			}

			case this.btn_start:
			{
				LayerManager.GetInstance().popLayer(this);
				
				let layer: RandChooseTagLayer = new RandChooseTagLayer();
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);
				break;
			}

			default:
			break;
		}
	}
	
}
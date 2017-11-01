class ShopCell extends BasicItemRenderer {
public img_bg:eui.Image;
public label_name:eui.Label;


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
		this.img_bg.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		NotifyCenter.getInstance().addEventListener(LocalEvents.CHANGE_SHOP_NAME , this.refreshShow , this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.CHANGE_SHOP_NAME , this.refreshShow , this );
		}, this);
	}
	

	protected dataChanged(): void 
	{
		this.refreshShow();
	}

	private refreshShow(): void {
		let shopInfo: StoreShopInfo = this.data ; 
		let newShopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfo(shopInfo.key);
		this.label_name.text = newShopInfo.name;
	}

	public handleTouch(event:egret.Event):void
	{ 
		switch(event.target)
		{
			case this.img_bg:
			{
				let shopInfo: StoreShopInfo = this.data ; 
				let layer: ShopInfoLayer = new ShopInfoLayer(shopInfo.key);
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);
				break;
			}
			default:
			break;
		}
	}
}
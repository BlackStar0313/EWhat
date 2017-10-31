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
	}
	

	protected dataChanged(): void 
	{
		let shopInfo: StoreShopInfo = this.data ; 
		this.label_name.text = shopInfo.name;
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
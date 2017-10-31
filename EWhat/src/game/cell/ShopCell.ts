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
	}
	

	protected dataChanged(): void 
	{
		let shopInfo: StoreShopInfo = this.data ; 
		this.label_name.text = shopInfo.name;
	}
}
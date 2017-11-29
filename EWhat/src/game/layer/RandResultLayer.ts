class RandResultLayer extends BasicLayer {
public label_title:eui.Label;
public btn_close:eui.Button;
public group_shop:eui.Group;
public icon_shop:eui.Image;
public label_shop_name:eui.Label;

	private m_shopIdx: number = 0 ; 

	public constructor(shopIdx: number) {
		super();
		this.m_shopIdx = shopIdx ; 
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

		let shopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfo(this.m_shopIdx);
		if (!shopInfo) {		//从预定义的商店里找	
			let item: ItemData = DataManager.getInstance().GetItem(this.m_shopIdx);
			if (!item) {
				egret.error("data error ");
				return ;
			}
			this.label_shop_name.text = item.data.name;
		}
		else {
			this.label_shop_name.text = shopInfo.name;
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
			default:
			break;
		}
	}

	
}
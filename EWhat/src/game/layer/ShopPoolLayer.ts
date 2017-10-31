class ShopPoolLayer extends BasicLayer {
public btn_close:eui.Button;
public btn_add_shop:eui.Button;
public scroller_shop:eui.Scroller;
public list_shop:eui.List;
public group_none:eui.Group;

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
		this.btn_add_shop.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		NotifyCenter.getInstance().addEventListener(LocalEvents.ADD_NEW_SHOP , this.refreshShow , this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.ADD_NEW_SHOP , this.refreshShow , this );
		}, this);

		this.refreshShow();
	}

	private refreshShow(): void {
		if (this.list_shop.dataProvider && this.list_shop.dataProvider.length > 0)
		{
			(<eui.ArrayCollection>this.list_shop.dataProvider).removeAll();
		}

		let dataArray: Array<StoreShopInfo> = [];

		let shopList: Array<StoreShopInfo> = GameStoreShopInfoManager.GetInstance().GetShopInfoList();
		for (let i = 0 ; i < shopList.length ; ++i) {
			let shopInfo: StoreShopInfo = shopList[i];
			let tagArray: Array<number > = [];
			for (let iTag = 0 ; iTag < shopInfo.tagArray.length ; ++iTag) {
				tagArray.push(shopInfo.tagArray[iTag]);
			}
			
			let copyShopInfo: StoreShopInfo = { key : shopInfo.key , name: shopInfo.name , tagArray: tagArray };
			dataArray.push(copyShopInfo);
		}
		
		let dataPro: eui.ArrayCollection = new eui.ArrayCollection();
		dataPro.source = dataArray;

		let layout:eui.TileLayout = new eui.TileLayout();
		layout.horizontalGap = 10;
		layout.requestedColumnCount = 3;
		layout.paddingLeft = 0;
		this.list_shop.layout = layout;
		this.list_shop.itemRenderer = ShopCell;
		this.list_shop.dataProvider = dataPro;
		this.scroller_shop.viewport = this.list_shop;


		this.group_none.visible = dataArray.length > 0 ? false : true ; 
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

				let layer: AddShopLayer = new AddShopLayer("");
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer)
				// let layer: EditShopLayer = new EditShopLayer();
				// LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);
				// break;
			}
			default:
			break;
		}
	}
	
}
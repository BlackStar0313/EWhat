class ShopInfoLayer extends BasicLayer {

public btn_close:eui.Button;
public group_shop:eui.Group;
public icon_shop:eui.Image;
public label_shop_name_icon:eui.Label;
public label_shop_name:eui.Label;
public scroller_tag:eui.Scroller;
public list_tag:eui.List;
public group_touch_tag:eui.Group;

	private mShopKey: number = 0 ; 

	public constructor(shopKey: number ) {
		super();
		this.mShopKey = shopKey ; 
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
		this.label_shop_name.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.group_touch_tag.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		NotifyCenter.getInstance().addEventListener(LocalEvents.SHOP_CHANGE_TAG , this.refreshShow , this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.SHOP_CHANGE_TAG , this.refreshShow , this );
		}, this);

		this.refreshShow();
	}

	private refreshShow(): void {
		let shopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfo(this.mShopKey);
		this.label_shop_name.text = shopInfo.name ; 
		this.label_shop_name_icon.text = shopInfo.name;


		//设置商店tag
		if (this.list_tag.dataProvider && this.list_tag.dataProvider.length > 0)
		{
			(<eui.ArrayCollection>this.list_tag.dataProvider).removeAll();
		}


		let dataArray: Array<TagShowNode> = [] ;
		for (let i = 0 ; i < shopInfo.tagArray.length ; ++i) {
			let tagInfo: StoreTagInfo = GameStoreShopInfoManager.GetInstance().GetTagInfo(shopInfo.tagArray[i]);
			let normalTag: TagShowNode = { tagInfo: tagInfo , showType: TagShowType.normal , onlyImgName: ""};
			dataArray.push(normalTag);
		}

		
		let dataPro: eui.ArrayCollection = new eui.ArrayCollection();
		dataPro.source = dataArray;

		let layout:eui.TileLayout = new eui.TileLayout();
		layout.horizontalGap = 10;
		layout.requestedColumnCount = 6;
		layout.paddingLeft = 0;
		this.list_tag.layout = layout;
		this.list_tag.itemRenderer = TagCell;
		this.list_tag.dataProvider = dataPro;
		this.scroller_tag.viewport = this.list_tag;


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

			case this.group_touch_tag:
			{

				let layer: EditShopTagLayer = new EditShopTagLayer(this.mShopKey);
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer)
				break;
			}
			default:
			break;
		}
	}
	
}
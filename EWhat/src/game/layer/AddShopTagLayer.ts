class AddShopTagLayer extends BasicLayer {
public btn_next:eui.Button;
public btn_before:eui.Button;
public btn_close:eui.Button;
public scroller_tag:eui.Scroller;
public list_tag:eui.List;

	private mShopName: string = "" ;
	private mSelectTagDic: { [tag: number]: boolean } = {}
	public constructor(shopName: string) {
		super();
		this.mShopName = shopName ; 
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
		this.btn_before.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		NotifyCenter.getInstance().addEventListener(LocalEvents.ADD_NEW_TAG , this.refreshShow , this );
		NotifyCenter.getInstance().addEventListener(LocalEvents.SELECT_TAG , this.selectTag , this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.ADD_NEW_TAG , this.refreshShow , this );
			NotifyCenter.getInstance().removeEventListener(LocalEvents.SELECT_TAG , this.selectTag , this );
		}, this);



		this.refreshShow();
	}

	private refreshShow(): void {
		if (this.list_tag.dataProvider && this.list_tag.dataProvider.length > 0)
		{
			(<eui.ArrayCollection>this.list_tag.dataProvider).removeAll();
		}

		let dataArray: Array<TagShowNode> = [] ;
		let addTag: TagShowNode = { tagInfo: null , showType: TagShowType.add, onlyImgName: ""};
		dataArray.push(addTag);

		let tagList: Array<StoreTagInfo> = GameStoreShopInfoManager.GetInstance().GetTagInfoList();
		for (let i = 0 ; i < tagList.length ; ++i) {
			let normalTag: TagShowNode = { tagInfo: tagList[i] , showType: TagShowType.normal , onlyImgName: ""};
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

	private selectTag(evt: egret.Event): void {
		if (!evt.data) {
			return ;
		}

		let tagInfo: StoreTagInfo = evt.data.tagInfo;
		this.mSelectTagDic[tagInfo.tag] = evt.data.isSelected ; 
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
				let tagArray: Array<number> = [] ; 
				for (let key in this.mSelectTagDic) {
					tagArray.push(parseInt(key) ) ; 
				}

				if (tagArray.length <= 0) {
					GameTipsActionHelper.ScreenTip("请选择至少一个标签作为商店标签", 34 , CONST_CONFIG.warningColor);
					return ;
				}

				let shopInfo: StoreShopInfo = { key: GameStoreShopInfoManager.GetInstance().GetShopHash() , 
												name: this.mShopName ,
												tagArray: tagArray }
				GameStoreShopInfoManager.GetInstance().StoreSingleShopInfoToLocal(shopInfo);
				NotifyCenter.getInstance().dispatchEventWith(LocalEvents.ADD_NEW_SHOP);


				LayerManager.GetInstance().popLayer(this);

				let str: string = "添加商店: {0}成功".format(this.mShopName);
				GameTipsActionHelper.ScreenTip(str, 34 , CONST_CONFIG.successColor);
				//TODO: do some action here ;

				break;
			}

			case this.btn_before:
			{
				LayerManager.GetInstance().popLayer(this);

				let layer: AddShopLayer = new AddShopLayer(this.mShopName);
				LayerManager.GetInstance().pushLayer(layer , LAYER_TYPE.PopUpLayer);
				break;
			}
			default:
			break;
		}
	}
}
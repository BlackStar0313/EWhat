class EditShopTagLayer extends BasicLayer {

public btn_close:eui.Button;
public scroller_tag_own:eui.Scroller;
public list_tag_own:eui.List;
public scroller_tag_not_own:eui.Scroller;
public list_tag_not_own:eui.List;
public btn_confirm:eui.Button;

	private mShopKey: number = 0 ; 
	private mDataOwnedArray: Array<TagShowNode> = [] ;
	private mDataNotOwnedArray: Array<TagShowNode> = [] ;
	public constructor(shopKey: number) {
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
		this.btn_confirm.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		let self = this;
		NotifyCenter.getInstance().addEventListener(LocalEvents.SWITCH_TAG , this.switchTag , this );
		NotifyCenter.getInstance().addEventListener(LocalEvents.ADD_NEW_TAG , this.onAddNewTag , this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.SWITCH_TAG , this.switchTag , this );
			NotifyCenter.getInstance().removeEventListener(LocalEvents.ADD_NEW_TAG , this.onAddNewTag , this );
			self.mDataOwnedArray = [];
			self.mDataNotOwnedArray = [];
		}, this);

		this.initData();
		this.refreshShow();
	}

	private initData(): void {
		let shopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfo(this.mShopKey);
		//商店已拥有
		for (let i = 0 ; i < shopInfo.tagArray.length ; ++i) {
			let tagInfo: StoreTagInfo = GameStoreShopInfoManager.GetInstance().GetTagInfo(shopInfo.tagArray[i]);
			let normalTag: TagShowNode = { tagInfo: tagInfo , showType: TagShowType.switchTag , onlyImgName: ""};
			this.mDataOwnedArray.push(normalTag);
		}

		//商店未拥有
		let addTag: TagShowNode = { tagInfo: null , showType: TagShowType.add, onlyImgName: ""};
		this.mDataNotOwnedArray.push(addTag);
		let allTag: Array<StoreTagInfo> = GameStoreShopInfoManager.GetInstance().GetTagInfoList();
		for (let i = 0 ; i < allTag.length ; ++i) {
			let storeTag: StoreTagInfo = allTag[i];
			let isOwned: boolean = false ; 
			for (let k = 0 ; k < shopInfo.tagArray.length; ++k) {
				if (storeTag.tag == shopInfo.tagArray[k]) {
					isOwned = true ;
					break;
				}
			}

			if (!isOwned) {
				let normalTag: TagShowNode = { tagInfo: storeTag , showType: TagShowType.switchTag , onlyImgName: ""};
				this.mDataNotOwnedArray.push(normalTag);
			}
		}
	}

	private refreshShow(): void {
		if (this.list_tag_own.dataProvider && this.list_tag_own.dataProvider.length > 0)
		{
			(<eui.ArrayCollection>this.list_tag_own.dataProvider).removeAll();
		}

		if (this.list_tag_not_own.dataProvider && this.list_tag_not_own.dataProvider.length > 0)
		{
			(<eui.ArrayCollection>this.list_tag_not_own.dataProvider).removeAll();
		}



		let dataPro1: eui.ArrayCollection = new eui.ArrayCollection();
		dataPro1.source = this.mDataOwnedArray;
		let layout1:eui.TileLayout = new eui.TileLayout();
		layout1.horizontalGap = 10;
		layout1.requestedColumnCount = 6;
		layout1.paddingLeft = 0;
		this.list_tag_own.layout = layout1;
		this.list_tag_own.itemRenderer = TagCell;
		this.list_tag_own.dataProvider = dataPro1;
		this.scroller_tag_own.viewport = this.list_tag_own;


		
		let dataPro: eui.ArrayCollection = new eui.ArrayCollection();
		dataPro.source = this.mDataNotOwnedArray;
		let layout:eui.TileLayout = new eui.TileLayout();
		layout.horizontalGap = 10;
		layout.requestedColumnCount = 6;
		layout.paddingLeft = 0;
		this.list_tag_not_own.layout = layout;
		this.list_tag_not_own.itemRenderer = TagCell;
		this.list_tag_not_own.dataProvider = dataPro;
		this.scroller_tag_not_own.viewport = this.list_tag_not_own;


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

			case this.btn_confirm:
			{
				this.updateShopInfo();
				NotifyCenter.getInstance().dispatchEventWith(LocalEvents.SHOP_CHANGE_TAG);

				LayerManager.GetInstance().popLayer(this);
			}
			default:
			break;
		}
	}

	private isOwnedTag(tag: number ): boolean {
		for (let i = 0 ; i < this.mDataOwnedArray.length ; ++i) {
			if (this.mDataOwnedArray[i].tagInfo.tag == tag) {
				return true ;
			}
		}
		return false ; 
	}

	private switchTag(evt: egret.Event): void {
		let tag: number = evt.data.tag ; 
		if (this.isOwnedTag(tag)) {
			if (this.mDataOwnedArray.length <= 1) {
				GameTipsActionHelper.ScreenTip("饭店至少有一个标签", 34 , CONST_CONFIG.warningColor);
				return ;
			}
			this.switchData(tag, this.mDataOwnedArray, this.mDataNotOwnedArray);
		}
		else {
			this.switchData(tag, this.mDataNotOwnedArray, this.mDataOwnedArray);
		}

		this.refreshShow();
	}

	private switchData(tag: number , source:Array<TagShowNode> , target: Array<TagShowNode>): void {

		for (let i = 0 ; i < source.length ; ++i) {
			if (source[i].tagInfo && source[i].tagInfo.tag == tag) {
				target.push(source[i]);
				source.splice(i, 1);
				return ;
			}
		}
	}

	private updateShopInfo(): void {
		let ownArr: Array<number > = [];
		for (let i = 0; i < this.mDataOwnedArray.length ; ++i) {
			ownArr.push(this.mDataOwnedArray[i].tagInfo.tag);
		}

		let shopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfo(this.mShopKey);
		shopInfo.tagArray = ownArr ; 
		GameStoreShopInfoManager.GetInstance().StoreSingleShopInfoToLocal(shopInfo);
	}

	private onAddNewTag(evt: egret.Event): void {
		if (!evt.data || !evt.data.tag) {
			egret.error("~~~  error data ");
			return ;
		}

		
		let tagInfo: StoreTagInfo = GameStoreShopInfoManager.GetInstance().GetTagInfo(evt.data.tag);
		let normalTag: TagShowNode = { tagInfo: tagInfo , showType: TagShowType.switchTag , onlyImgName: ""};
		this.mDataNotOwnedArray.push(normalTag);

		this.refreshShow();
	}
	
}
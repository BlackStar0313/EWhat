class AddShopTagLayer extends BasicLayer {
public btn_next:eui.Button;
public btn_before:eui.Button;
public btn_close:eui.Button;
public scroller_tag:eui.Scroller;
public list_tag:eui.List;

	private mShopName: string = "" ;
	private mSelectedTag: number = 0 ;
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


		let dataArray: Array<TagShowNode> = [] ;
		let addTag: TagShowNode = { tagInfo: null , showType: TagShowType.add, imgName: ""};
		dataArray.push(addTag);

		let tagList: Array<StoreTagInfo> = GameStoreShopInfoManager.GetInstance().GetTagInfoList();
		for (let i = 0 ; i < tagList.length ; ++i) {
			let normalTag: TagShowNode = { tagInfo: tagList[i] , showType: TagShowType.normal , imgName: ""};
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

			case this.btn_next:
			{
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
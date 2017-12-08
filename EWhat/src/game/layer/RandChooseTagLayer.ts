class RandChooseTagLayer extends BasicLayer {
public btn_next:eui.Button;
public btn_back:eui.Button;
public scroller_tag:eui.Scroller;
public list_tag:eui.List;


	private mSelectTagDic: { [tag: number]: boolean } = {}

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
		this.btn_next.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		NotifyCenter.getInstance().addEventListener(LocalEvents.SELECT_TAG , this.selectTag , this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
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
		let addTag: TagShowNode = { tagInfo: CONST_CONFIG.defaultTagInfo , showType: TagShowType.normal, onlyImgName: ""};
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
			case this.btn_back:
			{
				LayerManager.GetInstance().popLayer(this);
				break;
			}

			case this.btn_next:
			{
				let selectTagArr: Array<number> = [] ; 
				let isCanNext: boolean = false ; 
				for (let key in this.mSelectTagDic) {
					if (this.mSelectTagDic[key] == true ) {
						isCanNext = true ;
						selectTagArr.push(parseInt(key));
					}
				}

				if (isCanNext == false ) {
					GameTipsActionHelper.ScreenTip("至少选择一个tag进行随机", 34 , CONST_CONFIG.warningColor);
					return ;
				}


				LayerManager.GetInstance().popLayer(this);

				let layer: RandLayer = new RandLayer(selectTagArr);
				LayerManager.GetInstance().pushLayer(layer , LAYER_TYPE.PopUpLayer);

				//TODO:需要在这里传入商店相关的信息给randlayer去构造
				break;
			}
			default:
			break;
		}
	}
	
}
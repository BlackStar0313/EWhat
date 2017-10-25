class AddTagLayer extends BasicLayer {
public btn_add:eui.Button;
public btn_close:eui.Button;
public edit_name:eui.EditableText;
public scroller_tag:eui.Scroller;
public list_tag:eui.List;
;



	private mTagName: string = "";

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
		this.btn_add.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		this.edit_name.addEventListener(egret.Event.FOCUS_IN, this.onFocusIn, this);
		this.edit_name.addEventListener(egret.Event.FOCUS_OUT, this.onFocusOut, this);
		this.edit_name.addEventListener(egret.Event.CHANGE, this.onTextChange, this);

		let dataArray: Array<TagShowNode> = [] ;
		let addTag: TagShowNode = { tagInfo: null , showType: TagShowType.add};
		dataArray.push(addTag);

		let tagList: Array<StoreTagInfo> = GameStoreShopInfoManager.GetInstance().GetTagInfoList();
		for (let i = 0 ; i < tagList.length ; ++i) {
			let normalTag: TagShowNode = { tagInfo: tagList[i] , showType: TagShowType.normal };
			dataArray.push(normalTag);
		}
		
		let dataPro: eui.ArrayCollection = new eui.ArrayCollection();
		dataPro.source = dataArray;
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

			case this.btn_add:
			{
				if (this.mTagName == "") {
					GameTipsActionHelper.ScreenTip("请输入标签名字", 42, CONST_CONFIG.warningColor);
					return;
				}
				
				LayerManager.GetInstance().popLayer(this);
				break;
			}
			default:
			break;
		}
	}

	private onFocusIn(evt: egret.Event): void {
		this.edit_name.text = "";
		this.mTagName = "";
	}

	private onFocusOut(evt: egret.Event): void {
		let text:string = evt.target.text;
		if (text == "") {
			text = "输入店名";
			this.edit_name.text = text ;
			this.mTagName = "" ; 
		}
		else {
			this.mTagName = text ; 
		}
	}

	private onTextChange(evt: egret.Event): void {
		let text:string = evt.target.text;
		if (text != "") {
			this.edit_name.text = text ; 
		}
	}
	
}
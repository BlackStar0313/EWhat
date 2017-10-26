class AddTagLayer extends BasicLayer {
public btn_add:eui.Button;
public btn_close:eui.Button;
public edit_name:eui.EditableText;
public scroller_tag:eui.Scroller;
public list_tag:eui.List;



	private mTagName: string = "";
	private mSelectedImgNode: TagShowNode = null ;

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
		NotifyCenter.getInstance().addEventListener(LocalEvents.SELECT_TAG_ONLY_IMG , this.onSelectImg , this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.SELECT_TAG_ONLY_IMG , this.onSelectImg , this );
		}, this);


		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_add.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		this.edit_name.addEventListener(egret.Event.FOCUS_IN, this.onFocusIn, this);
		this.edit_name.addEventListener(egret.Event.FOCUS_OUT, this.onFocusOut, this);
		this.edit_name.addEventListener(egret.Event.CHANGE, this.onTextChange, this);

		let dataArray: Array<TagShowNode> = [] ;

		let imgName: string = "tag_{0}_png";
		for (let i = 1 ; i < 5 ; ++i) {
			let node: TagShowNode = { tagInfo: null , showType: TagShowType.onlyImg , imgName: imgName.format(i) };
			dataArray.push(node);
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

			case this.btn_add:
			{
				if (this.mTagName == "") {
					GameTipsActionHelper.ScreenTip("请输入标签名字", 42, CONST_CONFIG.warningColor);
					return;
				}

				if (this.mSelectedImgNode == null) {
					GameTipsActionHelper.ScreenTip("请选择图片", 42, CONST_CONFIG.warningColor);
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
			text = "输入标签名字";
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

	private onSelectImg(evt: egret.Event): void {
		this.mSelectedImgNode = evt.data.tagNode;
	}
	
}
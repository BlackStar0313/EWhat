enum TagShowType {
	add , 		//增加tag用的，只是加号
	normal ,  //正常显示tagcell, 可点击选中
	onlyImg,  //只展示tag图片
	switchTag,	//转换商店标签用的
}
interface TagShowNode {
	tagInfo: StoreTagInfo , 	//正常 tag cell 用
	showType: TagShowType , 
	onlyImgName: string 		//添加 tag,只显示图片 用
}

class TagCell extends BasicItemRenderer {
public img_tag:eui.Image;
public label_name:eui.Label;
public img_selected:eui.Image;
;

	private mTagShowNode: TagShowNode = null ;
	private mIsSelected: boolean = false ; 
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
		this.initEvent();
	}

	private initEvent(): void {
		this.img_tag.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		NotifyCenter.getInstance().addEventListener(LocalEvents.SELECT_TAG_ONLY_IMG , this.onSelectImg , this );
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.SELECT_TAG_ONLY_IMG , this.onSelectImg , this );
		}, this);
	}

	protected dataChanged(): void 
	{
		this.label_name.visible = false ; 
		this.img_selected.visible = this.mIsSelected ; 
		this.mTagShowNode = this.data ;

		switch (this.mTagShowNode.showType) {
			case TagShowType.add:
			{
				this.img_tag.source = "ui_add_png";
				break;
			}

			case TagShowType.onlyImg:
			{
				this.img_tag.source = this.mTagShowNode.onlyImgName;
				break;
			}

			case TagShowType.normal:
			case TagShowType.switchTag:
			{
				this.label_name.visible = true ;
				this.label_name.text = this.mTagShowNode.tagInfo.name;
				this.img_tag.source = this.mTagShowNode.tagInfo.img ;
				break;
			}
				
		
			default:
				break;
		}
	}

	public handleTouch(event:egret.Event):void
	{ 
		switch(event.target)
		{
			case this.img_tag:
			{
				if (this.mTagShowNode.showType == TagShowType.add) {
					let layer: AddTagLayer = new AddTagLayer();
					LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);
				}
				else if (this.mTagShowNode.showType == TagShowType.onlyImg) {
					this.DoSelectCell();

					let node = this.mIsSelected ? this.mTagShowNode : null;
					NotifyCenter.getInstance().dispatchEventWith(LocalEvents.SELECT_TAG_ONLY_IMG , false , { tagNode: node });
				}
				else if (this.mTagShowNode.showType == TagShowType.normal) {
					this.DoSelectCell();
					
					NotifyCenter.getInstance().dispatchEventWith(LocalEvents.SELECT_TAG , false , {isSelected: this.mIsSelected, tagInfo: this.mTagShowNode.tagInfo });
				}
				else if (this.mTagShowNode.showType == TagShowType.switchTag) {
					NotifyCenter.getInstance().dispatchEventWith(LocalEvents.SWITCH_TAG , false , {tag: this.mTagShowNode.tagInfo.tag  });
				}
				break;
			}
			default:
			break;
		}
	}

	private DoSelectCell(): void {
		this.mIsSelected = !this.mIsSelected;
		this.img_selected.visible = this.mIsSelected ; 
	}
	
	//添加标签图片用
	private onSelectImg(evt: egret.Event) {
		if (evt.data && evt.data.tagNode ) {
			let tagNode: TagShowNode = evt.data.tagNode;
			if (tagNode.showType == TagShowType.onlyImg && 
				this.mTagShowNode.showType == TagShowType.onlyImg && 
				tagNode.onlyImgName != this.mTagShowNode.onlyImgName) {	//别的cell被选中

				this.mIsSelected = false ; 
				this.img_selected.visible = false ; 
			}
		}
	}

	//选择tag用
	// private onSelectTag(evt: egret.Event): void {
	// 	if (evt.data && evt.data.tagNode ) {
	// 		let tagNode: StoreTagInfo = evt.data.tagNode;
	// 		if (this.mTagShowNode.showType == TagShowType.normal && tagNode.img != this.mTagShowNode.tagInfo.img) {	//别的cell被选中
	// 			this.mIsSelected = false ; 
	// 			this.img_selected.visible = false ; 
	// 		}
	// 	}
	// }
}
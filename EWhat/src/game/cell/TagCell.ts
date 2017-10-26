enum TagShowType {
	add , 
	normal ,
	onlyImg,
}
interface TagShowNode {
	tagInfo: StoreTagInfo , 
	showType: TagShowType , 
	imgName: string 
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
		if (this.mTagShowNode.showType == TagShowType.add) {
			this.img_tag.source = "ui_add_png";
		}
		else if (this.mTagShowNode.showType == TagShowType.onlyImg) {
			this.img_tag.source = this.mTagShowNode.imgName;
		}
		else {
			this.label_name.visible = true ;
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
					this.mIsSelected = !this.mIsSelected;
					this.img_selected.visible = this.mIsSelected ; 

					let node = this.mIsSelected ? this.mTagShowNode : null;
					NotifyCenter.getInstance().dispatchEventWith(LocalEvents.SELECT_TAG_ONLY_IMG , false , { tagNode: node });
				}
				else if (this.mTagShowNode.showType == TagShowType.normal){
					NotifyCenter.getInstance().dispatchEventWith(LocalEvents.SELECT_TAG , false , { tagInfo: this.mTagShowNode.tagInfo });
				}
				break;
			}
			default:
			break;
		}
	}
	

	private onSelectImg(evt: egret.Event) {
		if (evt.data && evt.data.tagNode ) {
			let tagNode: TagShowNode = evt.data.tagNode;
			if (tagNode.showType == TagShowType.onlyImg && tagNode.imgName != this.mTagShowNode.imgName) {	//别的cell被选中
				this.mIsSelected = false ; 
				this.img_selected.visible = false ; 
			}
		}
	}
}
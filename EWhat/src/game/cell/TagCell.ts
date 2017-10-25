enum TagShowType {
	add , 
	normal 
}
interface TagShowNode {
	tagInfo: StoreTagInfo , 
	showType: TagShowType
}

class TagCell extends BasicItemRenderer {
public img_tag:eui.Image;
public label_name:eui.Label;

	private mTagShowNode: TagShowNode = null ;
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
	}

	protected dataChanged(): void 
	{
		this.mTagShowNode = this.data ;
		if (this.mTagShowNode.showType == TagShowType.add) {
			this.img_tag.source = "ui_add_png";
		}
		else {

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
				else {
					NotifyCenter.getInstance().dispatchEventWith(LocalEvents.SELECT_TAG , false , { tagInfo: this.mTagShowNode.tagInfo });
				}
				break;
			}
			default:
			break;
		}
	}
	
}
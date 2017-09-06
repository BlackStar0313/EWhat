class RandCell extends eui.ItemRenderer {
public img_bg:eui.Image;
public img_goods:eui.Image;
public label_name:eui.Label;
public img_mask:eui.Image;



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
		this.img_bg.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		NotifyCenter.getInstance().addEventListener(LocalEvents.CLOSE_ITEM  , this.closeItem , this );
		NotifyCenter.getInstance().addEventListener(LocalEvents.RESTART , this.restart , this );
		this.img_mask.visible = false; 
	}

	protected dataChanged(): void {
		let item: ItemData = this.data.item; 

		this.img_bg.source = item.data.bgImg ; 
		this.img_goods.source = item.data.icon ; 
		this.label_name.text = item.data.name ; 
	}

	private closeItem(evt:egret.Event): void {
		let id: number = evt.data.id ; 
		let item: ItemData = this.data.item; 
		if (id == item.data.idx) {
			this.img_mask.visible = true ; 
		}
	}

	private restart(evt: egret.Event): void {
		this.img_mask.visible = false; 
	}
	

	public handleTouch(event:egret.Event):void
	{ 
		switch(event.target)
		{
			case this.img_bg:
			{
				break;
			}
			default:
			break;
		}
	}
}
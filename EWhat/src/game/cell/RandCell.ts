class RandCell extends BasicItemRenderer {
public group_arm:eui.Group;
public img_bg:eui.Image;
public img_goods:eui.Image;
public label_name:eui.Label;
public img_mask:eui.Image;


	private m_goodsArm: dragonBones.Armature = null ; 
	private m_curStartArmName: string = "";
	private m_curStopArmName: string = "";


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
		NotifyCenter.getInstance().addEventListener(LocalEvents.FIRST_TIME_RUN , this.restart , this );

		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.RESTART , this.restart , this );
			NotifyCenter.getInstance().removeEventListener(LocalEvents.CLOSE_ITEM  , this.closeItem , this );
			NotifyCenter.getInstance().removeEventListener(LocalEvents.FIRST_TIME_RUN , this.restart , this );
		}, this);
		this.img_mask.visible = false; 
	}

	public GetShopKey(): number {
		if (this.data) {
			return (<StoreShopInfo>(this.data)).key;
		}
		return -1 ;
	}

	protected dataChanged(): void {
		let item: StoreShopInfo = this.data; 

		// this.img_bg.source = item.data.bgImg ; 
		// this.img_goods.source = item.data.icon ; 
		this.label_name.text = item.name ; 


		if (!this.m_goodsArm) {
			this.randArmNam();

			this.m_goodsArm = DragonBonesManager.GetInstance().createDragoneBonesAramture(DragonbonesEnum.btn);
			this.group_arm.addChildAt(this.m_goodsArm.getDisplay() , 1);  
			this.m_goodsArm.display.x = this.group_arm.x + this.group_arm.width/2; 
			this.m_goodsArm.display.y = this.group_arm.y + this.group_arm.height/2; 
			this.m_goodsArm.animation.play(this.m_curStartArmName );
			DragonBonesManager.GetInstance().AddArmInWorldClock(this.m_goodsArm);

			if (UserCenter.getInstance().isFirstTimeIn) {
				this.m_goodsArm.animation.play(this.m_curStopArmName);
			}

		}
	}

	private closeItem(evt:egret.Event): void {
		let id: number = evt.data.id ; 
		let item: StoreShopInfo = this.data; 
		if (id == item.key) {
			// this.img_mask.visible = true ; 
			this.m_goodsArm.animation.stop();
			this.m_goodsArm.animation.play(this.m_curStopArmName);
			DragonBonesManager.GetInstance().AddArmInWorldClock(this.m_goodsArm);
		}
	}

	private restart(evt: egret.Event): void {
		this.m_goodsArm.animation.stop();
		this.m_goodsArm.animation.play(this.m_curStartArmName);
		DragonBonesManager.GetInstance().AddArmInWorldClock(this.m_goodsArm);
	}

	private firstTimeRun(evt:egret.Event): void {
		this.m_goodsArm.animation.play(this.m_curStartArmName);
		DragonBonesManager.GetInstance().AddArmInWorldClock(this.m_goodsArm);
	}
	
	//test code 
	private randArmNam(): void {
		let rand: number = Math.floor(Math.random()* 2);
		this.m_curStartArmName = rand == 1 ? DragonBonesConfig.STR_ARM_BTN1_JUMP : DragonBonesConfig.STR_ARM_BTN2_JUMP;
		this.m_curStopArmName = rand == 1 ? DragonBonesConfig.STR_ARM_BTN1_STOP : DragonBonesConfig.STR_ARM_BTN2_STOP;
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
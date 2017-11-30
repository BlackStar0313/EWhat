class RandResultLayer extends BasicLayer {
public group_mask:eui.Group;
public group_bg:eui.Group;
public label_title:eui.Label;
public btn_close:eui.Button;
public group_shop:eui.Group;
public icon_shop:eui.Image;
public label_shop_name:eui.Label;



	private m_shopIdx: number = 0 ; 
	private m_sourcePos: egret.Point = new egret.Point(0,0);
	private m_mask: egret.Shape = null ; 

	public constructor(shopIdx: number, sourcePos: egret.Point) {
		super();
		this.m_shopIdx = shopIdx ; 

		if (sourcePos) {
			this.m_sourcePos = sourcePos;
		}
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		this.SetLayerActionConfig(LAYER_ACTION_TYPE.Custom , LAYER_ACTION_TYPE.POP_OUT, this );
		super.childrenCreated();
		this.init();
	}
	
	private init(): void {
		this.btn_close.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		let shopInfo: StoreShopInfo = GameStoreShopInfoManager.GetInstance().GetShopInfo(this.m_shopIdx);
		if (!shopInfo) {		//从预定义的商店里找	
			let item: ItemData = DataManager.getInstance().GetItem(this.m_shopIdx);
			if (!item) {
				egret.error("data error ");
				return ;
			}
			this.label_shop_name.text = item.data.name;
		}
		else {
			this.label_shop_name.text = shopInfo.name;
		}

		this.doPopInAction();
	}

	public handleTouch(event:egret.Event):void
	{ 
		switch(event.target)
		{
			case this.btn_close:
			{
				this.group_mask.removeChild(this.m_mask);
				LayerManager.GetInstance().popLayer(this);
				break;
			}
			default:
			break;
		}
	}

	private doPopInAction(): void {
		this.m_mask = new egret.Shape();
		this.m_mask.x = 0;
		this.m_mask.y = 0;
		this.m_mask.graphics.clear();
		this.m_mask.graphics.beginFill(0x000000, 0.75);
		this.m_mask.graphics.drawRect(0,0,egret.MainContext.instance.stage.stageWidth,egret.MainContext.instance.stage.stageHeight);
		this.m_mask.graphics.endFill();
		this.m_mask.alpha = 0 ; 
		this.group_mask.addChild(this.m_mask);
		this.group_bg.visible = false ; 

		let twe: egret.Tween = egret.Tween.get(this.m_mask);
		twe.to( { alpha:1 } , 700 );

		let targetX: number = this.group_shop.x ; 
		let targetY: number = this.group_shop.y ;
		this.group_shop.x = this.m_sourcePos.x;
		this.group_shop.y = this.m_sourcePos.y ; 
		let tweMove: egret.Tween = egret.Tween.get(this.group_shop);
		let self = this ;
		tweMove.to( { x: targetX , y: targetY} , 700 , egret.Ease.backIn ).call( function(groupBg:eui.Group) {
			groupBg.visible = true ; 
			self.DoShiningAction();
		}, this , [this.group_bg] )
	}

	private DoShiningAction(): void {
		let shine: egret.Shape= new egret.Shape();
        shine.graphics.beginFill(0xFFFFFF, 1);
        shine.graphics.drawRect(0,0,this.width,this.height);
        shine.graphics.endFill();
		this.addChildAt(shine , 10000) ;
		shine.x = 0 ; 
		shine.y = 0 ;

		let tween: egret.Tween = egret.Tween.get(shine);
		tween.to({ alpha: 0 } , 1000).call( function(shape: egret.Shape ) {
			if (shape && shape.$parent) {
				shape.$parent.removeChild(shape);
			} 
		} , this , [shine]);
	}
	
}
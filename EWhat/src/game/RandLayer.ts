class RandLayer extends eui.Component implements  eui.UIComponent {
public group_goods:eui.DataGroup;
public btn_start:eui.Button;

	private m_goodsList: Array<ItemData> = [] ; 
	private m_randTimer: egret.Timer = null ;
	private m_isFirstTime: boolean = true ; 

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
		this.btn_start.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.RefreshShow();
	}

	public RefreshShow(): void {
		let goodsData:{ [idx: number ]: ItemData } = DataManager.getInstance().GetRandShowItems();


		let layout: eui.TileLayout = new eui.TileLayout(); 
		// layout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_WIDTH ; 
		// layout.rowAlign = eui.RowAlign.JUSTIFY_USING_HEIGHT ; 
		layout.horizontalAlign = egret.HorizontalAlign.CENTER;
		layout.verticalAlign = egret.VerticalAlign.TOP;
		layout.verticalGap = 0;
		layout.horizontalGap = 0;
		layout.requestedColumnCount = 4 ;
		this.group_goods.layout = layout ; 

		let dataProvider:eui.ArrayCollection = new eui.ArrayCollection();
		for (let key in goodsData) {
			let goods: ItemData = goodsData[key];
			dataProvider.addItem( {
				item: goods 
			} );
		}

		this.group_goods.itemRenderer = RandCell;
		this.group_goods.dataProvider = dataProvider;


		this.m_goodsList = []; 
		for (let key in goodsData) {
			let goods: ItemData = goodsData[key];
			this.m_goodsList.push(goods);
		}
	}

	public handleTouch(event:egret.Event):void
	{ 
		switch(event.target)
		{
			case this.btn_start:
			{
				if (this.m_isFirstTime) {
					this.m_isFirstTime = false ; 
					this.startRandTimer();
					return ;
				} 

				if (this.m_randTimer) {
					return ; 
				}

				NotifyCenter.getInstance().dispatchEventWith(LocalEvents.RESTART) ;


				this.RefreshShow();
				this.startRandTimer();
				break;
			}
			default:
			break;
		}
	}

	private startRandTimer(): void {
		if (this.m_goodsList.length <= 1) {
			if (this.m_randTimer) {
				this.m_randTimer.stop();
				this.m_randTimer = null ;
			}
			return ; 
		}

		this.m_randTimer = new egret.Timer(1000 , 1);
		let self = this ; 
		this.m_randTimer.addEventListener(egret.TimerEvent.TIMER, ()=> { 
			let randId: number = Math.floor(Math.random() * this.m_goodsList.length)  ; 
			NotifyCenter.getInstance().dispatchEventWith( LocalEvents.CLOSE_ITEM , false, {
				id: this.m_goodsList[randId].data.idx 
			} );
			this.m_goodsList.splice(randId, 1) ;
			this.startRandTimer();
		}
		,this ) ;
		this.m_randTimer.start(); 
	}
	
}
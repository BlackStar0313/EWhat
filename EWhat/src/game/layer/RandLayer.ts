class RandLayer extends BasicLayer {
public btn_back:eui.Button;
public group_goods:eui.DataGroup;
public btn_start:eui.Button;
public btn_config:eui.Button;



	private m_goodsList: Array<number> = [] ; 
	private m_randTimer: egret.Timer = null ;
	private m_selectTagArr: Array<number> = [];

	public constructor(selectTagArr: Array<number>) {
		super();

		for (let i = 0 ; i < selectTagArr.length; ++i) {
			this.m_selectTagArr.push(selectTagArr[i]);
		}
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
		this.btn_config.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);
		this.btn_back.addEventListener(egret.TouchEvent.TOUCH_END, this.handleTouch, this);

		NotifyCenter.getInstance().addEventListener(LocalEvents.START_RAND  , this.handleStartRand , this );
		NotifyCenter.getInstance().addEventListener(LocalEvents.STOP_RAND , this.handleStopRand , this );

		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, function () {
			NotifyCenter.getInstance().removeEventListener(LocalEvents.START_RAND , this.handleStartRand , this );
			NotifyCenter.getInstance().removeEventListener(LocalEvents.STOP_RAND  , this.handleStopRand , this );
		}, this);

		this.RefreshShow();
	}

	public RefreshShow(): void {
		if (this.group_goods.dataProvider) 
			(<eui.ArrayCollection>this.group_goods.dataProvider).removeAll();


		let layout: eui.TileLayout = new eui.TileLayout(); 
		// layout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_WIDTH ; 
		// layout.rowAlign = eui.RowAlign.JUSTIFY_USING_HEIGHT ; 
		layout.horizontalAlign = egret.HorizontalAlign.CENTER;
		layout.verticalAlign = egret.VerticalAlign.TOP;
		layout.verticalGap = 0;
		layout.horizontalGap = 0;
		layout.requestedColumnCount = 4 ;
		this.group_goods.layout = layout ;

		let showShopPool: Array<StoreShopInfo> = this.generateRandomPool(); 
		let dataProvider:eui.ArrayCollection = new eui.ArrayCollection();
		dataProvider.source = showShopPool; 
		this.group_goods.itemRenderer = RandCell;
		this.group_goods.dataProvider = dataProvider;


		this.m_goodsList = []; 
		for (let i = 0 ; i < showShopPool.length ; ++i) {
			let goods: StoreShopInfo = showShopPool[i];
			this.m_goodsList.push(goods.key);
		}
	}

	private generateRandomPool(): Array<StoreShopInfo> {
		let showShopPool: Array<StoreShopInfo> = [] ; 

		//处理默认使用数值表的情况
		for (let i = 0 ; i < this.m_selectTagArr.length; ++i) {
			let tag: number = this.m_selectTagArr[i];
			//默认读数值表
			if (tag == CONST_CONFIG.defaultTagInfo.tag) {
				let goodsData:{ [idx: number ]: ItemData } = DataManager.getInstance().GetRandShowItems();
				for (let key in goodsData) {
					let node: StoreShopInfo =  
					{
						key: goodsData[key].data.idx,
						name: goodsData[key].data.name, 
						tagArray: [CONST_CONFIG.defaultTagInfo.tag]
					} ;
					showShopPool.push(node)
				}
			}
		}

		let storeShopArr = GameStoreShopInfoManager.GetInstance().GetShopInfoListByTagArray(this.m_selectTagArr);
		if (storeShopArr.length > 0) {
			showShopPool = showShopPool.concat(storeShopArr);
		}
		return showShopPool;
	}

	public handleTouch(event:egret.Event):void
	{ 
		switch(event.target)
		{
			case this.btn_start:
			{
				if (UserCenter.getInstance().isFirstTimeIn) {
					UserCenter.getInstance().isFirstTimeIn = false ; 
					NotifyCenter.getInstance().dispatchEventWith(LocalEvents.RESTART) ;
					NotifyCenter.getInstance().dispatchEventWith(LocalEvents.START_RAND);
					return ;
				} 

				if (this.m_randTimer) {
					return ; 
				}

				this.RefreshShow();
				NotifyCenter.getInstance().dispatchEventWith(LocalEvents.START_RAND);
				break;
			}

			case this.btn_config: 
			{
				let layer: ShopPoolLayer = new ShopPoolLayer();
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);				
				break;
			}

			case this.btn_back: {
				NotifyCenter.getInstance().dispatchEventWith(LocalEvents.STOP_RAND , false , { isResult: false  });
				UserCenter.getInstance().isFirstTimeIn = true ; 
				LayerManager.GetInstance().popLayer(this);

				// let layer: RandChooseTagLayer = new RandChooseTagLayer();
				// LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer);

				let layer: MainLayer = new MainLayer();
				LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.BasicUIlayer);
				break;
			}
			default:
			break;
		}
	}

	private startRandTimer(): void {
		if (this.m_goodsList.length <= 1) {
			NotifyCenter.getInstance().dispatchEventWith(LocalEvents.STOP_RAND , false , { isResult: true  });
			return ; 
		}



		this.m_randTimer = new egret.Timer(1000 , 1);
		let self = this ; 
		this.m_randTimer.addEventListener(egret.TimerEvent.TIMER, ()=> { 
			let randId: number = Math.floor(Math.random() * this.m_goodsList.length)  ; 
			NotifyCenter.getInstance().dispatchEventWith( LocalEvents.CLOSE_ITEM , false, {
				id: self.m_goodsList[randId]
			} );
			self.m_goodsList.splice(randId, 1) ;
			self.startRandTimer();
		}
		,this ) ;
		this.m_randTimer.start(); 
	}

	private handleStartRand(): void {
		this.startRandTimer();
		GTSoundEngine.getInstance().playMusic("good_time_mp3");
	}

	private handleStopRand(evt: egret.Event): void {
		if (this.m_randTimer) {
			this.m_randTimer.stop();
			this.m_randTimer = null ;
		}
		GTSoundEngine.getInstance().stopMusic();

		let pos: egret.Point = null ; 
		if (evt.data && evt.data.isResult) {
			for (let i = 0 ; i < this.group_goods.$children.length ; ++i) {
				let goodsCell: RandCell = <RandCell>this.group_goods.$children[i];
				if (goodsCell && goodsCell.GetShopKey() == this.m_goodsList[0]) {
					pos = goodsCell.localToGlobal();
					break;
				}
			}

			let layer: RandResultLayer = new RandResultLayer(this.m_goodsList[0] , pos );
			LayerManager.GetInstance().pushLayer(layer, LAYER_TYPE.PopUpLayer, false );	
		}
	
	}
	
}
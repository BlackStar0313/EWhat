class MainScene extends egret.DisplayObjectContainer{
	public static m_pThis: MainScene = null ; 

	private m_width: number = 0 ; 
	private m_height: number = 0 ; 

	private m_randLayer: BasicLayer = null ; 

	public set screenWidth(v:number) { this.m_width = v; }
	public get screenWidth():number { return this.m_width;}

	public set screenHeight(v:number) { this.m_height = v; }
	public get screenHeight():number { return this.m_height;}


	public static GetInstance(): MainScene {
		if (MainScene.m_pThis == null) {
			MainScene.m_pThis = new MainScene();
		}
		return MainScene.m_pThis ;
	}

	public constructor() {
		super();
		LayerManager.GetInstance().initScene(this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(): void {
		// let img: eui.Image = new eui.Image(); 
		// img.source = "bg_jpg";
		// img.x = 0 ;
		// img.y = 0; 
		// this.addChild(img);


		// let imgCell: eui.Image = new eui.Image() ;
		// imgCell.source = "ba6_s1_png";
		// imgCell.x = this.screenWidth/2 ; 
		// imgCell.y = this.screenHeight/2 ; 
		// this.addChild(imgCell);

		// let items = DataManager.getInstance().GetItems();
		// console.log("dafdf" , items)

		let mask:egret.Shape = new egret.Shape();
		mask.graphics.clear();
		mask.graphics.beginFill(0x000000, 0.75);
		mask.graphics.drawRect(0,0,egret.MainContext.instance.stage.stageWidth,egret.MainContext.instance.stage.stageHeight);
		mask.graphics.endFill();
		this.addChild(mask);


		this.m_randLayer = new RandLayer();
		LayerManager.GetInstance().pushLayer(this.m_randLayer, LAYER_TYPE.BasicUIlayer);
	}

	
}
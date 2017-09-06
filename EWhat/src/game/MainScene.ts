class MainScene extends egret.DisplayObjectContainer{
	public static m_pThis: MainScene = null ; 

	private m_width: number = 0 ; 
	private m_height: number = 0 ; 

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
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(): void {

		let img: eui.Image = new eui.Image(); 
		img.source = "bg_jpg";
		img.x = 0 ;
		img.y = 0; 
		this.addChild(img);


		let imgCell: eui.Image = new eui.Image() ;
		imgCell.source = "ba6_s1_png";
		imgCell.x = this.screenWidth/2 ; 
		imgCell.y = this.screenHeight/2 ; 
		this.addChild(imgCell);

		let items = DataManager.getInstance().GetItems();
		console.log("dafdf" , items)
	}
}
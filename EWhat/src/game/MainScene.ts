class MainScene extends egret.DisplayObjectContainer{
	public static m_pThis: MainScene = null ; 
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
	}
}
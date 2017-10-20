class BasicItemRenderer extends eui.ItemRenderer{
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
	}

	protected filterTouch(target:any):boolean
	{
		return false;
	}

	//点击检查是否为当前引导步骤，若不是则不执行点击事件
	protected checkTouch(target:any):boolean
	{
		return false;
	}

	protected CheckResponse(name:string): void
	{
		
	}
	
}
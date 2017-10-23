interface StoreShopInfo {
	key: number ,
	name: string , 
	tag: number 
};

interface StoreTagInfo {
	tag: number , 
	img: number ,
	name: number 
};

class GameStoreShopInfoManager {
	private mShopInfoList: Array <StoreShopInfo> = [] ; 
	private mTagInfoList: Array<StoreTagInfo> = [] ; 
	private mMaxShopNum: number = 0 ;
	private mMaxTagNum: number = 0 ; 

	public static mInst: GameStoreShopInfoManager = null ; 
	public constructor() {
	}

	public static GetInstance(): GameStoreShopInfoManager {
		if (!GameStoreShopInfoManager.mInst) {
			GameStoreShopInfoManager.mInst = new GameStoreShopInfoManager();
		}
		return GameStoreShopInfoManager.mInst ; 
	}

	public GetShopInfoList(): Array <StoreShopInfo> { return this.mShopInfoList; }
	public GetTagInfoList(): Array<StoreTagInfo> { return this.mTagInfoList; }


	public GetShopInfo(key: number): StoreShopInfo {
		for (let i = 0 ;i < this.mShopInfoList.length ; ++i ) {
			if (key == this.mShopInfoList[i].key) {
				return this.mShopInfoList[i];
			}
		}
		return null ; 
	}

	public GetTagInfo(tag: number): StoreTagInfo {
		for (let i = 0 ;i < this.mTagInfoList.length ; ++i ) {
			if (tag == this.mTagInfoList[i].tag) {
				return this.mTagInfoList[i];
			}
		}
		return null ; 
	}

	public IsContainShop(key: number ): boolean {
		return this.GetShopInfo(key) == null ? false : true ; 
	}

	public IsContainTag(tag: number): boolean {
		return this.GetTagInfo(tag) == null ? false : true ;
	}

	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	public ParseShopInfoFromeLocal(): void {
		this.mShopInfoList = [];
		this.mMaxShopNum = asLocalStorage.getInstance().getKeyInt(StoreInfoLocalHelper.KeyMaxShopNum);
		this.mMaxShopNum = this.mMaxShopNum ? this.mMaxShopNum : 0 ; 
		for (let i = 0 ; i < this.mMaxShopNum; ++i) {
			let dataStr: string = asLocalStorage.getInstance().getKeyString(StoreInfoLocalHelper.KeyStoreShop + i);
			if(dataStr && dataStr.length>0) {
				let dataArray: Array<string> = dataStr.split(",");

				let node: StoreShopInfo =  
				{
					key: parseInt(dataArray[0]),
					name: dataArray[1], 
					tag: parseInt(dataArray[2])
				} ;
				this.mShopInfoList.push(node);
			}
		}
	}

	public StoreAllShopInfoToLocal(): void {
		for (let i = 0 ; i < this.mShopInfoList.length ; ++i) {
			this.StoreSingleShopInfoToLocal(this.mShopInfoList[i]);
			let str = this.generateShopStr(this.mShopInfoList[i]);
			asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreShop + this.mShopInfoList[i].key , str);
		}

		if (this.mShopInfoList.length > this.mMaxShopNum) {
			this.mMaxShopNum = this.mShopInfoList.length;
			asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxShopNum , this.mMaxShopNum);
		}
	}

	public StoreSingleShopInfoToLocal(node: StoreShopInfo): void {
		let str = this.generateShopStr(node);
		asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreShop + node.key, str);

		if (!this.IsContainShop(node.key)) {
			this.mShopInfoList.push(node);
			++this.mMaxShopNum;
			asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxShopNum , this.mMaxShopNum);
		}
	}


	private generateShopStr(node: StoreShopInfo): string {
		let str: string = "" ;
		str += node.key + ',';
		str += node.name + ',';
		str += node.tag ;
		return str ; 
	}

	public ClearAllShopInfoFromLocal():void {
		for (let i = 0 ; i < this.mShopInfoList.length ; ++i) {
			asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreShop + this.mShopInfoList[i].key , "");
		}
		this.mShopInfoList = [];

		this.mMaxShopNum = 0 ;
		asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxShopNum , 0);
	}

	public RemoveShop(key: number ): void {
		for (let i = 0 ;i < this.mShopInfoList.length ; ++i ) {
			if (key == this.mShopInfoList[i].tag) {
				this.mShopInfoList.splice(i , 1 );
			}
		}
		asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreShop + key, "");

		--this.mMaxShopNum;
		asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxShopNum , this.mMaxShopNum);
	}
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	//<<<<<<<<<<<<<<<<<<<<<<
	public ParseTagInfoFromeLocal(): void {
		this.mTagInfoList = [];
		this.mMaxTagNum = asLocalStorage.getInstance().getKeyInt(StoreInfoLocalHelper.KeyMaxTagNum);
		this.mMaxTagNum = this.mMaxTagNum ? this.mMaxTagNum : 0 ; 
		for (let i = 0 ; i < this.mMaxTagNum; ++i) {
			let dataStr: string = asLocalStorage.getInstance().getKeyString(StoreInfoLocalHelper.KeyStoreTag + i);
			if(dataStr && dataStr.length>0) {
				let dataArray: Array<string> = dataStr.split(",");

				let node: StoreTagInfo =  
				{
					tag: parseInt(dataArray[0]),
					img: parseInt(dataArray[1]), 
					name: parseInt(dataArray[2])
				} ;
				this.mTagInfoList.push(node);
			}
		}
	}

	public StoreTagToLocal(tagInfo: StoreTagInfo): void {
		let str = this.generateTagStr(tagInfo);
		asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreTag , str);

		if (!this.IsContainTag(tagInfo.tag)) {
			this.mTagInfoList.push(tagInfo);
			++this.mMaxTagNum;
			asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxTagNum , this.mMaxTagNum);
		}
	}

	private generateTagStr(node: StoreTagInfo): string {
		let str: string = "" ;
		str += node.tag + ',';
		str += node.img + ',';
		str += node.name ;
		return str ; 
	}

	public ClearAllTagInfoFromLocal():void {
		for (let i = 0 ; i < this.mTagInfoList.length ; ++i) {
			asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreTag + this.mTagInfoList[i].tag, "");
		}
		this.mTagInfoList = [];

		this.mMaxTagNum = 0 ;
		asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxTagNum , 0);
	}

	public RemoveTag(tag: number ): void {
		for (let i = 0 ;i < this.mTagInfoList.length ; ++i ) {
			if (tag == this.mTagInfoList[i].tag) {
				this.mTagInfoList.splice(i , 1 );
			}
		}
		asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreTag + tag, "");

		--this.mMaxTagNum;
		asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxTagNum , this.mMaxTagNum);
	}
	//>>>>>>>>>>>>>>>>>>>>>

	public ClearAll(): void {
		this.ClearAllShopInfoFromLocal();
		this.ClearAllTagInfoFromLocal();
	}
}
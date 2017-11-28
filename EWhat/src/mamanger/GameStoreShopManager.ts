interface StoreShopInfo {
	key: number ,
	name: string , 
	tagArray: Array<number>
};

interface StoreTagInfo {
	tag: number , 
	img: string ,
	name: string 
};

class GameStoreShopInfoManager {
	private mShopInfoList: Array <StoreShopInfo> = [] ; 
	private mTagInfoList: Array<StoreTagInfo> = [] ; 
	private mMaxShopNum: number = 0 ;
	private mMaxTagNum: number = 0 ; 
	private mTagHash: number = 0 ; 
	private mShopHash: number = 0 ; 

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

	public GetTagHash(): number { return this.mTagHash; }
	public GetShopHash(): number { return this.mShopHash; }

	public IsShopInfoExist(arr: Array<StoreShopInfo>, shopInfo: StoreShopInfo): boolean {
		for (let i = 0 ; i < arr.length ; ++i) {
			if (arr[i].key == shopInfo.key) {
				return true ;
			}
		}
		return false ;
	}

	public GetShopInfoListByTag(tag: number ): Array<StoreShopInfo> {
		let arr: Array<StoreShopInfo> = [] ; 
		for (let i = 0 ; i < this.mShopInfoList.length; ++i) {
			let shopInfo: StoreShopInfo = this.mShopInfoList[i];
			for (let iShop = 0 ; iShop < shopInfo.tagArray.length ; ++ iShop) {
				if (tag == shopInfo.tagArray[iShop] && this.IsShopInfoExist(arr , shopInfo) == false ) {
					arr.push(shopInfo);
				}
			}
		}
		return arr ; 
	}

	public GetShopInfoListByTagArray(tagArr: Array<number>): Array<StoreShopInfo> {
		let arr: Array<StoreShopInfo> = [] ; 
		for (let i = 0 ; i < tagArr.length; ++i) {
			let shopList = this.GetShopInfoListByTag(tagArr[i]);
			if (shopList.length > 0) {
				for (let iShop = 0 ; iShop < shopList.length ; ++iShop) {
					if (this.IsShopInfoExist(arr , shopList[iShop]) == false ) {
						arr.push(shopList[iShop]);
					}
				}
			}
		}
		return arr ; 
	}

	public GetShopInfo(key: number): StoreShopInfo {
		for (let i = 0 ;i < this.mShopInfoList.length ; ++i ) {
			if (key == this.mShopInfoList[i].key) {
				return this.mShopInfoList[i];
			}
		}
		return null ; 
	}

	public GetShopInfoByName(name:string ): StoreShopInfo {
		for (let i = 0 ;i < this.mShopInfoList.length ; ++i ) {
			if (name == this.mShopInfoList[i].name) {
				return this.mShopInfoList[i];
			}
		}
		return null ; 
	}

	public IsShopNameExist(name: string ): boolean {
		let shopInfo: StoreShopInfo = this.GetShopInfoByName(name);
		return shopInfo ? true : false ; 
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
		//parse tag hash ;
		this.mShopHash = asLocalStorage.getInstance().getKeyInt(StoreInfoLocalHelper.keyShopHash);
		this.mShopHash = this.mShopHash ? this.mShopHash : 0 ;

		this.mShopInfoList = [];
		this.mMaxShopNum = asLocalStorage.getInstance().getKeyInt(StoreInfoLocalHelper.KeyMaxShopNum);
		this.mMaxShopNum = this.mMaxShopNum ? this.mMaxShopNum : 0 ; 

		for (let i = 0 ; i < this.mShopHash; ++i) {
			let dataStr: string = asLocalStorage.getInstance().getKeyString(StoreInfoLocalHelper.KeyStoreShop + i);
			if(dataStr && dataStr.length>0) {
				let dataArray: Array<string> = dataStr.split(",");

				let tagArray: Array<number> = [] ;
				let strTagArray: Array<string> = dataArray[2].split("&");
				for (let i = 0 ; i < strTagArray.length ; ++i) {
					tagArray.push(parseInt(strTagArray[i]) );
				}

				let node: StoreShopInfo =  
				{
					key: parseInt(dataArray[0]),
					name: dataArray[1], 
					tagArray: tagArray
				} ;
				this.mShopInfoList.push(node);

				egret.log("~~~~ from local data  " ,node);
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

			++this.mShopHash;
			asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.keyShopHash , this.mShopHash);
		}
	}


	//商店信息，存储本地，用","区分字段，用"&"区分商店所属tag
	// "key,name,1&2&3&4 "
	private generateShopStr(node: StoreShopInfo): string {
		let str: string = "" ;
		str += node.key + ',';
		str += node.name + ',';

		let strTag = "";
		for (let i = 0 ; i < node.tagArray.length ; ++i) {
			strTag += node.tagArray[i];
			if (i != node.tagArray.length - 1) {
				strTag += "&";
			}
		}
		str += strTag ;

		egret.log("~~~~~~~  generateShopStr : " ,str);
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
		let isFind: boolean = false ; 
		for (let i = 0 ;i < this.mShopInfoList.length ; ++i ) {
			let shopNode: StoreShopInfo = this.mShopInfoList[i];
			if (shopNode.key == key) {
				this.mShopInfoList.splice(i , 1 );
				isFind = true ;
				break;
			}
		}

		if (isFind) {
			asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreShop + key, "");

			--this.mMaxShopNum;
			asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxShopNum , this.mMaxShopNum);
		}

	}

	public RemoveTagOfShop(shopKey: number , tag:number ): void {
		for (let i = 0 ;i < this.mShopInfoList.length ; ++i ) {
			let shopNode: StoreShopInfo = this.mShopInfoList[i];
			if (shopNode.key == shopKey) {
				for (let iTag = 0 ; iTag < shopNode.tagArray.length ; ++iTag) {
					if (tag == shopNode.tagArray[iTag]) {
						if (shopNode.tagArray.length > 1) {
							shopNode.tagArray.splice(iTag , 1);
							this.StoreSingleShopInfoToLocal(shopNode);
							return ;
						}
						else {
							GameTipsActionHelper.ScreenTip("商店不可以没有标签哦", 42, CONST_CONFIG.warningColor);
							return ;
						}
						
					}
				}
			}
		}
	}
	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	//<<<<<<<<<<<<<<<<<<<<<<
	public ParseTagInfoFromeLocal(): void {
		//parse tag hash ;
		this.mTagHash = asLocalStorage.getInstance().getKeyInt(StoreInfoLocalHelper.KeyTagHash);
		this.mTagHash = this.mTagHash ? this.mTagHash : 0 ;


		this.mTagInfoList = [];
		this.mMaxTagNum = asLocalStorage.getInstance().getKeyInt(StoreInfoLocalHelper.KeyMaxTagNum);
		this.mMaxTagNum = this.mMaxTagNum ? this.mMaxTagNum : 0 ; 
		for (let i = 0 ; i < this.mTagHash; ++i) {
			let dataStr: string = asLocalStorage.getInstance().getKeyString(StoreInfoLocalHelper.KeyStoreTag + i);
			if(dataStr && dataStr.length>0) {
				let dataArray: Array<string> = dataStr.split(",");

				let node: StoreTagInfo =  
				{
					tag: parseInt(dataArray[0]),
					img: dataArray[1], 
					name: dataArray[2]
				} ;
				this.mTagInfoList.push(node);
			}
		}

	
	}

	public StoreTagToLocal(tagInfo: StoreTagInfo): void {
		let str = this.generateTagStr(tagInfo);
		asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.KeyStoreTag + tagInfo.tag , str);

		if (!this.IsContainTag(tagInfo.tag)) {
			this.mTagInfoList.push(tagInfo);
			++this.mMaxTagNum;
			asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyMaxTagNum , this.mMaxTagNum);

			++this.mTagHash;
			asLocalStorage.getInstance().setKeyNumber(StoreInfoLocalHelper.KeyTagHash , this.mTagHash);
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
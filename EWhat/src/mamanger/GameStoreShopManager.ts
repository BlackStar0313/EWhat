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

enum DB_SHOP_PARAM_ID {
	id = 0 , 
	name ,
	tagArr 
}

enum DB_TAG_PARAM_ID {
	id = 0 ,
	name ,
	img 
}

class GameStoreShopInfoManager {
	private mShopInfoList: Array <StoreShopInfo> = [] ; 
	private mTagInfoList: Array<StoreTagInfo> = [] ; 

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

	public GetTagHash(): number { return this.getMaxIdFromeTable("tag"); }
	public GetShopHash(): number { return this.getMaxIdFromeTable("shop"); }

	private getMaxIdFromeTable(tableName: string) {
		let idx: number = 1 ;
		let str: string = "SELECT MAX(id) FROM %s".format(tableName);
		let shopInfoArray = SqlLite.exec(str);

		if (shopInfoArray && shopInfoArray.length > 0) {
			let data: Array<any> = shopInfoArray[0].values ;
			idx = data[0][0] + 1;
		}
		return idx; 
	}

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

	public InitData(): void {
		GameSqliteHelper.GetInstance().InitDb();
		this.DumpAllShopInfo();
		this.DumpAllTagInfo();
	}

	private DumpAllShopInfo(): void {
		SqlLite.exec("CREATE TABLE IF NOT EXISTS shop( id integer,name text,tagArry text);");
		
		let shopInfoArray: any = SqlLite.exec("SELECT * FROM shop;");
		if (shopInfoArray && shopInfoArray.length > 0) {
			let data: Array<any> = shopInfoArray[0].values ;
			for (let i = 0 ; i < data.length ; ++i) {
				let tagArray: Array<number> = [] ;
				let strTagArray: Array<string> = data[i][2].split(",");
				for (let i = 0 ; i < strTagArray.length ; ++i) {
					tagArray.push(parseInt(strTagArray[i]) );
				}

				let node: StoreShopInfo =  
				{
					key: parseInt(data[i][0]),
					name: data[i][1], 
					tagArray: tagArray
				} ;
				this.mShopInfoList.push(node);

				egret.log("~~~~ from local data  " ,node);
			}
		}
	}

	private DumpAllTagInfo(): void {
		SqlLite.exec("CREATE TABLE IF NOT EXISTS tag( id integer,name text,img text);");
		
		let tagInfoArray: any = SqlLite.exec("SELECT * FROM tag;");
		if (tagInfoArray && tagInfoArray.length > 0) {
			let data: Array<any> = tagInfoArray[0].values ;
			for (let i = 0 ; i < data.length ; ++i) {
				let node: StoreTagInfo =  
				{
					tag: parseInt(data[i][0]),
					name: data[i][1], 
					img: data[i][2]
				} ;
				this.mTagInfoList.push(node);
			}
		}
	}

	public StoreSingleShopInfoToLocal(node: StoreShopInfo): void {
		if (this.IsInfoExistDb("shop" , node.key) == false) {
			let arrStr = this.generateShopTagArrStr(node.tagArray);
			let str: string = "INSERT INTO shop VALUES (%d,'%s','%s');".format(node.key, node.name , arrStr);
			SqlLite.exec(str);
			GameSqliteHelper.GetInstance().StoreDb();
			this.mShopInfoList.push(node);
		}
	}

	public StoreTagToLocal(tagInfo: StoreTagInfo): void {
		if (this.IsInfoExistDb("tag" , tagInfo.tag) == false) {
			let str: string = "INSERT INTO tag VALUES (%d,'%s','%s');".format(tagInfo.tag, tagInfo.name , tagInfo.img);
			SqlLite.exec(str);
			GameSqliteHelper.GetInstance().StoreDb();
			this.mTagInfoList.push(tagInfo);
		}
	}

	public RemoveShop(key: number ): void {
		let str: string = "DELETE FROM shop where id = %d;".format(key);
		SqlLite.exec(str);
		GameSqliteHelper.GetInstance().StoreDb();
	}

	public RemoveTag(tag: number ): void {
		let str: string = "DELETE FROM tag where id = %d;".format(tag);
		SqlLite.exec(str);
		GameSqliteHelper.GetInstance().StoreDb();
	}

	public updateShopTagInfo(shopNode: StoreShopInfo): void {
		let arrStr = this.generateShopTagArrStr(shopNode.tagArray);
		let str: string = "UPDATE shop SET tagArry = '%s' where id = %d ;".format(arrStr , shopNode.key);
		SqlLite.exec(str);
		GameSqliteHelper.GetInstance().StoreDb();
	}

	public updateShopName(shopNode: StoreShopInfo): void {
		let str: string = "UPDATE shop SET name = '%s' where id = %d ;".format(shopNode.name , shopNode.key);
		SqlLite.exec(str);
		GameSqliteHelper.GetInstance().StoreDb();
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
							this.updateShopTagInfo(shopNode);
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

	private generateShopTagArrStr(tagArr: Array<number>): string {
		let strArr: string = "";
		for (let i = 0 ; i < tagArr.length ; ++i) {
			strArr += tagArr[i] ; 
			if (i != tagArr.length-1) {
				strArr += ",";
			}
		}
		return strArr;
	}


	private IsInfoExistDb(tableName: string , id: number): boolean {
		let execStr: string = "SELECT * FROM %s WHERE id = %d;".format(tableName , id) ; 
		let shopInfoArray: Uint8Array = SqlLite.exec(execStr);
		if (shopInfoArray && shopInfoArray.length > 0) {
			return true ;
		}
		return false ;
	}

	public ClearAllShopInfoFromLocal():void {
		SqlLite.exec("DROP TABLE shop;");
		this.DumpAllShopInfo();
		GameSqliteHelper.GetInstance().StoreDb();
	}

	public ClearAllTagInfoFromLocal():void {
		SqlLite.exec("DROP TABLE tag;");
		this.DumpAllTagInfo();
		GameSqliteHelper.GetInstance().StoreDb();
	}

	public ClearAll(): void {
		this.ClearAllShopInfoFromLocal();
		this.ClearAllTagInfoFromLocal();
	}
}
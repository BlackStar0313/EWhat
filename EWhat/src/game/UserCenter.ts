class UserCenter {
	public static m_pThis: UserCenter = null ; 
	public constructor() {
	}

	public static getInstance(): UserCenter {
		if (UserCenter.m_pThis == null) {
			UserCenter.m_pThis = new UserCenter();
		}
		return UserCenter.m_pThis ; 
	}


	private m_isFirstTimeIn: boolean = true ; 

	public set isFirstTimeIn(v:boolean) { this.m_isFirstTimeIn = v; }
	public get isFirstTimeIn():boolean { return this.m_isFirstTimeIn;}


	public InitUser(): void {
		GameStoreShopInfoManager.GetInstance().ParseShopInfoFromeLocal();

		//test code 
		// let tagArray = [];
		// tagArray.push(1);
		// tagArray.push(3);
		// let node: StoreShopInfo =  { key: 0,
		// 			name: "一号店", 
		// 			tagArray: tagArray
		// 		} ;
		// GameStoreShopInfoManager.GetInstance().StoreSingleShopInfoToLocal(node);
		// let shopList = GameStoreShopInfoManager.GetInstance().GetShopInfoList();
		// for (let i = 0 ; i < shopList.length ; ++i) {
		// 	console.log(" key is " + shopList[i].key + " name is " + shopList[i].name );
		// }

		GameStoreShopInfoManager.GetInstance().RemoveShop(0);
	}
}
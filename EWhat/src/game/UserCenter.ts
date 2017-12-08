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
		//test code 
		// asLocalStorage.getInstance().clearAll();

		GameStoreShopInfoManager.GetInstance().InitData();
	}
}
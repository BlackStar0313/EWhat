class GameSqliteHelper {
    public static mInst: GameSqliteHelper = null ; 
	public constructor() {
	}

    public static GetInstance(): GameSqliteHelper {
        if (GameSqliteHelper.mInst == null) {
            GameSqliteHelper.mInst = new GameSqliteHelper();
        }
        return GameSqliteHelper.mInst;
    }

    public InitDb(): void {
        let dbInfo = null ;
        let dbStr: string = asLocalStorage.getInstance().getKeyString(StoreInfoLocalHelper.DB_SHOP);
        if (dbStr && dbStr != "") {
            let dbArray :Uint8Array = this.str2Arr(dbStr);
            SqlLite.openDb(dbArray);
        }
        else {
            SqlLite.createDb();
        }
    }

    public StoreDb(): void {
        let dbArr: Uint8Array = SqlLite.exportDb();
        let str: string = this.buffer2str(dbArr.buffer);
        asLocalStorage.getInstance().setKeyString(StoreInfoLocalHelper.DB_SHOP, str);
    }

	/**ArrayBuffer转为字符串，
	 * @param 参数为ArrayBuffer对象
	 */
    public buffer2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    // 字符串转为Uint8Array对象
    public str2Arr(str) {
        let arr = [] ; 
        for (let i = 0 ; i < str.length ; ++i) {
            arr.push(str.charCodeAt(i));
        }
        let dbArray :Uint8Array = new Uint8Array(arr);
        return dbArray;
    }
}
class ItemData {
	private _data:ItemDataInterface = null;
	public constructor() {}
	private _key:string;
	public set key(v:string) {
		this._key = v;
	}
	public get key():string {
		return this._key;
	}
	public set data(v:ItemDataInterface) {
		this._data = v;
	}
	public get data():ItemDataInterface {
		return this._data;
	}
}
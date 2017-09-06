// TypeScript file

/**
 * DataManager
 */
interface RawData {
    item: any 
};

class DataManager {
    private _dataItem:{[name:number]:ItemData} = {};


    public static _ins:DataManager = null;
    
    public static getInstance():DataManager {
        if (DataManager._ins == null) {
            DataManager._ins = new DataManager();
        }
        return DataManager._ins;
    }

    constructor() {
        this.init();
    }

    public GetItem(idx: number ): ItemData {
        return this._dataItem[idx] ;
    }

    public GetItems(): { [idx: number ]: ItemData } {
        return this._dataItem; 
    }

    private init():void
    {
        let data = RES.getRes("data_json");
        let rawData:RawData = data;

        
        this.loadItem(rawData.item);
    
        rawData = null;
        RES.destroyRes("data_json");
    }


    private loadItem(item: any) {
        let dict:{[idx:number]:ItemData} = {};
        for (let key in item) 
        {
            let Obj:ItemData = new ItemData();
            Obj.key = item[key].idx;
            Obj.data = item[key];
            dict[Obj.key] = Obj;
        }
        this._dataItem = dict;
    }

    public clearData(): void {
        DataManager._ins = null;
    }
}
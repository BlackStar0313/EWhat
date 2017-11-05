// TypeScript file

/**
 * DataManager
 */
interface RawData {
    item: any 
};

class DataManager {
    private _dataItem:{[name:number]:ItemData} = {};

	private c_maxGoodsNum: number = 4*5;  


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

    public GetRandShowItems(): { [idx: number ]: ItemData } {
        let goodsItems: Array<ItemData> = [] ; 
        for (let key in this._dataItem) {
            goodsItems.push(this._dataItem[key]) ; 
        } 
        
        let randItems: { [idx: number ]: ItemData } = {} ; 
        let num: number = 0 ; 
        for (let i = goodsItems.length ; goodsItems.length > 0 ; -- i ) {
            let rand: number = Math.floor(Math.random() * goodsItems.length) ;
            randItems[goodsItems[rand].key] = goodsItems[rand];
            goodsItems.splice(rand , 1);
            ++num;

            if (num >= this.c_maxGoodsNum) {
                break;
            }
        }
        
        goodsItems = []  ;

        return randItems;
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
// TypeScript file
class asLocalStorage {
    static instance:asLocalStorage = null;
    private _storage:{[name:string]:string} = {};
    private _enable:boolean = null;

    static getInstance():asLocalStorage {
        if (asLocalStorage.instance == null) {
            asLocalStorage.instance = new asLocalStorage();

            if(asLocalStorage.instance._enable == null) {
                try {
                    egret.localStorage.setItem('testaslocalstoragesupported', 'yesornot');
                    egret.localStorage.removeItem('testaslocalstoragesupported');
                    asLocalStorage.instance._enable = true;
                } catch (error) {
                    asLocalStorage.instance._enable = false;
                }
            }
        }
        return asLocalStorage.instance;
    }

    constructor() {
    }

    public isSupported():boolean {        
        return this._enable;
    }

    public setKeyNumber(key:string, value:number): void {
        if(this._enable) {
            egret.localStorage.setItem(key, value.toString());
        } else {
            this._storage[key] = ''+value;
        }
    }

    public setKeyString(key:string, value:string): void {
        if(this._enable) {
            egret.localStorage.setItem(key, value);
        } else {
            this._storage[key] = value;
        }
    }

    public getKeyInt(key:string): number {
        let value:string = null;
        if(this._enable) {
            value= egret.localStorage.getItem(key);
        } else {
            value = this._storage[key];
        }
        let result:number = parseInt(value);
        return result;
    }

    public getKeyFloat(key:string): number {
        let value:string = null;
        if(this._enable) {
            value= egret.localStorage.getItem(key);
        } else {
            value = this._storage[key];
        }
        let result:number = parseFloat(value);
        return result;
    }

    public getKeyString(key:string): string {
        let result:string = null;
        if(this._enable) {
            result= egret.localStorage.getItem(key);
        } else {
            result = this._storage[key];
        }
        return result;
    }

    public deleteKey(key:string): void {
        if(this._enable) {
            egret.localStorage.removeItem(key);
        } else {
            this._storage[key] = undefined;
        }
    }

    public clearAll():void {
        if(this._enable) {
            egret.localStorage.clear();
        } else {
            this._storage = {};
        }
    }
}
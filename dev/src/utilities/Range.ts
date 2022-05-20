export class Range<T>{
    private _min: T;
    private _max: T;

    constructor(min: T, max: T){
        this._min= min;
        this._max= max;
    }
    public get min(): T {
        return this._min;
    }
    public set min(value: T) {
        this._min = value;
    }
    public get max(): T {
        return this._max;
    }
    public set max(value: T) {
        this._max = value;
    }
}

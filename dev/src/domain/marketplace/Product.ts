import {ProductCategory, ProductRate} from "../../utilities/Enums";


export class Product {

    private _id: number;
    private _name: string;
    private _shopId: number;
    private _category: ProductCategory;
    private _rate: ProductRate;
    private _description: string;



    constructor(name: string, shopId: number, id: number, category: ProductCategory, fullPrice: number, description?: string){
        this._id= id;
        this._name= name;
        this._shopId= shopId;
        this._category= category;
        this._rate= ProductRate.NotRated
        if(description){
            this._description = description;
        }
        else
            this._description="";
        this._fullPrice= fullPrice;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get shopId(): number {
        return this._shopId;
    }
    public set shopId(value: number) {
        this._shopId = value;
    }

    public get category(): ProductCategory {
        return this._category;
    }
    public set category(value: ProductCategory) {
        this._category = value;
    }

    public get rate(): ProductRate {
        return this._rate;
    }
    public set rate(value: ProductRate) {
        this._rate = value;
    }

    public get description(): string {
        return <string>this._description;
    }
    public set description(value: string) {
        this._description = value;
    }

    private _fullPrice: number;
    public get fullPrice(): number {
        return this._fullPrice;
    }
    public set fullPrice(value: number) {
        this._fullPrice = value;
    }



}
import {Sale} from "./Sale";
import {ProductCategory, ProductRate} from "../../utilities/Enums";

let productsCounter= 0;

export class Product {

    private _id: number;
    private _name: string;
    private _shopId: number;
    private _category: ProductCategory;
    private _rate: ProductRate;
    private _description: string;
    private _discountPrice: number;
    private _relatedSale?: Sale;



    constructor(name: string, shopId: number, category: ProductCategory, fullPrice: number, discountPrice: number, relatedSale?: Sale, description?: string){
        this._id= productsCounter;
        productsCounter++;
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
        this._discountPrice= discountPrice;
        this._relatedSale = relatedSale;
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

    public get discountPrice(): number {
        return this._discountPrice;
    }
    public set discountPrice(value: number) {
        this._discountPrice = value;
    }

    get relatedSale(): Sale | undefined {
        return this._relatedSale;
    }

    set relatedSale(value: Sale | undefined) {
        this._relatedSale = value;
    }


}
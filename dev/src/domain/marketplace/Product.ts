import {Sale} from "./Sale";
import { Shop } from "./Shop";

export class Product {
    private _id: number;  
    private _name: string;
    private _shopId: number;
    private _description: string;
    private _discountPrice: number;
    private _relatedSale: Sale;

    
    constructor(id: number, name: string, shopId: number, description: string, fullPrice: number, discountPrice: number, relatedSale: Sale){
        this.id= id;
        this.name= name;
        this.shopId = shopId;
        this.description = description;
        this.fullPrice= fullPrice;
        this.discountPrice= discountPrice;
        this.relatedSale = relatedSale;
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

    public get description(): string {
        return this._description;
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

    public get relatedSale(): Sale {
        return this._relatedSale;
    }
    public set relatedSale(value: Sale) {
        this._relatedSale = value;
    }

}
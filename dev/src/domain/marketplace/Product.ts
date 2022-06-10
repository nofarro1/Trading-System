import {ProductCategory, ProductRate} from "../../utilities/Enums";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";

let productsCounter = 0;

@Entity()
export class Product extends BaseEntity {
    @PrimaryColumn({type: "int"})
    private _id: number;
    @Column({type: "text"})
    private _name: string;
    @Column({type: "int"}) //TODO - Foreign Key constraint (Many To One)
    private _shopId: number;
    @Column({type: "enum", enum: ProductCategory})
    private _category: ProductCategory;
    @Column({type: "enum", enum: ProductRate})
    private _rate: ProductRate;
    @Column({type: "text"})
    private _description: string;

    constructor(name: string, shopId: number, id: number, category: ProductCategory, fullPrice: number, description?: string) {
        super();
        this._id = productsCounter;
        this._name = name;
        this._shopId = shopId;
        this._category = category;
        this._rate = ProductRate.NotRated
        if (description) {
            this._description = description;
        } else
            this._description = "";
        this._fullPrice = fullPrice;
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
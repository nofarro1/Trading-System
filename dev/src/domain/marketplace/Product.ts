import {Entity} from "../../utilities/Entity";
import prisma from "../../utilities/PrismaClient";
import {ProductCategory, ProductRate} from "../../utilities/Enums";


export class Product implements Entity{

    private _id: number;
    private _name: string;
    private _shopId: number;
    private _category: ProductCategory;
    private _rate: ProductRate;
    private _description: string;
    private _fullPrice: number;


    constructor(name: string, shopId: number, id: number, category: ProductCategory, fullPrice: number, description: string = ""){
        this._id= id;
        this._name= name;
        this._shopId= shopId;
        this._category= category;
        this._rate= ProductRate['NotRated'];
        this._description = description;
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

    public get fullPrice(): number {
        return this._fullPrice;
    }
    public set fullPrice(value: number) {
        this._fullPrice = value;
    }

    async save(quantity: number) {
        await prisma.product.create({
            data: {
                id: this.id,
                name: this.name,
                shopId: this.shopId,
                price: this.fullPrice,
                category: this.category,
                rate: this.rate,
                description: this.description,
            },
        });

        await prisma.productInShop.create({
            data: {
                shopId: this.shopId,
                productId: this.id,
                product_quantity: quantity,
            },
        });
    }

    async update(name: string = this.name, shopId: number = this.shopId, category: ProductCategory = this.category, rate: ProductRate = this.rate, description: string = this.description) {
        await prisma.product.update({
            where: {id_shopId: {id: this.id, shopId}},
            data: {
                name: name,
                shopId: shopId,
                category: category,
                rate: rate,
                description: description,
            },
        });
    }

    async updateProductInShop(quantity: number) {
        await prisma.productInShop.update({
            where: {
                shopId_productId: {
                    shopId: this.shopId,
                    productId: this.id,
                }
            },
            data: {
                product_quantity: quantity,
            }
        });
    }

    static async findById(id: number, shopId: number): Promise<Product | undefined> {
        let p: Product | undefined;
        let dalP = await prisma.product.findUnique({
            where: { id_shopId: {id, shopId}}
        });
            return new Product(dalP.name, dalP.shopId, dalP.id, dalP.category, dalP.price, dalP.description);

    }

    findProductInShop(shopId: number) {
        return prisma.productInShop.findUnique({
            where: {
                shopId_productId: {
                    shopId: shopId,
                    productId: this.id,
                }
            }
        });
    }

    async delete() {
        await prisma.product.delete({
            where: {id_shopId: {id: this.id, shopId: this._shopId}},
        });
    }
}
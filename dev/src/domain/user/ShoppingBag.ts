import { Product } from "../marketplace/Product";
import {Entity} from "../../utilities/Entity";
import prisma from "../../utilities/PrismaClient";

const compProducts = (p1: Product, p2: Product)=>  p1.fullPrice - p2.fullPrice;

export class ShoppingBag implements Entity{
    private _shopId: number;
    private _products: Map<number, [Product, number]>; //ProductID -> [Product, Quantity]
    private _totalPrice: number;

    constructor(shopId: number){
        this._shopId= shopId;
        this._products= new Map<number, [Product, number]>();
        this._totalPrice= 0;
    }

    public get shopId(): number {
        return this._shopId;
    }
    public set shopId(value: number) {
        this._shopId = value;
    }

    public get products(): Map<number, [Product, number]> {
        return this._products;
    }
    public set products(value: Map<number, [Product, number]>) {
        this._products = value;
    }

    public get totalPrice(): number {
        return this._totalPrice;
    }
    public set totalPrice(value: number) {
        this._totalPrice = value;
    }

    addProduct(toAdd:Product, quantity: number): void {
        let productPair = this.products.get(toAdd.id);
        if (productPair) {
            let updateQuantity = productPair[1] + quantity;
            this.products.set(toAdd.id, [toAdd, updateQuantity]);

        }
        else
            this.products.set(toAdd.id, [toAdd, quantity]);
            toAdd.save(quantity);
        }

    removeProduct(toRemove: Product):void {
        if(!this.products.has(toRemove.id))
            throw new Error("Failed to remove product because the product wasn't found in bag.")
        let pTuple= this.products.get(toRemove.id);
        this.products.delete(toRemove.id);
    }

    updateProductQuantity(toUpdate: Product, quantity: number): void {
        if(!this.products.has(toUpdate.id))
            throw new Error("Failed to update product because the product wasn't found in bag.")
        this.products.set(toUpdate.id, [toUpdate, quantity]);
    }

    emptyBag(): void{
        this.products.clear;
        // this.totalPrice = 0;
    }

    isEmpty(): boolean {
        return this.products.size == 0;
    }

    static async findById(username:string, shopId:number) {
        const result = await prisma.shoppingBag.findUnique({
            where: {
                username_shopId: {
                    username: username,
                    shopId: shopId
                },
            }
        })
        let products = await this.findAllBagProducts(username, shopId);
        let bag =  new ShoppingBag(shopId);
        bag.products = products;
        return bag;
    }

    static async findAllBagProducts(member: string, shopId: number): Promise<Map<number, [Product, number]>> {
        let products = await prisma.productInBag.findMany({
            where: {username: member, shopId: shopId},
        });
        let productsMap = new Map<number, [Product, number]>()
        for(let dalP of products){
            let p = await Product.findById(dalP.productId, dalP.shopId)
            if(p)
                productsMap.set(dalP.productId,[p, dalP.product_quantity])
        }
        return productsMap;
    }

    static async findProductInBag(username:string, shopId:number,product:number) {
        const result = await prisma.productInBag.findUnique({
            where: {
                username_shopId_productId:{
                    username:username,
                    shopId:shopId,
                    productId:product
                }
            }
        })
        return result;
    }

    async save(username: string) {
        await prisma.shoppingBag.create({
            data: {
                username: username,
                shopId: this.shopId,
            },
        });
    }

    async saveProductInBag(username: string, productId: number, quantity: number) {
        await prisma.productInBag.create({
            data: {
                username: username,
                shopId: this.shopId,
                productId: productId,
                product_quantity: quantity,
            },
        });
    }

    async update(username: string, productId: number, quantity: number) {
        await prisma.productInBag.update({
            where: {
                username_shopId_productId: {
                    username: username,
                    shopId: this.shopId,
                    productId: productId,
                }
            },
            data: {
                product_quantity: quantity,
            }
        })
    }

    async delete(username:string) {
        await prisma.shoppingBag.delete({
            where:{
            username_shopId: {
                username: username,
                shopId: this.shopId
            }
        }});
        for(let pid of this.products.keys()){
            await this.deleteProductInBag(username,pid);
        }
    }

    async deleteProductInBag(username: string, productId: number) {
        await prisma.productInBag.delete({
            where: {
                username_shopId_productId: {
                    username: username,
                    shopId: this.shopId,
                    productId:productId
                },
            },
        });
    }
}
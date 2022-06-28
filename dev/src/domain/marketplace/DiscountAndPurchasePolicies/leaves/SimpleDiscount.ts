import {DiscountComponent} from "../Components/DiscountComponent";
import {DiscountKinds, DiscountType, ProductCategory} from "../../../../utilities/Enums";
import {Product} from "../../Product";
import {discountInf} from "../../../../utilities/Types";
import prisma from "../../../../utilities/PrismaClient";
import {DiscountData, SimpleDiscountData} from "../../../../utilities/DataObjects";
import prismaClient from "../../../../utilities/PrismaClient";



export class SimpleDiscount implements DiscountComponent{
    private _id: number;
    private info: discountInf;
    private discountPercent: number;
    private _description: string;

    constructor(id: number, discountInf: discountInf, discountPercent: number) {
        this._id = id;
        this.info = discountInf;
        this.discountPercent = discountPercent;
        let idMSG: string;
        switch (this.info.type) {
            case DiscountType.Product: {
                idMSG = `on products with id: ${this.info.object}`;
                break;
            }
            case DiscountType.Category: {
                idMSG = `on products from ${this.info.object}`;
                break;
            }
            case DiscountType.Bag: {
                idMSG = `on all products in the shop`;
                break;
            }
        }

        this._description = `Simple discount of ${this.discountPercent}% ${idMSG}.`
    }

    get id(): number {
        return this._id;
    }


    get description(): string {
        return this._description;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        let discProductsPrice: [Product, number, number][] = [];

        if (this.info.type === DiscountType.Product) {
            let pInDisc = this.info.object;
            for (let [p, price, quantity] of products) {
                if (p.id === pInDisc) {
                    discProductsPrice.push([p, price-(p.fullPrice* 0.01 * this.discountPercent), quantity]);
                } else
                    discProductsPrice.push([p, price, quantity]);
            }
        }
        else if (this.info.type === DiscountType.Category) {
            let cInDisc = this.info.object;
            for (let [p, price, quantity] of products) {
                if (p.category == cInDisc) {
                    discProductsPrice.push([p, price-(p.fullPrice* 0.01 * this.discountPercent), quantity]);
                } else
                    discProductsPrice.push([p, price, quantity]);
            }
        }
        else
            for (let [p, price, quantity] of products) {
                discProductsPrice.push([p, price-(p.fullPrice* 0.01 * this.discountPercent), quantity]);


            }
        return discProductsPrice;
    }

    predicate(products: [Product, number, number][]): boolean {
        return true;
    }
   async save(shopId: number, isContained: boolean, containingId?: number) {
        if(!isContained){
            await prisma.discount.create({
                data:{
                    id: this.id,
                    shopId: shopId,
                    kind: DiscountKinds.SimpleContainer
                },
            });
        }
        const type: number | "A" | "B" | "C" = this.info.object
        if(typeof type === "number"){
            await prisma.simpleDiscount.create({
                data:{
                    id: this.id,
                    shopId: shopId,
                    discountType: this.info.type,
                    discountPercent: this.discountPercent,
                    description: this.description,
                    productId: type
                }
            })
        }

        else if(typeof type === typeof ProductCategory){
            await prisma.simpleDiscount.create({
                data:{
                    id: this.id,
                    shopId: shopId,
                    discountType: this.info.type,
                    discountPercent: this.discountPercent,
                    description: this.description,
                    category: type
                }
            })
        }
        else {
            await prisma.simpleDiscount.create({
                data:{
                    id: this.id,
                    shopId: shopId,
                    discountType: this.info.type,
                    discountPercent: this.discountPercent,
                    description: this.description,

                }
            })
        }

        if(isContained){
            await prisma.discountInContainer.create(({
                data:{
                    containedDiscount: containingId,
                    containingDiscount: this.id,
                    shopId: shopId,
                    kind: DiscountKinds.SimpleDiscount
                }
            }))
        }

    }

    static async saveForConditional(toSave: SimpleDiscount, shopId: number) {
        const type: number | "A" | "B" | "C" = toSave.info.object
        if(typeof type === "number"){
            await prisma.simpleDiscount.create({
                data:{
                    id: toSave.id,
                    shopId: shopId,
                    discountType: toSave.info.type,
                    discountPercent: toSave.discountPercent,
                    description: toSave.description,
                    productId: type
                }
            })
        }

        else if(typeof type === typeof ProductCategory){
            await prisma.simpleDiscount.create({
                data:{
                    id: toSave.id,
                    shopId: shopId,
                    discountType: toSave.info.type,
                    discountPercent: toSave.discountPercent,
                    description: toSave.description,
                    category: type
                }
            })
        }
        else {
            await prisma.simpleDiscount.create({
                data:{
                    id: toSave.id,
                    shopId: shopId,
                    discountType: toSave.info.type,
                    discountPercent: toSave.discountPercent,
                    description: toSave.description,

                }
            })
        }
    }


    static async findById(id: number, shopId: number) : Promise<SimpleDiscount>{
        let simpDisc = await prisma.simpleDiscount.findUnique({
            where: {id_shopId: {id: id, shopId: shopId} }
        })
        const type: number | "A" | "B" | "C" = simpDisc.category
        if(typeof type === "number")
            return new SimpleDiscount(id, {type: simpDisc.discountType, object:simpDisc.productId}, simpDisc.discountPercent);
        else if(typeof type === typeof ProductCategory)
            return new SimpleDiscount(id, {type: simpDisc.discountType, object:simpDisc.category}, simpDisc.discountPercent);
        else
            return new SimpleDiscount(id, {type: simpDisc.discountType, object:undefined}, simpDisc.discountPercent);
    }

    async delete(shopId: number){
        await prisma.simpleDiscount.delete({
            where:{id_shopId:{id: this.id, shopId: shopId}}
        })
    }

    async update(shopId: number) {
        await prisma.simpleDiscount.update({
            where: {id_shopId: {id: this.id, shopId: shopId}},
            data: {description: this._description},
        });
    }
}
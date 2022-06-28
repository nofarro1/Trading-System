import {DiscountComponent} from "../../Components/DiscountComponent";
import {Product} from "../../../Product";
import {DiscountData} from "../../../../../utilities/DataObjects";
import {Entity} from "../../../../../utilities/Entity";
import {Discount, DiscountContainer, DiscountInContainer} from "../../../../../../prisma/prisma";
import prisma from "../../../../../utilities/PrismaClient";
import {Shop} from "../../../Shop";
import {DiscountKinds, DiscountRelation} from "../../../../../utilities/Enums";
import {SimpleDiscount} from "../../leaves/SimpleDiscount";
import {ConditionalDiscount} from "../../leaves/ConditionalDiscount";
import {AndDiscounts} from "./LogicCompositions/AndDiscounts";
import {OrDiscounts} from "./LogicCompositions/OrDiscounts";
import {XorDiscounts} from "./LogicCompositions/XorDiscounts";
import {AdditionDiscounts} from "./NumericConditions/AdditionDiscounts";
import {MaxDiscounts} from "./NumericConditions/MaxDiscounts";

export abstract class ContainerDiscountComponent implements DiscountComponent{
    protected _id: number;
    protected _description: string;
    protected _discounts: DiscountComponent[];

    constructor(id: number, discounts: DiscountComponent[]) {
        this._id = id;
        this._discounts = discounts;
    }
    get discounts(): DiscountComponent[] {
        return this._discounts;
    }

    abstract predicate(products: [Product, number, number][]): boolean ;

    abstract calculateProductsPrice(Products: [Product, number, number][]): [Product, number, number][];

    abstract get id(): number;

    abstract get description(): string;

    addDiscountElement(toAdd: DiscountComponent){

        this.discounts.push(toAdd);
    }
    removeDiscountElement(toRemove: DiscountComponent){
        let i = this.discounts.indexOf(toRemove);
        this.discounts.splice(i, 1);
    }

    static async findById(containingDiscount: number, shopId: number): Promise<ContainerDiscountComponent> {
        let dalDisc: DiscountContainer = await prisma.discountContainer.findUnique({
            where: {id_shopId: {id: containingDiscount, shopId: shopId}},
        });
        let subDalDiscs: DiscountInContainer[] = await prisma.discountInContainer.findMany({
            where: {containingDiscount: containingDiscount, shopId: shopId},
        });

        let subCompDiscs: Promise<DiscountComponent>[] = subDalDiscs.map((currDisc:DiscountInContainer): Promise<DiscountComponent>=>{return this.dalDisc2Component(currDisc, shopId)})
        if(dalDisc.type === DiscountRelation.And){
            return new AndDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
        if (dalDisc.type === DiscountRelation.Or){
            return new OrDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
        if (dalDisc.type === DiscountRelation.Xor){
            return new XorDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
        if (dalDisc.type === DiscountRelation.Addition){
            return new AdditionDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
        if (dalDisc.type === DiscountRelation.Max){
            return new MaxDiscounts(containingDiscount, await Promise.all(subCompDiscs))
        }
    }
    static  dalDisc2Component(dalDisc: DiscountInContainer, shopId: number): Promise<DiscountComponent>{
        let type = dalDisc.kind;
        if(type === DiscountKinds.SimpleDiscount)
            return SimpleDiscount.findById(dalDisc.containedDiscount);
        if(type === DiscountKinds.ConditionalDiscount)
            return ConditionalDiscount.findById(dalDisc.containedDiscount);
        if(type === DiscountKinds.ContainerDiscount)
            return this.findById(dalDisc.containingDiscount, shopId);
    }

    delete(...params: any) {
    }

    save(...params: any) {
    }

    update(...params: any) {
    }

    static findSubDisc(shopId: number) {
        return [];
    }
}
import {DiscountComponent} from "../../../Components/DiscountComponent";
import {Product} from "../../../../Product";
import {ContainerDiscountComponent} from "../ContainerDiscountComponent";
import {Entity} from "../../../../../../utilities/Entity";
import prisma from "../../../../../../utilities/PrismaClient";
import {DiscountRelation} from "../../../../../../utilities/Enums";
import {
    DiscountData,
    isConditionalDiscount,
    isContainerDiscount,
    isSimpleDiscount
} from "../../../../../../utilities/DataObjects";
import {SimpleDiscount} from "../../../leaves/SimpleDiscount";
import {PredicateDiscountPolicy} from "../../../Predicates/PredicateDiscountPolicy";
import {ConditionalDiscount} from "../../../leaves/ConditionalDiscount";
import {OrDiscounts} from "./OrDiscounts";
import {XorDiscounts} from "./XorDiscounts";
import {AdditionDiscounts} from "../NumericConditions/AdditionDiscounts";
import {MaxDiscounts} from "../NumericConditions/MaxDiscounts";
import {DiscountInContainer} from "../../../../../../../prisma/prisma";


export class AndDiscounts extends ContainerDiscountComponent implements Entity{

     constructor(id: number, discounts: DiscountComponent[]) {
         super(id, discounts);
         this._description = this.discounts.reduce((acc:string, curr:DiscountComponent)=>{return acc+"\n"+ curr.description}, `There is eligibility for each of the discounts described below provided that all conditions are met. Discounts:`)
     }
    get id(): number {
        return this._id;
    }


    get description(): string {
        return this._description;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
         let discCallBack = (acc:[Product, number, number][], dcCurr: DiscountComponent)=> dcCurr.calculateProductsPrice(acc);
            return this.discounts.reduce(discCallBack,products);
    }

    override addDiscountElement(toAdd: DiscountComponent){
        this.discounts.push(toAdd);
    }
    override removeDiscountElement(toRemove: DiscountComponent){
        let i = this.discounts.indexOf(toRemove);
        this.discounts.splice(i, 1);
    }

    predicate(products: [Product, number, number][]): boolean {
        let predCallbak = (acc:boolean, dc:DiscountComponent) => acc && dc.predicate(products);
        return this.discounts.reduce(predCallbak, true);
    }

    // async save(shopId: number) {
    //     // await prisma.discount.create({
    //     //     data:{
    //     //         id: this.id,
    //     //         shopId: shopId,
    //     //     },
    //     // });
    //     //
    //     //  await prisma.discountContainer.create({
    //     //      data: {
    //     //          id: this.id,
    //     //          shopId: shopId,
    //     //          description: this.description,
    //     //          type: DiscountRelation.And,
    //     //      },
    //     //  });
    //     //
    //     //  for(let disc of this._discounts)
    //     //      disc.save(shopId);
    // }

    // async update(shopId: number) {
    //      await prisma.discountContainer.update({
    //          where: {id_shopId: {id: this.id, shopId: shopId}},
    //          data: {description: this._description},
    //      });
    // }

    // static async findById(id: number, shopId: number){
    //     let dalObj = await prisma.discountContainer.findUnique({
    //          where: {id_shopId: {id: id, shopId: shopId}}
    //      })
    //
    //     return new AndDiscounts(dalObj.id, this.findSubDisc(shopId))
    // }

    // async delete(shopId: number) {
    //      await prisma.discount.delete({
    //          where: {id_shopId: {id: this.id, shopId: shopId}},
    //      });
    // }


}
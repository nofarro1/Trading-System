import {DiscountComponent} from "../../../Components/DiscountComponent";
import {Product} from "../../../../Product";
import {ContainerDiscountComponent} from "../ContainerDiscountComponent";
import prisma from "../../../../../../utilities/PrismaClient";
import {DiscountRelation} from "../../../../../../utilities/Enums";

export class AdditionDiscounts extends ContainerDiscountComponent{

    constructor(id: number, discounts: DiscountComponent[]) {
        super(id, discounts);
        this._description = this.discounts.reduce((acc:string, curr:DiscountComponent)=>{return acc+"\n"+ curr.description}, `There is eligibility for each of the discounts described below. Discounts:`)
    }

    get id(): number {
        return this._id;
    }


    get description(): string {
        return this._description;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        let callBack = (acc:[Product, number, number][], dcCurr: DiscountComponent)=> dcCurr.calculateProductsPrice(acc);
        return this.discounts.reduce(callBack, products);
    }

    override addDiscountElement(toAdd: DiscountComponent){
        this.discounts.push(toAdd);
    }
    override removeDiscountElement(toRemove: DiscountComponent){
        let i = this.discounts.indexOf(toRemove);
        this.discounts.splice(i, 1);
    }

    predicate(products: [Product, number, number][]): boolean {
        return true;
    }

    // async save(shopId: number) {
    //     // await prisma.discount.create({
    //     //     data:{
    //     //         id: this.id,
    //     //         shopId: shopId,
    //     //     },
    //     // });
    //     //
    //     // await prisma.discountContainer.create({
    //     //     data: {
    //     //         id: this.id,
    //     //         shopId: shopId,
    //     //         description: this.description,
    //     //         type: DiscountRelation.Addition,
    //     //     },
    //     // });
    //     //
    //     // for(let disc of this._discounts)
    //     //     disc.save(shopId);
    // }

    // async update(shopId: number) {
    //     await prisma.discountContainer.update({
    //         where: {id_shopId: {id: this.id, shopId: shopId}},
    //         data: {description: this._description},
    //     });
    // }

    // async findById(shopId: number){
    //     await prisma.discountContainer.findUnique({
    //         where: {id_shopId: {id: this.id, shopId: shopId}}
    //     })
    // }

    // async delete(shopId: number) {
    //     await prisma.discount.delete({
    //         where: {id_shopId: {id: this.id, shopId: shopId}},
    //     });
    // }
}
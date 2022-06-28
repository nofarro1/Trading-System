import {DiscountComponent} from "../Components/DiscountComponent";
import {Product} from "../../Product";
import {SimpleDiscount} from "./SimpleDiscount";
import {PredicateDiscountPolicy} from "../Predicates/PredicateDiscountPolicy";
import prisma from "../../../../utilities/PrismaClient";
import {DiscountKinds} from "../../../../utilities/Enums";
import {Shop} from "../../Shop";


export class ConditionalDiscount implements DiscountComponent{
    private _id: number;
    private _discount: SimpleDiscount;
    private _pred: PredicateDiscountPolicy;


    get description(): string {
        return this._discount.description+" "+ this._pred.description;
    }

    get id(): number {
        return this._id;
    }

    get discount(): SimpleDiscount {
        return this._discount;
    }

    set discount(value: SimpleDiscount) {
        this._discount = value;
    }


    constructor(id: number, discount: SimpleDiscount, predicat: PredicateDiscountPolicy) {
        this._id= id;
        this._discount = discount;
        this._pred = predicat;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        if(this.predicate(products))
             return this._discount.calculateProductsPrice(products);
        else
            return products;
    }

    predicate(products: [Product, number, number][]): boolean {
        return this._pred.checkPredicate(products);
    }

    async save(shopId: number, isContained: boolean, containingId?: number){
        if(!isContained){
            await prisma.discount.create({
                data:{
                    id: this.id,
                    shopId: shopId,
                    kind: DiscountKinds.ConditionalContainer
                },
            });
        }
        let discId = SimpleDiscount.saveForConditional(this.discount, shopId);
        await prisma.conditionalDiscount.create({
            data:{
               id: this.id,
               shopId: shopId,
               simpleId: this._discount.id,
                simpleShopId: shopId
            }
        });
    }

    static async findById(id: number, shopId: number): Promise<ConditionalDiscount> {
        let cond: ConditionalDiscount;
        await prisma.conditionalDiscount.findUnique({
            where:{id_shopId: {id, shopId}}
        }).then(async (condDisc)=> {
            let pred = await PredicateDiscountPolicy.findById(condDisc.id, shopId)
            let simpDisc = await SimpleDiscount.findById(condDisc.simpleId, condDisc.simpleShopId)
            cond = new ConditionalDiscount(id,simpDisc,pred)
        })
        return cond;
    }

    async delete(id: number, shopId: number) {
        await prisma.conditionalDiscount.delete({
            where: {id_shopId: {id, shopId}}
        })
    }

    update(...params: any) {}
}
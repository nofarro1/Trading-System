import {DiscountComponent} from "../../../Components/DiscountComponent";
import {Product} from "../../../../Product";
import {ContainerDiscountComponent} from "../ContainerDiscountComponent";
import {Entity} from "../../../../../../utilities/Entity";
import prisma from "../../../../../../utilities/PrismaClient";


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


    addDiscountElement(toAdd: DiscountComponent){
        this.discounts.push(toAdd);
    }
    removeDiscountElement(toRemove: DiscountComponent){
        let i = this.discounts.indexOf(toRemove);
        this.discounts.splice(i, 1);
    }

    predicate(products: [Product, number, number][]): boolean {
        let predCallbak = (acc:boolean, dc:DiscountComponent) => acc && dc.predicate(products);
        return this.discounts.reduce(predCallbak, true);
    }

    async save(...params) {
         await prisma.discountContainer.create({
             data: {
                 id: this.id,
                 description: this.description,
             },
         });
        for(let disc of this._discounts){
            disc.save();
            saveInDiscountTable(disc.id, this.id);
        }
    }

    update() {
    }

    findById() {
    }

    delete() {
    }
}
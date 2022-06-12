import {ImmediatePurchasePolicyComponent} from "../../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../../user/ShoppingBag";
import {Answer} from "../../../../../utilities/Types";
import {Guest} from "../../../../user/Guest";
import {DiscountComponent} from "../../Components/DiscountComponent";

export class AndPolicy implements ImmediatePurchasePolicyComponent{
    private _id: number;
    private purchasePolicies: ImmediatePurchasePolicyComponent[];
    private _description: string;

    constructor(id: number, policies: ImmediatePurchasePolicyComponent[]) {
        this._id = id;
        this.purchasePolicies = policies;
        this._description = this.purchasePolicies.reduce((acc:string, curr:ImmediatePurchasePolicyComponent)=>{return acc+"\n"+ curr.description}, `The purchase can only be made if everything described below is met.`)
    }

    get id(): number {
        return this._id;
    }


    get description(): string {
        return this._description;
    }

    addPurchasePolicy (toAdd: ImmediatePurchasePolicyComponent){
        this.purchasePolicies.push(toAdd);
    }
    removePurchasePolicy (toRemove: ImmediatePurchasePolicyComponent){
        let ind = this.purchasePolicies.indexOf(toRemove);
        this.purchasePolicies.splice(ind, 1);
    }

    CanMakePurchase(purchaseInfo: [ShoppingBag, Guest]): Answer {
        let pred = (acc: Answer, currPolicy: ImmediatePurchasePolicyComponent): Answer => {
                let ans = currPolicy.CanMakePurchase(purchaseInfo);
                if(acc.ok && ans.ok){
                    return acc= {ok: acc.ok && ans.ok, message: acc.message};
                }
                else
                    return acc= {ok: acc.ok && ans.ok, message: acc.message+" and "+ ans.message};
        }
        let ans: Answer ={ok:true, message: "Couldn't make purchase because:\n"};
        return this.purchasePolicies.reduce(pred, ans);
    }


}
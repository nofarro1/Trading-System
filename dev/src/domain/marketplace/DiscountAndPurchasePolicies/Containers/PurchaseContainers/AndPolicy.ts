import {ImmediatePurchasePolicyComponent} from "../../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../../user/ShoppingBag";
import {Answer} from "../../../../../utilities/Types";
import {Guest} from "../../../../user/Guest";

export class AndPolicy implements ImmediatePurchasePolicyComponent{
    private _id: number;
    private purchasePolicies: ImmediatePurchasePolicyComponent[];

    constructor(id: number, policies: ImmediatePurchasePolicyComponent[]) {
        this._id = id;
        this.purchasePolicies = policies;
    }

    get id(): number {
        return this._id;
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
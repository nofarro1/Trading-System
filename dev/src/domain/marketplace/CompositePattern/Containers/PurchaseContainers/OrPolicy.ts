import {ImmediatePurchasePolicyComponent} from "../../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../ShoppingBag";
import {Product} from "../../../Product";
import {ProductCategory} from "../../../../../utilities/Enums";
import {User} from "../../../../user/User";
import {SimplePutrchase} from "../../leaves/SimplePutrchase";
import {Answer} from "../../../../../utilities/Types";

export class OrPolicy implements ImmediatePurchasePolicyComponent{
    private purchasePolicies: ImmediatePurchasePolicyComponent[];

    constructor() {
        this.purchasePolicies = [];
    }



    addPurchasePolicy (toAdd: ImmediatePurchasePolicyComponent){
        this.purchasePolicies.push(toAdd);
    }
    removePurchasePolicy (toRemove: ImmediatePurchasePolicyComponent){
        let ind = this.purchasePolicies.indexOf(toRemove);
        this.purchasePolicies.splice(ind, 1);
    }

    CanMakePurchase(object: Product | ProductCategory | ShoppingBag | User): Answer {
        let pred = (acc: Answer, currPolicy: ImmediatePurchasePolicyComponent): Answer => {
            let ans = currPolicy.CanMakePurchase(object);
            if (acc.ok || ans.ok) {
                return acc = {ok: acc.ok || ans.ok, message: acc.message};
            } else
                return acc = {ok: acc.ok || ans.ok, message: acc.message + " or " + ans.message};
        }
        let ans: Answer = {ok: true, message: "Couldn't make purchase because:\n"};
        return this.purchasePolicies.reduce(pred, ans);
    }
}
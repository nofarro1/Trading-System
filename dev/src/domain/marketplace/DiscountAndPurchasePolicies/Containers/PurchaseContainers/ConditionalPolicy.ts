import {ImmediatePurchasePolicyComponent} from "../../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../../user/ShoppingBag";
import {Answer} from "../../../../../utilities/Types";
import {Guest} from "../../../../user/Guest";

export class ConditioningPurchasePolicies implements ImmediatePurchasePolicyComponent{
   private _id: number;
    private dependent: ImmediatePurchasePolicyComponent;
    private dependentOn: ImmediatePurchasePolicyComponent;

    constructor(id: number, dependent: ImmediatePurchasePolicyComponent, dependentOn: ImmediatePurchasePolicyComponent) {
        this._id = id;
        this.dependent = dependent ;
        this.dependentOn = dependentOn;
    }

    get id(): number {
        return this._id;
    }

    CanMakePurchase(purchaseInfo: [ShoppingBag, Guest]): Answer {
        let ans = this.dependent.CanMakePurchase(purchaseInfo)
        return ans.ok ? this.dependentOn.CanMakePurchase(purchaseInfo) : ans;
    }
}
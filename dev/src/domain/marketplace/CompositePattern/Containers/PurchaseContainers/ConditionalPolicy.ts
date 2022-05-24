import {ImmediatePurchasePolicyComponent} from "../../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../../user/ShoppingBag";
import {Answer} from "../../../../../utilities/Types";
import {Guest} from "../../../../user/Guest";

export class ConditioningPurchasePolicies implements ImmediatePurchasePolicyComponent{
    private dependent: ImmediatePurchasePolicyComponent;
    private dependentOn: ImmediatePurchasePolicyComponent;

    constructor(dependent: ImmediatePurchasePolicyComponent, dependentOn: ImmediatePurchasePolicyComponent) {
        this.dependent = dependent ;
        this.dependentOn = dependentOn;
    }

    CanMakePurchase(purchaseInfo: [ShoppingBag, Guest]): Answer {
        let ans = this.dependent.CanMakePurchase(purchaseInfo)
        return ans.ok ? this.dependentOn.CanMakePurchase(purchaseInfo) : ans;
    }
}
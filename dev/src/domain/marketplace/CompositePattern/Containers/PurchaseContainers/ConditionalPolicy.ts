import {ImmediatePurchasePolicyComponent} from "../../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../ShoppingBag";
import {Answer} from "../../../../../utilities/Types";
import {Product} from "../../../Product";
import {ProductCategory} from "../../../../../utilities/Enums";
import {User} from "../../../../user/User";

export class ConditioningPurchasePolicies implements ImmediatePurchasePolicyComponent{
    private dependent: ImmediatePurchasePolicyComponent;
    private dependentOn: ImmediatePurchasePolicyComponent;

    constructor(dependent: ImmediatePurchasePolicyComponent, dependentOn: ImmediatePurchasePolicyComponent) {
        this.dependent = dependent ;
        this.dependentOn = dependentOn;
    }
    CanMakePurchase(object: Product | ProductCategory | ShoppingBag | User ): Answer {
        let ans = this.dependent.CanMakePurchase(object)
        return ans.ok ? this.dependentOn.CanMakePurchase(object) : ans;
    }
}
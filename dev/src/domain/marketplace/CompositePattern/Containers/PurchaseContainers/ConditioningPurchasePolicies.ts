import {PurchasePolicyComponent} from "../../Components/PurchasePolicyComponent";
import {ShoppingBag} from "../../../ShoppingBag";

export class ConditioningPurchasePolicies implements PurchasePolicyComponent{
    private purchasePolicies: PurchasePolicyComponent[];

    constructor() {
        this.purchasePolicies = [];
    }
    CanMakePurchase(bag: ShoppingBag): boolean {
        return false;
    }

    addPurchasePolicy (toAdd: PurchasePolicyComponent){}
    removePurchasePolicy (toRemove: PurchasePolicyComponent){}

}
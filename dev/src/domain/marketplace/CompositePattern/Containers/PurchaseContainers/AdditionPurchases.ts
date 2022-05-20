import {PurchasePolicyComponent} from "../../Components/PurchasePolicyComponent";
import {ShoppingBag} from "../../../ShoppingBag";

export class AdditionPurchases implements PurchasePolicyComponent{
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
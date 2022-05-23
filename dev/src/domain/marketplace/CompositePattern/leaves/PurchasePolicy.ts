import {PurchasePolicyComponent} from "../Components/PurchasePolicyComponent";
import {ShoppingBag} from "../../ShoppingBag";

export class PurchasePolicy implements PurchasePolicyComponent{
    CanMakePurchase(bag: ShoppingBag): boolean {
        return false;
    }
}
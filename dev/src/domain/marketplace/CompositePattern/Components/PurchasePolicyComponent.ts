import {ShoppingBag} from "../../ShoppingBag";

export interface PurchasePolicyComponent {
    CanMakePurchase(bag: ShoppingBag): boolean;
}
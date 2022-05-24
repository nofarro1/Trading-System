import {ShoppingBag} from "../../../user/ShoppingBag";
import {Answer} from "../../../../utilities/Types";
import {Guest} from "../../../user/Guest";


export interface ImmediatePurchasePolicyComponent {

    CanMakePurchase(purchaseInfo: [ShoppingBag, Guest]): Answer;
}
import {ShoppingBag} from "../../../user/ShoppingBag";
import {Answer} from "../../../../utilities/Types";
import {Guest} from "../../../user/Guest";


export interface ImmediatePurchasePolicyComponent {
    get id(): number ;
    get description(): string;
    CanMakePurchase(purchaseInfo: [ShoppingBag, Guest]): Answer;
}
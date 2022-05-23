import {ShoppingBag} from "../../ShoppingBag";
import {Product} from "../../Product";
import {ProductCategory, PolicyType, LogicalPolicy, SimplePolicyType} from "../../../../utilities/Enums";
import {UserInfo} from "os";
import {User} from "../../../user/User";
import {Answer} from "../../../../utilities/Types";

export interface ImmediatePurchasePolicyComponent {

    CanMakePurchase(object: Product | ProductCategory | ShoppingBag | User): Answer;
}
import {ImmediatePurchasePolicyComponent} from "../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../ShoppingBag";
import {ProductCategory, PolicyType, SimplePolicyType} from "../../../../utilities/Enums";
import {Product} from "../../Product";
import {User} from "../../../user/User";
import {Answer} from "../../../../utilities/Types";



export class SimplePutrchase implements ImmediatePurchasePolicyComponent{
    private _type: SimplePolicyType ;
    private _predicat: (object: Product | ProductCategory | ShoppingBag | User) => boolean;
    private answer: Answer;

    constructor(type: SimplePolicyType, predicat: (object: Product | ProductCategory | ShoppingBag | User) => boolean, msg: string ) {
        this._type = type;
        this._predicat = predicat;
        this.answer={ok: true, message: msg};
    }


    CanMakePurchase(object: Product | ProductCategory | ShoppingBag | User): Answer {
        this.answer.ok = this._predicat(object);
        return this.answer;
    }



}
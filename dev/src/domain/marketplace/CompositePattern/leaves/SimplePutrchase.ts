import {ImmediatePurchasePolicyComponent} from "../Components/ImmediatePurchasePolicyComponent";
import {ShoppingBag} from "../../../user/ShoppingBag";
import {SimplePolicyType} from "../../../../utilities/Enums";
import {Answer} from "../../../../utilities/Types";
import {Guest} from "../../../user/Guest";



export class SimplePutrchase implements ImmediatePurchasePolicyComponent{
    private _type: SimplePolicyType ;
    private _predicat: (purchaseInfo: [ShoppingBag, Guest]) => boolean;
    private answer: Answer;

    constructor(type: SimplePolicyType, predicat: (purchaseInfo: [ShoppingBag, Guest]) => boolean, msg: string ) {
        this._type = type;
        this._predicat = predicat;
        this.answer={ok: true, message: msg};
    }


    CanMakePurchase(purchaseInfo: [ShoppingBag, Guest]): Answer {
        this.answer.ok = this._predicat(purchaseInfo);
        return this.answer;
    }



}